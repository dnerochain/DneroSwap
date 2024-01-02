import { TranslateFunction } from '@dneroswap/localization'
import { ManagerFeeType } from '@dneroswap/position-managers'

export function getReadableManagerFeeType(t: TranslateFunction, feeType: ManagerFeeType) {
  switch (feeType) {
    case ManagerFeeType.LP_REWARDS:
      return t('% of LP rewards')
    default:
      return ''
  }
}
