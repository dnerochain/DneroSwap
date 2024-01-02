import { MAX_VEWDNERO_LOCK_WEEKS, WEEK } from 'config/constants/veWDnero'
import dayjs from 'dayjs'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export const useRoundedUnlockTimestamp = (startTimestamp?: number): bigint | undefined => {
  const { wdneroLockWeeks } = useLockWDneroData()
  const currentTimestamp = useCurrentBlockTimestamp()

  const week = Number(wdneroLockWeeks) || 0

  const maxUnlockTimestamp = dayjs.unix(currentTimestamp).add(MAX_VEWDNERO_LOCK_WEEKS, 'weeks').unix()
  const userUnlockTimestamp = dayjs
    .unix(startTimestamp || currentTimestamp)
    .add(week, 'weeks')
    .unix()

  const unlockTimestamp = userUnlockTimestamp > maxUnlockTimestamp ? maxUnlockTimestamp : userUnlockTimestamp
  const roundUnlockTimestamp = BigInt(Math.floor(unlockTimestamp / WEEK) * WEEK)

  return roundUnlockTimestamp
}
