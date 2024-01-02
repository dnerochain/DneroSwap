import { useTranslation } from '@dneroswap/localization'
import {
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  FlexGap,
  Heading,
  InfoFilledIcon,
  Message,
  RowBetween,
  Tag,
  Text,
  WarningIcon,
} from '@dneroswap/uikit'
import { formatBigInt } from '@dneroswap/utils/formatBalance'
import { WEEK } from 'config/constants/veWDnero'
import dayjs from 'dayjs'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useMemo } from 'react'
import { formatTime } from 'utils/formatTime'
import { useWDneroPoolLockInfo } from '../hooks/useWDneroPoolLockInfo'
import { useWriteMigrateCallback } from '../hooks/useContractWrite/useWriteMigrateCallback'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { StyledLockedCard } from './styled'

export const WDneroPoolLockInfo = () => {
  const { t } = useTranslation()
  const { lockedAmount = 0n, lockEndTime = 0n } = useWDneroPoolLockInfo()
  const roundedEndTime = useMemo(() => {
    return Math.floor(Number(lockEndTime) / WEEK) * WEEK
  }, [lockEndTime])
  const wdneroPrice = useWDneroPrice()
  const wdneroAmount = useMemo(() => Number(formatBigInt(lockedAmount)), [lockedAmount])
  const wdneroAmountUsdValue = useMemo(() => {
    return wdneroPrice.times(wdneroAmount).toNumber()
  }, [wdneroPrice, wdneroAmount])
  const now = useCurrentBlockTimestamp()
  const unlockTimeToNow = useMemo(() => {
    return dayjs.unix(now).from(dayjs.unix(Number(roundedEndTime || 0)), true)
  }, [now, roundedEndTime])
  const migrate = useWriteMigrateCallback()

  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      <RowBetween>
        <Text color="textSubtle" bold fontSize={12} textTransform="uppercase">
          {t('my cake staking')}
        </Text>
        <Tag variant="failure" scale="sm" startIcon={<WarningIcon color="white" />} px="8px">
          {t('Migration Needed')}
        </Tag>
      </RowBetween>
      <StyledLockedCard gap="16px">
        <RowBetween>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('cake locked')}
            </Text>
            <Balance value={wdneroAmount} decimals={2} fontWeight={600} fontSize={20} />
            <Balance prefix="~" value={wdneroAmountUsdValue} decimals={2} unit="USD" fontSize={12} />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('unlocks in')}
            </Text>
            <Text fontWeight={600} fontSize={20}>
              {unlockTimeToNow}
            </Text>
            <Text fontSize={12}>
              {t('on')} {formatTime(Number(dayjs.unix(Number(roundedEndTime || 0))))}
            </Text>
          </AutoColumn>
        </RowBetween>
        <Button width="100%" onClick={migrate}>
          {t('Migrate to veWDNERO')}
        </Button>
      </StyledLockedCard>
      <Message variant="warning" icon={<InfoFilledIcon color="#D67E0A" />}>
        <Text as="p" color="#D67E0A">
          {t(
            'Migrate your WDNERO staking position to veWDNERO and enjoy the benefits of weekly WDNERO yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
          )}
        </Text>
      </Message>
    </FlexGap>
  )
}

export const WDneroPoolLockStatus = () => {
  const { t } = useTranslation()
  return (
    <Box maxWidth={['100%', '100%', '369px']} width="100%">
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">{t('My VeWDNERO')}</Heading>
              <Balance fontSize="20px" bold color="failure" value={0} decimals={2} />
            </AutoColumn>
            <img srcSet="/images/wdnero-staking/token-vewdnero.png 2x" alt="token-vewdnero" />
          </RowBetween>
        </CardHeader>
        <WDneroPoolLockInfo />
      </Card>
    </Box>
  )
}
