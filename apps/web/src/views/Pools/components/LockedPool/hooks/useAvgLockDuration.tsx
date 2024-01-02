import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from '@dneroswap/pools'
import BigNumber from 'bignumber.js'
import { useWDneroVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from '@dneroswap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalWDneroInVault, pricePerFullShare } = useWDneroVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleWDneroAmount = totalWDneroInVault.minus(totalLockedAmount)
    const flexibleWDneroShares = flexibleWDneroAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const lockedWDneroBoostedShares = totalShares.minus(flexibleWDneroShares)
    const lockedWDneroOriginalShares = totalLockedAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const avgBoostRatio = lockedWDneroBoostedShares.div(lockedWDneroOriginalShares)

    return (
      Math.round(
        avgBoostRatio
          .minus(1)
          .times(new BigNumber(DURATION_FACTOR.toString()))
          .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
          .toNumber(),
      ) || 0
    )
  }, [totalWDneroInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  const avgLockDurationsInWeeksNum = useMemo(
    () => secondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInWeeksNum,
    avgLockDurationsInSeconds,
  }
}
