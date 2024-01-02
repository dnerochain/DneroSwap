import BigNumber from 'bignumber.js'
import { useTranslation } from '@dneroswap/localization'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'

import { useMemo } from 'react'

export const useUserEnoughWDneroValidator = (wdneroAmount: string, stakingTokenBalance: BigNumber) => {
  const { t } = useTranslation()
  const errorMessage = t('Insufficient WDNERO balance')

  const userNotEnoughWDnero = useMemo(() => {
    if (new BigNumber(wdneroAmount).gt(getBalanceAmount(stakingTokenBalance, 18))) return true
    return false
  }, [wdneroAmount, stakingTokenBalance])
  return { userNotEnoughWDnero, notEnoughErrorMessage: errorMessage }
}
