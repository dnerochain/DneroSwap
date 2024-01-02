import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeWDneroContract } from 'hooks/useContract'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useContractRead } from 'wagmi'
import { WDneroLockStatus } from '../types'
import { useWDneroPoolLockInfo } from './useWDneroPoolLockInfo'
import { useCheckIsUserAllowMigrate } from './useCheckIsUserAllowMigrate'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export enum WDneroPoolLockStatus {
  LOCKING = 0,
  WITHDRAW = 1,
}

export type VeWDneroUserInfo = {
  // cake amount locked by user
  amount: bigint
  // end time of user lock
  end: bigint
  // lock through wdnero pool proxy
  // will zeroAddress if not locked through wdnero pool proxy
  wdneroPoolProxy: Address
  // cake amount locked by wdnero pool proxy
  wdneroAmount: bigint
  // lock end time of wdnero pool proxy
  lockEndTime: number
  // migration time of wdnero pool proxy
  migrationTime: number
  // wdnero pool type of wdnero pool proxy
  // 1: Migration
  // 2: Delegation
  wdneroPoolType: number
  // withdraw flag of wdnero pool proxy
  // 0: not withdraw
  // 1: already withdraw
  withdrawFlag: WDneroPoolLockStatus
}

export const useVeWDneroUserInfo = (): {
  data?: VeWDneroUserInfo
  refetch: () => void
} => {
  const veWDneroContract = useVeWDneroContract()
  const { account } = useAccountActiveChain()

  const { data, refetch } = useContractRead({
    chainId: veWDneroContract?.chain?.id,
    ...veWDneroContract,
    functionName: 'getUserInfo',
    enabled: Boolean(veWDneroContract?.address && account),
    args: [account!],
    watch: true,
    select: (d) => {
      if (!d) return undefined

      const [amount, end, wdneroPoolProxy, wdneroAmount, lockEndTime, migrationTime, wdneroPoolType, withdrawFlag] = d
      return {
        amount,
        end,
        wdneroPoolProxy,
        wdneroAmount,
        lockEndTime,
        migrationTime,
        wdneroPoolType,
        withdrawFlag,
      } as VeWDneroUserInfo
    },
  })
  return {
    data,
    refetch,
  }
}

export const useWDneroLockStatus = (): {
  status: WDneroLockStatus
  shouldMigrate: boolean
  wdneroLockedAmount: bigint
  nativeWDneroLockedAmount: bigint
  proxyWDneroLockedAmount: bigint
  wdneroLocked: boolean
  wdneroLockExpired: boolean
  wdneroPoolLocked: boolean
  wdneroPoolLockExpired: boolean
  wdneroUnlockTime: number
  wdneroPoolUnlockTime: number
} => {
  const currentTimestamp = useCurrentBlockTimestamp()
  const { data: userInfo } = useVeWDneroUserInfo()
  // if user locked at wdneroPool before, should migrate
  const wdneroPoolLockInfo = useWDneroPoolLockInfo()
  const isAllowMigrate = useCheckIsUserAllowMigrate(String(wdneroPoolLockInfo.lockEndTime))
  const shouldMigrate = useMemo(() => {
    return wdneroPoolLockInfo?.locked && userInfo?.wdneroPoolType !== 1 && isAllowMigrate
  }, [wdneroPoolLockInfo?.locked, isAllowMigrate, userInfo?.wdneroPoolType])
  const now = useMemo(() => dayjs.unix(currentTimestamp), [currentTimestamp])
  const wdneroLocked = useMemo(() => Boolean(userInfo && userInfo.amount > 0n), [userInfo])
  const wdneroUnlockTime = useMemo(() => {
    if (!userInfo) return 0
    return Number(userInfo.end)
  }, [userInfo])
  const wdneroLockExpired = useMemo(() => {
    if (!wdneroLocked) return false
    return dayjs.unix(wdneroUnlockTime).isBefore(now)
  }, [wdneroLocked, wdneroUnlockTime, now])
  const wdneroPoolLocked = useMemo(
    () => Boolean(userInfo?.wdneroAmount) && userInfo?.withdrawFlag !== WDneroPoolLockStatus.WITHDRAW,
    [userInfo],
  )
  const wdneroPoolLockExpired = useMemo(() => {
    if (!wdneroPoolLocked) return false
    return currentTimestamp > userInfo!.lockEndTime
  }, [wdneroPoolLocked, currentTimestamp, userInfo])

  const nativeWDneroLockedAmount = useMemo(() => {
    if (!userInfo) return BigInt(0)
    return userInfo.amount ?? 0n
  }, [userInfo])
  const proxyWDneroLockedAmount = useMemo(() => {
    if (!wdneroPoolLocked) return 0n

    return userInfo!.wdneroAmount ?? 0n
  }, [userInfo, wdneroPoolLocked])

  const wdneroLockedAmount = useMemo(() => {
    return nativeWDneroLockedAmount + proxyWDneroLockedAmount
  }, [nativeWDneroLockedAmount, proxyWDneroLockedAmount])

  const wdneroPoolUnlockTime = useMemo(() => {
    if (!wdneroPoolLocked) return 0
    return Number(userInfo!.lockEndTime)
  }, [userInfo, wdneroPoolLocked])

  const status = useMemo(() => {
    if ((!userInfo || !userInfo.amount) && !wdneroPoolLocked && !shouldMigrate) return WDneroLockStatus.NotLocked
    if (wdneroLockExpired) return WDneroLockStatus.Expired
    if ((userInfo?.amount && userInfo.end) || wdneroPoolLocked) return WDneroLockStatus.Locking
    if (shouldMigrate) return WDneroLockStatus.Migrate
    return WDneroLockStatus.NotLocked
  }, [userInfo, shouldMigrate, wdneroPoolLocked, wdneroLockExpired])

  return {
    status,
    shouldMigrate,
    wdneroLockedAmount,
    nativeWDneroLockedAmount,
    proxyWDneroLockedAmount,
    wdneroLocked,
    wdneroLockExpired,
    wdneroPoolLocked,
    wdneroPoolLockExpired,
    wdneroUnlockTime,
    wdneroPoolUnlockTime,
  }
}
