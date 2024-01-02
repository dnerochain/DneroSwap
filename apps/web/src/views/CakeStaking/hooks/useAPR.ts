import { ChainId } from '@dneroswap/chains'
import { Percent } from '@dneroswap/swap-sdk-core'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { WDNERO_PER_BLOCK } from 'config'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { WEEK } from 'config/constants/veWDnero'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useVeWDneroBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { getMasterChefV2Address, getRevenueSharingVeWDneroAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { useContractRead } from 'wagmi'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'
import { useVeWDneroTotalSupply } from './useVeWDneroTotalSupply'
import { useVeWDneroUserInfo } from './useVeWDneroUserInfo'

export const useUserWDneroTVL = (): bigint => {
  const { data } = useVeWDneroUserInfo()

  return useMemo(() => {
    if (!data) return 0n
    return data.amount + data.wdneroAmount
  }, [data])
}

// A mock pool which OP harvests weekly and inject rewards to RevenueSharingVeWDnero
const pid = 172n

export const useUserSharesPercent = (): Percent => {
  const { balance } = useVeWDneroBalance()
  const { data: totalSupply } = useVeWDneroTotalSupply()

  return useMemo(() => {
    if (!totalSupply) return new Percent(0, 1)
    return new Percent(balance.toString(), totalSupply.toString())
  }, [balance, totalSupply])
}

export const useWDneroPoolEmission = () => {
  const { chainId } = useActiveChainId()
  const client = useMemo(() => {
    return publicClient({
      chainId: chainId && [ChainId.DNERO, ChainId.DNERO_TESTNET].includes(chainId) ? chainId : ChainId.DNERO,
    })
  }, [chainId])

  const { data } = useQuery(['vewdnero/wdneroPoolEmission', client.chain.id], async () => {
    const response = await client.multicall({
      contracts: [
        {
          address: getMasterChefV2Address(client.chain.id),
          abi: masterChefV2ABI,
          functionName: 'wdneroRateToSpecialFarm',
        } as const,
        {
          address: getMasterChefV2Address(client.chain.id),
          abi: masterChefV2ABI,
          functionName: 'poolInfo',
          args: [pid],
        } as const,
        {
          address: getMasterChefV2Address(client.chain.id),
          abi: masterChefV2ABI,
          functionName: 'totalSpecialAllocPoint',
        } as const,
      ],
      allowFailure: false,
    })

    const wdneroRateToSpecialFarm = response[0] ?? 0n
    const allocPoint = response[1][2] ?? 0n
    const totalSpecialAllocPoint = response[2] ?? 0n
    return [wdneroRateToSpecialFarm, allocPoint, totalSpecialAllocPoint]
  })

  return useMemo(() => {
    if (!data) return BIG_ZERO
    const [wdneroRateToSpecialFarm, allocPoint, totalSpecialAllocPoint] = data

    return new BigNumber(WDNERO_PER_BLOCK)
      .times(new BigNumber(wdneroRateToSpecialFarm.toString()).div(1e12))
      .times(allocPoint.toString())
      .div((totalSpecialAllocPoint ?? 1n).toString())
  }, [data])
}

export const useWDneroPoolAPR = () => {
  const wdneroPoolEmission = useWDneroPoolEmission()
  const userSharesPercent = useUserSharesPercent()
  const userWDneroTVL = useUserWDneroTVL()

  return useMemo(() => {
    if (!wdneroPoolEmission || !userSharesPercent?.denominator || !userWDneroTVL) return new Percent(0, 1)

    return new Percent(
      new BigNumber(wdneroPoolEmission)
        .times(1e18)
        .times(24 * 60 * 60 * 365)
        .times(userSharesPercent.numerator.toString())
        .toFixed(0),
      (userWDneroTVL * userSharesPercent.denominator * 3n).toString(),
    )
  }, [wdneroPoolEmission, userSharesPercent, userWDneroTVL])
}

const SECONDS_IN_YEAR = 31536000 // 365 * 24 * 60 * 60

export const useRevShareEmission = () => {
  const { chainId } = useActiveChainId()
  const currentTimestamp = useCurrentBlockTimestamp()
  const { data: totalDistributed } = useContractRead({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeWDneroAddress(chainId) ?? getRevenueSharingVeWDneroAddress(ChainId.DNERO),
    functionName: 'totalDistributed',
    chainId,
  })
  const lastThursday = useMemo(() => {
    return Math.floor(currentTimestamp / WEEK) * WEEK
  }, [currentTimestamp])
  return useMemo(() => {
    if (!totalDistributed) return BIG_ZERO
    // 1700697600 is the timestamp of the first distribution
    return new BigNumber(totalDistributed.toString()).dividedBy(lastThursday - 1700697600)
  }, [totalDistributed, lastThursday])
}

export const useRevenueSharingAPR = () => {
  const userSharesPercent = useUserSharesPercent()
  const userWDneroTVL = useUserWDneroTVL()
  const revShareEmission = useRevShareEmission()

  return useMemo(() => {
    if (!revShareEmission || !userSharesPercent?.denominator || !userWDneroTVL) return new Percent(0, 1)
    return new Percent(
      new BigNumber(revShareEmission).times(SECONDS_IN_YEAR).times(userSharesPercent.numerator.toString()).toFixed(0),
      (userWDneroTVL * userSharesPercent.denominator).toString(),
    )
  }, [revShareEmission, userWDneroTVL, userSharesPercent])
}

export const useVeWDneroAPR = () => {
  const wdneroPoolAPR = useWDneroPoolAPR()
  const revenueSharingAPR = useRevenueSharingAPR()

  const totalAPR = useMemo(() => {
    if (!wdneroPoolAPR || !revenueSharingAPR) return new Percent(0, 1)
    return wdneroPoolAPR.add(revenueSharingAPR)
  }, [wdneroPoolAPR, revenueSharingAPR])

  return {
    totalAPR,
    wdneroPoolAPR,
    revenueSharingAPR,
  }
}
