import { ChainId } from '@dneroswap/chains'
import { useTranslation } from '@dneroswap/localization'
import { WDNERO } from '@dneroswap/tokens'
import { Flex, FlexGap, Text, TokenImage } from '@dneroswap/uikit'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { ApproveAndLockStatus } from 'state/vewdnero/atoms'
import { useRoundedUnlockTimestamp } from 'views/WDneroStaking/hooks/useRoundedUnlockTimestamp'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'

type LockInfoProps = {
  amount: string
  week: string | number
  status: ApproveAndLockStatus
}

export const LockInfo: React.FC<LockInfoProps> = ({ amount, status }) => {
  const { wdneroUnlockTime, nativeWDneroLockedAmount, wdneroLockExpired } = useWDneroLockStatus()

  const txAmount = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_WEEKS, ApproveAndLockStatus.INCREASE_WEEKS_PENDING].includes(status)) {
      return getBalanceNumber(new BN(nativeWDneroLockedAmount.toString()))
    }
    return amount
  }, [status, nativeWDneroLockedAmount, amount])

  const roundedUnlockTimestamp = useRoundedUnlockTimestamp(wdneroLockExpired ? undefined : Number(wdneroUnlockTime))

  const txUnlock = useMemo(() => {
    if ([ApproveAndLockStatus.INCREASE_AMOUNT, ApproveAndLockStatus.INCREASE_AMOUNT_PENDING].includes(status)) {
      return wdneroUnlockTime
    }

    return Number(roundedUnlockTimestamp)
  }, [status, roundedUnlockTimestamp, wdneroUnlockTime])

  const { t } = useTranslation()
  return (
    <FlexGap flexDirection="column" gap="4px" mt="4px" width="100%" alignItems="center" justifyContent="center">
      <Flex alignItems="center" width="100%" justifyContent="center">
        <TokenImage
          src={`https://pancakeswap.finance/images/tokens/${WDNERO[ChainId.DNERO].address}.png`}
          height={20}
          width={20}
          mr="4px"
          title={WDNERO[ChainId.DNERO].symbol}
        />
        <Text fontSize="14px">{`${txAmount} WDNERO`}</Text>
      </Flex>

      <Text fontSize={12} color="textSubtle">
        {t('to be locked until')}
      </Text>

      <Text fontSize="14px">{dayjs.unix(txUnlock).format('DD MMM YYYY')}</Text>
    </FlexGap>
  )
}
