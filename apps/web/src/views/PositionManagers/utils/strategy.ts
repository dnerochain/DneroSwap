import { TranslateFunction } from '@dneroswap/localization'
import { Strategy } from '@dneroswap/position-managers'

export function getStrategyName(t: TranslateFunction, strategy: Strategy) {
  switch (strategy) {
    case Strategy.TYPICAL_WIDE:
      return t('Typical Wide')
    case Strategy.YIELD_IQ:
      return t('Yield IQ')
    case Strategy.ACTIVE:
      return t('Active')
    case Strategy.PASSIVE:
      return t('Passive')
    case Strategy.PEGGED:
      return t('Pegged')
    case Strategy.ALO:
      return t('Automated Liquidity Optimization')
    default:
      return ''
  }
}
