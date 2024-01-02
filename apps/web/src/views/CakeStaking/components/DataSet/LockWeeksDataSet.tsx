import { useTranslation } from '@dneroswap/localization'
import { FlexGap, Text, TooltipText } from '@dneroswap/uikit'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import { WEEK } from 'config/constants/veWDnero'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { getVeWDneroAmount } from 'utils/getVeWDneroAmount'
import { useCurrentBlockTimestamp } from 'views/WDneroStaking/hooks/useCurrentBlockTimestamp'
import { useRoundedUnlockTimestamp } from 'views/WDneroStaking/hooks/useRoundedUnlockTimestamp'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { Tooltips } from '../Tooltips'
import { DataBox, DataHeader, DataRow } from './DataBox'
import { formatDate } from './format'

export const LockWeeksDataSet = () => {
  const { t } = useTranslation()
  const { wdneroLockWeeks } = useLockWDneroData()
  const { wdneroLockExpired, wdneroUnlockTime, nativeWDneroLockedAmount } = useWDneroLockStatus()
  const currentTimestamp = useCurrentBlockTimestamp()
  const veWDneroAmountBN = useMemo(() => {
    const duration = wdneroUnlockTime - currentTimestamp + Number(wdneroLockWeeks || 0) * WEEK
    return new BN(getVeWDneroAmount(nativeWDneroLockedAmount.toString(), duration))
  }, [wdneroLockWeeks, wdneroUnlockTime, currentTimestamp, nativeWDneroLockedAmount])

  const factor =
    veWDneroAmountBN && veWDneroAmountBN.gt(0)
      ? `${veWDneroAmountBN.div(nativeWDneroLockedAmount.toString()).toPrecision(2)}x`
      : '0.00x'

  const newUnlockTimestamp = useRoundedUnlockTimestamp(wdneroLockExpired ? undefined : Number(wdneroUnlockTime))
  const newUnlockTime = useMemo(() => {
    return formatDate(dayjs.unix(Number(newUnlockTimestamp)))
  }, [newUnlockTimestamp])

  return (
    <DataBox gap="8px">
      <DataHeader value={String(getBalanceAmount(veWDneroAmountBN).toFixed(2))} />
      <DataRow
        label={
          <Tooltips
            content={t(
              'The ratio factor between the amount of WDNERO locked and the final veWDNERO number. Extend your lock duration for a higher ratio factor.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('factor')}
            </TooltipText>
          </Tooltips>
        }
        value={factor}
      />
      <DataRow
        label={
          <Tooltips
            content={t(
              'Once locked, your WDNERO will be staked in veWDNERO contract until this date. Early withdrawal is not available.',
            )}
          >
            <TooltipText fontSize={12} bold color="textSubtle" textTransform="uppercase">
              {t('unlock on')}
            </TooltipText>
          </Tooltips>
        }
        value={wdneroLockExpired && !wdneroLockWeeks ? <ExpiredUnlockTime time={wdneroUnlockTime!} /> : newUnlockTime}
      />
    </DataBox>
  )
}

const ExpiredUnlockTime: React.FC<{
  time: number
}> = ({ time }) => {
  const { t } = useTranslation()
  return (
    <FlexGap gap="2px" alignItems="baseline">
      <Text fontSize={12}>{formatDate(dayjs.unix(time))}</Text>
      <Text fontWeight={700} fontSize={16} color="#D67E0A">
        {t('Unlocked')}
      </Text>
    </FlexGap>
  )
}
