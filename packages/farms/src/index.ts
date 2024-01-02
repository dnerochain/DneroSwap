import { ChainId } from '@dneroswap/chains'
import BigNumber from 'bignumber.js'
import { PublicClient, formatEther } from 'viem'
import {
  FarmSupportedChainId,
  FarmV2SupportedChainId,
  FarmV3SupportedChainId,
  bWDneroSupportedChainId,
  masterChefAddresses,
  masterChefV3Addresses,
  supportedChainId,
  supportedChainIdV2,
  supportedChainIdV3,
} from './const'
import {
  CommonPrice,
  LPTvl,
  farmV3FetchFarms,
  fetchCommonTokenUSDValue,
  fetchMasterChefV3Data,
  fetchTokenUSDValues,
  getWDneroApr,
} from './fetchFarmsV3'
import { ComputedFarmConfigV3, FarmV3DataWithPrice } from './types'
import { FetchFarmsParams, farmV2FetchFarms, fetchMasterChefV2Data } from './v2/fetchFarmsV2'

export {
  bWDneroSupportedChainId,
  supportedChainId,
  supportedChainIdV2,
  supportedChainIdV3,
  type FarmSupportedChainId,
  type FarmV3SupportedChainId,
}

export function createFarmFetcher(provider: ({ chainId }: { chainId: FarmV2SupportedChainId }) => PublicClient) {
  const fetchFarms = async (
    params: {
      isTestnet: boolean
    } & Pick<FetchFarmsParams, 'chainId' | 'farms'>,
  ) => {
    const { isTestnet, farms, chainId } = params
    const masterChefAddress = isTestnet ? masterChefAddresses[ChainId.DNERO_TESTNET] : masterChefAddresses[ChainId.DNERO]
    const { poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, wdneroPerBlock } = await fetchMasterChefV2Data({
      isTestnet,
      provider,
      masterChefAddress,
    })
    const regularWDneroPerBlock = formatEther(wdneroPerBlock)
    const farmsWithPrice = await farmV2FetchFarms({
      provider,
      masterChefAddress,
      isTestnet,
      chainId,
      farms: farms.filter((f) => !f.pid || poolLength > f.pid),
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
    })

    return {
      farmsWithPrice,
      poolLength: Number(poolLength),
      regularWDneroPerBlock: +regularWDneroPerBlock,
      totalRegularAllocPoint: totalRegularAllocPoint.toString(),
    }
  }

  return {
    fetchFarms,
    isChainSupported: (chainId: number) => supportedChainIdV2.includes(chainId),
    supportedChainId: supportedChainIdV2,
    isTestnet: (chainId: number) => ![ChainId.DNERO, ChainId.ETHEREUM].includes(chainId),
  }
}

export function createFarmFetcherV3(provider: ({ chainId }: { chainId: number }) => PublicClient) {
  const fetchFarms = async ({
    farms,
    chainId,
    commonPrice,
  }: {
    farms: ComputedFarmConfigV3[]
    chainId: FarmV3SupportedChainId
    commonPrice: CommonPrice
  }) => {
    const masterChefAddress = masterChefV3Addresses[chainId]
    if (!masterChefAddress || !provider) {
      throw new Error('Unsupported chain')
    }

    try {
      const { poolLength, totalAllocPoint, latestPeriodWDneroPerSecond } = await fetchMasterChefV3Data({
        provider,
        masterChefAddress,
        chainId,
      })

      const wdneroPerSecond = new BigNumber(latestPeriodWDneroPerSecond.toString()).div(1e18).div(1e12).toString()

      const farmsWithPrice = await farmV3FetchFarms({
        farms,
        chainId,
        provider,
        masterChefAddress,
        totalAllocPoint,
        commonPrice,
      })

      return {
        chainId,
        poolLength: Number(poolLength),
        farmsWithPrice,
        wdneroPerSecond,
        totalAllocPoint: totalAllocPoint.toString(),
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getWDneroAprAndTVL = (farm: FarmV3DataWithPrice, lpTVL: LPTvl, wdneroPrice: string, wdneroPerSecond: string) => {
    const [token0Price, token1Price] = farm.token.sortsBefore(farm.quoteToken)
      ? [farm.tokenPriceBusd, farm.quoteTokenPriceBusd]
      : [farm.quoteTokenPriceBusd, farm.tokenPriceBusd]
    const tvl = new BigNumber(token0Price).times(lpTVL.token0).plus(new BigNumber(token1Price).times(lpTVL.token1))

    const wdneroApr = getWDneroApr(farm.poolWeight, tvl, wdneroPrice, wdneroPerSecond)

    return {
      activeTvlUSD: tvl.toString(),
      activeTvlUSDUpdatedAt: lpTVL.updatedAt,
      wdneroApr,
    }
  }

  return {
    fetchFarms,
    getWDneroAprAndTVL,
    isChainSupported: (chainId: number): chainId is FarmV3SupportedChainId => supportedChainIdV3.includes(chainId),
    supportedChainId: supportedChainIdV3,
    isTestnet: (chainId: number) => ![ChainId.DNERO, ChainId.ETHEREUM].includes(chainId),
  }
}

export * from './apr'
export { FARM_AUCTION_HOSTING_IN_SECONDS } from './const'
export * from './types'
export * from './utils'
export * from './v2/deserializeFarm'
export * from './v2/deserializeFarmUserData'
export type { FarmWithPrices } from './v2/farmPrices'
export * from './v2/farmsPriceHelpers'
export * from './v2/filterFarmsByQuery'

export { fetchCommonTokenUSDValue, fetchTokenUSDValues, masterChefV3Addresses }
