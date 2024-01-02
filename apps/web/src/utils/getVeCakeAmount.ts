import { MAX_VEWDNERO_LOCK_WEEKS, WEEK } from 'config/constants/veWDnero'
import BN from 'bignumber.js'

export const getVeWDneroAmount = (wdneroToLocked: number | bigint | string, seconds: number | string): number => {
  return new BN(String(wdneroToLocked || 0))
    .times(seconds || 0)
    .div(MAX_VEWDNERO_LOCK_WEEKS * WEEK)
    .toNumber()
}
