import { Percent } from '@dneroswap/sdk'

export const BIG_INT_TEN = 10n
// one basis point
export const BIPS_BASE = 10000n

// used to ensure the user doesn't send so much DTOKEN so they end up with <.01
export const MIN_DTOKEN: bigint = BIG_INT_TEN ** 16n // .01 DTOKEN
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)
