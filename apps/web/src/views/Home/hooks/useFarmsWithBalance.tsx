import BigNumber from 'bignumber.js'
import { FAST_INTERVAL } from 'config/constants'
import { SerializedFarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useFarmsLength } from 'state/farms/hooks'
import { getFarmConfig } from '@dneroswap/farms/constants'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { useBWDneroProxyContract, useWDnero, useMasterchef, useMasterchefV3 } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useStakedPositionsByUser } from 'state/farmsV3/hooks'
import { useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { verifyDneroNetwork } from 'utils/verifyDneroNetwork'
import { publicClient } from 'utils/wagmi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { useQuery } from '@tanstack/react-query'
import { useBWDneroProxyContractAddress } from '../../Farms/hooks/useBWDneroProxyContractAddress'
import splitProxyFarms from '../../Farms/components/YieldBooster/helpers/splitProxyFarms'

export type FarmWithBalance = {
  balance: BigNumber
  contract: any
} & SerializedFarmConfig

const useFarmsWithBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { data: poolLength } = useFarmsLength()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBWDneroProxyContractAddress(account, chainId)
  const bWDneroProxy = useBWDneroProxyContract(proxyAddress)
  const masterChefContract = useMasterchef()
  const wdnero = useWDnero()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const { tokenIdResults: v3PendingWDneros } = useStakedPositionsByUser(stakedTokenIds)

  const getFarmsWithBalances = useCallback(
    async (farms: SerializedFarmConfig[], accountToCheck: string, contract) => {
      const result = await publicClient({ chainId }).multicall({
        contracts: farms.map((farm) => ({
          abi: masterChefV2ABI,
          address: masterChefContract.address,
          functionName: 'pendingWDnero',
          args: [farm.pid, accountToCheck],
        })),
      })

      const proxyWDneroBalance =
        contract.address !== masterChefContract.address && bWDneroProxy && cake
          ? await wdnero.read.balanceOf([bWDneroProxy.address])
          : null

      const proxyWDneroBalanceNumber = proxyWDneroBalance ? getBalanceNumber(new BigNumber(proxyWDneroBalance.toString())) : 0
      const results = farms.map((farm, index) => ({
        ...farm,
        balance: new BigNumber((result[index].result as bigint).toString()),
      }))
      const farmsWithBalances: FarmWithBalance[] = results
        .filter((balanceType) => balanceType.balance.gt(0))
        .map((farm) => ({
          ...farm,
          contract,
        }))
      const totalEarned = farmsWithBalances.reduce((accum, earning) => {
        const earningNumber = new BigNumber(earning.balance)
        if (earningNumber.eq(0)) {
          return accum
        }
        return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
      }, 0)
      return { farmsWithBalances, totalEarned: totalEarned + proxyWDneroBalanceNumber }
    },
    [bWDneroProxy, cake, chainId, masterChefContract?.address],
  )

  const {
    data: { farmsWithStakedBalance, earningsSum } = {
      farmsWithStakedBalance: [] as FarmWithBalance[],
      earningsSum: null,
    },
  } = useQuery(
    [account, 'farmsWithBalance', chainId, poolLength],
    async () => {
      if (!account || !poolLength || !chainId) return undefined
      const farmsConfig = await getFarmConfig(chainId)
      const farmsCanFetch = farmsConfig?.filter((f) => poolLength > f.pid)
      const normalBalances = await getFarmsWithBalances(farmsCanFetch ?? [], account, masterChefContract)
      if (proxyAddress && farmsCanFetch?.length && verifyDneroNetwork(chainId)) {
        const { farmsWithProxy } = splitProxyFarms(farmsCanFetch)

        const proxyBalances = await getFarmsWithBalances(farmsWithProxy, proxyAddress, bWDneroProxy)
        return {
          farmsWithStakedBalance: [...normalBalances.farmsWithBalances, ...proxyBalances.farmsWithBalances],
          earningsSum: normalBalances.totalEarned + proxyBalances.totalEarned,
        }
      }
      return {
        farmsWithStakedBalance: normalBalances.farmsWithBalances,
        earningsSum: normalBalances.totalEarned,
      }
    },
    {
      enabled: Boolean(account && poolLength && chainId && !isProxyContractAddressLoading),
      refetchInterval: FAST_INTERVAL,
    },
  )

  const v3FarmsWithBalance = useMemo(
    () =>
      stakedTokenIds
        .map((tokenId, i) => {
          if (v3PendingWDneros?.[i] > 0n) {
            return {
              sendTx: {
                tokenId: tokenId.toString(),
                to: account,
              },
            }
          }
          return null
        })
        .filter(Boolean),
    [stakedTokenIds, v3PendingWDneros, account],
  )

  return useMemo(() => {
    return {
      farmsWithStakedBalance: [...farmsWithStakedBalance, ...v3FarmsWithBalance],
      earningsSum:
        (earningsSum ?? 0) +
          v3PendingWDneros?.reduce((accum, earning) => {
            const earningNumber = new BigNumber(earning.toString())
            if (earningNumber.eq(0)) {
              return accum
            }
            return accum + earningNumber.div(DEFAULT_TOKEN_DECIMAL).toNumber()
          }, 0) ?? 0,
    }
  }, [earningsSum, farmsWithStakedBalance, v3FarmsWithBalance, v3PendingWDneros])
}

export default useFarmsWithBalance
