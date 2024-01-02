import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useMemo } from 'react'
import { useWDneroVaultPublicData, useWDneroVaultUserData } from 'state/pools/hooks'
import { getBWDneroMultiplier } from 'views/Farms/components/YieldBooster/components/BWDneroCalculator'
import { useUserLockedWDneroStatus } from 'views/Farms/hooks/useUserLockedWDneroStatus'
import useAvgLockDuration from 'views/Pools/components/LockedPool/hooks/useAvgLockDuration'
import { secondsToDays } from 'views/Pools/components/utils/formatSecondsToWeeks'
import useFarmBoosterConstants from './useFarmBoosterConstants'

export const useGetBoostedMultiplier = (userBalanceInFarm: BigNumber, lpTokenStakedAmount: BigNumber) => {
  useWDneroVaultPublicData()
  useWDneroVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, lockedAmount, totalLockedAmount, lockedStart, lockedEnd } = useUserLockedWDneroStatus()
  const { constants, isLoading: isFarmConstantsLoading } = useFarmBoosterConstants()
  const bWDneroMultiplier = useMemo(() => {
    const result =
      !isLoading && !isFarmConstantsLoading
        ? getBWDneroMultiplier(
            userBalanceInFarm, // userBalanceInFarm,
            lockedAmount, // userLockAmount
            secondsToDays(_toNumber(lockedEnd) - _toNumber(lockedStart)), // userLockDuration
            totalLockedAmount, // totalLockAmount
            lpTokenStakedAmount, // lpBalanceOfFarm
            avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration
            constants.cA,
            constants.cB,
          )
        : null
    return !result || result.toString() === 'NaN' ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    lockedEnd,
    lockedStart,
    isLoading,
    isFarmConstantsLoading,
    constants,
  ])
  return _toNumber(bWDneroMultiplier)
}

export const useGetCalculatorMultiplier = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  lockedAmount: BigNumber,
  userLockDuration: number,
) => {
  useWDneroVaultPublicData()
  useWDneroVaultUserData()
  const { avgLockDurationsInSeconds } = useAvgLockDuration()
  const { isLoading, totalLockedAmount } = useUserLockedWDneroStatus()
  const { constants, isLoading: isFarmConstantsLoading } = useFarmBoosterConstants()
  const bWDneroMultiplier = useMemo(() => {
    const result =
      !isLoading && !isFarmConstantsLoading
        ? getBWDneroMultiplier(
            userBalanceInFarm, // userBalanceInFarm,
            lockedAmount, // userLockAmount
            secondsToDays(userLockDuration), // userLockDuration
            totalLockedAmount, // totalLockAmount
            lpTokenStakedAmount, // lpBalanceOfFarm
            avgLockDurationsInSeconds ? secondsToDays(avgLockDurationsInSeconds) : 280, // AverageLockDuration,
            constants.cA,
            constants.cB,
          )
        : null
    return !result || result.toString() === 'NaN' ? '1.000' : result.toFixed(3)
  }, [
    userBalanceInFarm,
    lpTokenStakedAmount,
    totalLockedAmount,
    avgLockDurationsInSeconds,
    lockedAmount,
    isLoading,
    isFarmConstantsLoading,
    userLockDuration,
    constants,
  ])
  return _toNumber(bWDneroMultiplier)
}

const useGetBoostedAPR = (
  userBalanceInFarm: BigNumber,
  lpTokenStakedAmount: BigNumber,
  apr: number,
  lpRewardsApr: number,
) => {
  const bWDneroMultiplier = useGetBoostedMultiplier(userBalanceInFarm, lpTokenStakedAmount)
  return (apr * bWDneroMultiplier + lpRewardsApr).toFixed(2)
}

export default useGetBoostedAPR
