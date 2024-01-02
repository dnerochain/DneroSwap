import { useTranslation } from '@dneroswap/localization'
import { TooltipText } from '@dneroswap/uikit'
import { getBalanceAmount, getDecimalAmount } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useVeWDneroBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { getVeWDneroAmount } from 'utils/getVeWDneroAmount'
import { useCurrentBlockTimestamp } from 'views/WDneroStaking/hooks/useCurrentBlockTimestamp'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

export const LockWDneroDataSet = () => {
  const { t } = useTranslation()
  const { balance: veWDneroBalance } = useVeWDneroBalance()
  const { wdneroUnlockTime, wdneroLockedAmount } = useWDneroLockStatus()
  const { wdneroLockAmount } = useLockWDneroData()
  const amountInputBN = useMemo(() => getDecimalAmount(new BN(wdneroLockAmount || 0)), [wdneroLockAmount])
  const amountLockedBN = useMemo(() => getBalanceAmount(new BN(wdneroLockedAmount.toString() || '0')), [wdneroLockedAmount])
  const amount = useMemo(() => {
    return getBalanceAmount(amountInputBN.plus(amountLockedBN))
  }, [amountInputBN, amountLockedBN])
  const currentTimestamp = useCurrentBlockTimestamp()
  const veWDneroAmount = useMemo(() => {
    return getBalanceAmount(veWDneroBalance).plus(getVeWDneroAmount(wdneroLockAmount, wdneroUnlockTime - currentTimestamp))
  }, [wdneroLockAmount, wdneroUnlockTime, currentTimestamp, veWDneroBalance])

  const unlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(wdneroUnlockTime)))
  }, [wdneroUnlockTime])

  return (
    <DataBox gap="8px">
      <DataHeader value={String(veWDneroAmount.toFixed(2))} />
      <DataRow label={t('WDNERO to be locked')} value={amount.toFixed(2)} />
      <DataRow
        label={
          <Tooltips
            content={t(
              'Once locked, your WDNERO will be staked in veWDNERO contract until this date. Early withdrawal is not available.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('Unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={unlockTime}
      />
    </DataBox>
  )
}
