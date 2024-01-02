import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

import { useIfUserLocked } from './useStakedPools'

export default function useIsBoost({ minBoostAmount, boostDayPercent }) {
  const { locked, amount: lockedWDneroAmount } = useIfUserLocked()

  return Boolean(
    boostDayPercent > 0 &&
      locked &&
      lockedWDneroAmount.gte(getBalanceAmount(new BigNumber(minBoostAmount || ('0' as unknown as BigNumber.Value)))),
  )
}
