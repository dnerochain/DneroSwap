import BN from 'bignumber.js'
import { formatUnits } from 'viem'
import { SerializedFarmConfig, FarmWithPrices } from '@dneroswap/farms'
import { CurrencyAmount, Pair } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { BUSD, WDNERO } from '@dneroswap/tokens'
import { farmFetcher } from './helper'
import { FarmKV, FarmResult } from './kv'
import { updateLPsAPR } from './lpApr'
import { dneroClient, dneroTestnetClient } from './provider'

// copy from src/config, should merge them later
const DNERO_BLOCK_TIME = 3
const BLOCKS_PER_YEAR = (60 / DNERO_BLOCK_TIME) * 60 * 24 * 365 // 10512000

const FIXED_ZERO = new BN(0)
const FIXED_100 = new BN(100)

export const getFarmWDneroRewardApr = (farm: FarmWithPrices, wdneroPriceBusd: BN, regularWDneroPerBlock: number) => {
  let wdneroRewardsAprAsString = '0'
  if (!wdneroPriceBusd) {
    return wdneroRewardsAprAsString
  }
  const totalLiquidity = new BN(farm.lpTotalInQuoteToken).times(new BN(farm.quoteTokenPriceBusd))
  const poolWeight = new BN(farm.poolWeight)
  if (totalLiquidity.isZero() || poolWeight.isZero()) {
    return wdneroRewardsAprAsString
  }
  const yearlyWDneroRewardAllocation = poolWeight
    ? poolWeight.times(new BN(BLOCKS_PER_YEAR).times(new BN(String(regularWDneroPerBlock))))
    : FIXED_ZERO
  const wdneroRewardsApr = yearlyWDneroRewardAllocation.times(wdneroPriceBusd).div(totalLiquidity).times(FIXED_100)
  if (!wdneroRewardsApr.isZero()) {
    wdneroRewardsAprAsString = wdneroRewardsApr.toFixed(2)
  }
  return wdneroRewardsAprAsString
}

const pairAbi = [
  {
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: 'blockTimestampLast',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const wdneroBusdPairMap = {
  [ChainId.DNERO]: {
    address: Pair.getAddress(WDNERO[ChainId.DNERO], BUSD[ChainId.DNERO]),
    tokenA: WDNERO[ChainId.DNERO],
    tokenB: BUSD[ChainId.DNERO],
  },
  [ChainId.DNERO_TESTNET]: {
    address: Pair.getAddress(WDNERO[ChainId.DNERO_TESTNET], BUSD[ChainId.DNERO_TESTNET]),
    tokenA: WDNERO[ChainId.DNERO_TESTNET],
    tokenB: BUSD[ChainId.DNERO_TESTNET],
  },
}

const getWDneroPrice = async (isTestnet: boolean) => {
  const pairConfig = wdneroBusdPairMap[isTestnet ? ChainId.DNERO_TESTNET : ChainId.DNERO]
  const client = isTestnet ? dneroTestnetClient : dneroClient
  const [reserve0, reserve1] = await client.readContract({
    abi: pairAbi,
    address: pairConfig.address,
    functionName: 'getReserves',
  })

  const { tokenA, tokenB } = pairConfig

  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
  )

  return pair.priceOf(tokenA)
}

const farmConfigApi = 'https://farms-config.pages.dev'

export async function saveFarms(chainId: number, event: ScheduledEvent | FetchEvent) {
  try {
    const isTestnet = farmFetcher.isTestnet(chainId)
    const farmsConfig = await (await fetch(`${farmConfigApi}/${chainId}.json`)).json<SerializedFarmConfig[]>()
    let lpPriceHelpers: SerializedFarmConfig[] = []
    try {
      lpPriceHelpers = await (
        await fetch(`${farmConfigApi}/priceHelperLps/${chainId}.json`)
      ).json<SerializedFarmConfig[]>()
    } catch (error) {
      console.error('Get LP price helpers error', error)
    }

    if (!farmsConfig) {
      throw new Error(`Farms config not found ${chainId}`)
    }
    const { farmsWithPrice, poolLength, regularWDneroPerBlock } = await farmFetcher.fetchFarms({
      chainId,
      isTestnet,
      farms: farmsConfig.filter((f) => f.pid !== 0).concat(lpPriceHelpers),
    })

    const wdneroBusdPrice = await getWDneroPrice(isTestnet)
    const lpAprs = await handleLpAprs(chainId, farmsConfig)

    const finalFarm = farmsWithPrice.map((f) => {
      return {
        ...f,
        lpApr: lpAprs?.[f.lpAddress.toLowerCase()] || 0,
        wdneroApr: getFarmWDneroRewardApr(f, new BN(wdneroBusdPrice.toSignificant(3)), regularWDneroPerBlock),
      }
    }) as FarmResult

    const savedFarms = {
      updatedAt: new Date().toISOString(),
      poolLength,
      regularWDneroPerBlock,
      data: finalFarm,
    }

    event.waitUntil(FarmKV.saveFarms(chainId, savedFarms))

    return savedFarms
  } catch (error) {
    console.error('[ERROR] fetching farms', error)
    throw error
  }
}

export async function handleLpAprs(chainId: number, farmsConfig?: SerializedFarmConfig[]) {
  let lpAprs = await FarmKV.getApr(chainId)
  if (!lpAprs) {
    lpAprs = await saveLPsAPR(chainId, farmsConfig)
  }
  return lpAprs || {}
}

export async function saveLPsAPR(chainId: number, farmsConfig?: SerializedFarmConfig[]) {
  // TODO: add other chains
  if (chainId === 56) {
    let data = farmsConfig
    if (!data) {
      const value = await FarmKV.getFarms(chainId)
      if (value && value.data) {
        // eslint-disable-next-line prefer-destructuring
        data = value.data
      }
    }
    if (data) {
      const aprMap = (await updateLPsAPR(chainId, data)) || null
      FarmKV.saveApr(chainId, aprMap)
      return aprMap || null
    }
    return null
  }
  return null
}

const chainlinkAbi = [
  {
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export async function fetchWDneroPrice() {
  const address = '0xB6064eD41d4f67e353768aA239cA86f4F73665a1'
  const latestAnswer = await dneroClient.readContract({
    abi: chainlinkAbi,
    address,
    functionName: 'latestAnswer',
  })

  return formatUnits(latestAnswer, 8)
}
