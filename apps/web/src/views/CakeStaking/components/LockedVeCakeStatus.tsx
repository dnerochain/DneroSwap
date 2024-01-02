import { useTranslation } from '@dneroswap/localization'
import {
  AutoColumn,
  Balance,
  Box,
  Button,
  Card,
  CardHeader,
  Flex,
  FlexGap,
  Heading,
  InfoFilledIcon,
  Link,
  Message,
  RowBetween,
  Text,
} from '@dneroswap/uikit'
import { formatBigInt, formatNumber, getBalanceNumber } from '@dneroswap/utils/formatBalance'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useVeWDneroBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'
import { formatTime } from 'utils/formatTime'
import { WDneroLockStatus } from 'views/WDneroStaking/types'
import { useWriteWithdrawCallback } from '../hooks/useContractWrite/useWriteWithdrawCallback'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { useProxyVeWDneroBalance } from '../hooks/useProxyVeWDneroBalance'
import { useWDneroLockStatus } from '../hooks/useVeWDneroUserInfo'
import { Tooltips } from './Tooltips'
import { StyledLockedCard } from './styled'

dayjs.extend(relativeTime)

const LearnMore = () => {
  const { t } = useTranslation()
  return (
    <Link
      href="https://docs.pancakeswap.finance/products/vewdnero/migrate-from-wdnero-pool#10ffc408-be58-4fa8-af56-be9f74d03f42"
      color="text"
    >
      {t('Learn More >>')}
    </Link>
  )
}

export const LockedVeWDneroStatus: React.FC<{
  status: WDneroLockStatus
}> = ({ status }) => {
  const { t } = useTranslation()
  const { balance } = useVeWDneroBalance()
  const { balance: proxyBalance } = useProxyVeWDneroBalance()
  const balanceBN = useMemo(() => getBalanceNumber(balance), [balance])
  const proxyWDnero = useMemo(() => getBalanceNumber(proxyBalance), [proxyBalance])

  if (status === WDneroLockStatus.NotLocked) return null

  const balanceText =
    balanceBN > 0 && balanceBN < 0.01 ? (
      <UnderlineText fontSize="20px" bold color={balance.eq(0) ? 'failure' : 'secondary'}>
        {`< 0.01`}
      </UnderlineText>
    ) : (
      <UnderlinedBalance
        underlined
        fontSize="20px"
        bold
        color={balance.eq(0) ? 'failure' : 'secondary'}
        value={getBalanceNumber(balance)}
        decimals={2}
      />
    )
  return (
    <Box maxWidth={['100%', '100%', '369px']} width="100%">
      <Card isActive>
        <CardHeader>
          <RowBetween>
            <AutoColumn>
              <Heading color="text">{t('My VeWDNERO')}</Heading>
              <Tooltips
                content={
                  proxyBalance.gt(0) ? (
                    <DualStakeTooltip nativeBalance={balanceBN} proxyBalance={proxyWDnero} />
                  ) : (
                    <SingleStakeTooltip />
                  )
                }
              >
                {balanceText}
              </Tooltips>
            </AutoColumn>
            <img srcSet="/images/wdnero-staking/token-vewdnero.png 2x" alt="token-vewdnero" />
          </RowBetween>
        </CardHeader>
        <LockedInfo />
      </Card>
    </Box>
  )
}

const CUSTOM_WARNING_COLOR = '#D67E0A'

const LockedInfo = () => {
  const { t } = useTranslation()
  const {
    wdneroUnlockTime,
    nativeWDneroLockedAmount,
    proxyWDneroLockedAmount,
    wdneroPoolLocked,
    wdneroPoolUnlockTime,
    wdneroLocked,
    wdneroLockExpired,
    wdneroPoolLockExpired,
  } = useWDneroLockStatus()
  return (
    <FlexGap flexDirection="column" gap="24px" margin={24}>
      <StyledLockedCard gap="16px">
        <RowBetween>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('cake locked')}
            </Text>
            <WDneroLocked
              proxyExpired={wdneroPoolLockExpired}
              proxyUnlockTime={wdneroPoolUnlockTime}
              nativeWDneroLocked={nativeWDneroLockedAmount}
              proxyWDneroLocked={proxyWDneroLockedAmount}
            />
          </AutoColumn>
          <AutoColumn>
            <Text fontSize={12} color="textSubtle" textTransform="uppercase" bold>
              {t('unlocks in')}
            </Text>
            <WDneroUnlockAt
              proxyWDneroLocked={proxyWDneroLockedAmount}
              nativeLocked={wdneroLocked}
              nativeExpired={wdneroLockExpired}
              proxyLocked={wdneroPoolLocked}
              proxyExpired={wdneroPoolLockExpired}
              nativeUnlockTime={wdneroUnlockTime}
              proxyUnlockTime={wdneroPoolUnlockTime}
            />
          </AutoColumn>
        </RowBetween>
      </StyledLockedCard>
      {wdneroPoolLocked ? (
        <>
          {wdneroPoolLockExpired ? (
            <Message variant="warning" icon={<InfoFilledIcon color="warning" />}>
              <Text as="p">
                {t(
                  'WDNERO Pool migrated position has unlocked. Go to the pool page to withdraw, add WDNERO into veWDNERO to increase your veWDNERO benefits.',
                )}
              </Text>
            </Message>
          ) : (
            <Message variant="primary" icon={<InfoFilledIcon color="secondary" />}>
              <AutoColumn gap="8px">
                <Text as="p">
                  {t(
                    'Position migrated from WDNERO Pool can not be extended or topped up. To extend or add more WDNERO, set up a native veWDNERO position.',
                  )}
                </Text>
                <LearnMore />
              </AutoColumn>
            </Message>
          )}
          <Link external style={{ textDecoration: 'none', width: '100%' }} href="/pools">
            <Button width="100%" variant="secondary">
              {t('View WDNERO Pool Position')}
            </Button>
          </Link>
        </>
      ) : null}
      {/* if both veWDnero and wdneroPool expired, user should deal with wdnero pool first */}
      {wdneroLockExpired && !wdneroPoolLockExpired ? (
        <Message variant="warning" icon={<InfoFilledIcon color={CUSTOM_WARNING_COLOR} />}>
          <Text as="p" color={CUSTOM_WARNING_COLOR}>
            {t(
              'Renew your veWDNERO position to continue enjoying the benefits of weekly WDNERO yield, revenue share, gauges voting, farm yield boosting, participating in IFOs, and so much more!',
            )}
          </Text>
        </Message>
      ) : null}
      {!wdneroLockExpired ? (
        <Flex justifyContent="center">
          <img src="/images/wdnero-staking/my-wdnero-bunny.png" alt="my-wdnero-bunny" width="254px" />
        </Flex>
      ) : null}
      {/* if both veWDnero and wdneroPool expired, user should deal with wdnero pool first */}
      {wdneroLockExpired && !wdneroPoolLockExpired ? <SubmitUnlockButton /> : null}
    </FlexGap>
  )
}

const SingleStakeTooltip = () => {
  const { t } = useTranslation()

  return (
    <>
      {t('veWDNERO is calculated with number of WDNERO locked, and the remaining time against maximum lock time.')}
      <LearnMore />
    </>
  )
}

const DualStakeTooltip: React.FC<{
  nativeBalance: number
  proxyBalance: number
}> = ({ nativeBalance, proxyBalance }) => {
  const { t } = useTranslation()

  return (
    <>
      {t('veWDNERO is calculated with number of WDNERO locked, and the remaining time against maximum lock time.')}
      <br />
      <br />
      <ul>
        <li>
          {t('Native:')} {formatNumber(nativeBalance)} veWDNERO
        </li>
        <li>
          {t('Migrated:')} {formatNumber(proxyBalance)} veWDNERO
        </li>
      </ul>
      <br />
      <LearnMore />
    </>
  )
}

const ProxyUnlockTooltip: React.FC<{
  proxyExpired: boolean
  proxyWDnero: number
  proxyUnlockTime: number
}> = ({ proxyExpired, proxyWDnero, proxyUnlockTime }) => {
  const { t } = useTranslation()

  return (
    <>
      {t(
        proxyExpired
          ? '%amount% WDNERO from WDNERO Pool migrated position is already unlocked. Go to the pool page to withdraw these WDNERO.'
          : '%amount% WDNERO from WDNERO Pool migrated position will unlock on %expiredAt%.',
        {
          amount: proxyWDnero,
          expiredAt: formatTime(Number(dayjs.unix(proxyUnlockTime))),
        },
      )}
      <LearnMore />
    </>
  )
}

export const WDneroLocked: React.FC<{
  nativeWDneroLocked: bigint
  proxyWDneroLocked: bigint
  proxyExpired: boolean
  proxyUnlockTime: number
}> = ({ nativeWDneroLocked, proxyWDneroLocked, proxyExpired, proxyUnlockTime }) => {
  const wdneroPrice = useWDneroPrice()
  const nativeWDnero = useMemo(() => Number(formatBigInt(nativeWDneroLocked, 18)), [nativeWDneroLocked])
  const nativeWDneroUsdValue: number = useMemo(() => {
    return wdneroPrice.times(nativeWDnero).toNumber()
  }, [wdneroPrice, nativeWDnero])
  const proxyWDnero = useMemo(() => Number(formatBigInt(proxyWDneroLocked, 18)), [proxyWDneroLocked])
  const totalWDnero = useMemo(
    () => Number(formatBigInt(nativeWDneroLocked + proxyWDneroLocked, 18)),
    [nativeWDneroLocked, proxyWDneroLocked],
  )
  const totalWDneroUsdValue: number = useMemo(() => {
    return wdneroPrice.times(totalWDnero).toNumber()
  }, [wdneroPrice, totalWDnero])

  if (!proxyWDneroLocked && nativeWDneroLocked) {
    return (
      <>
        <Balance value={nativeWDnero} decimals={2} fontWeight={600} fontSize={20} />
        <Balance prefix="~" value={nativeWDneroUsdValue} decimals={2} unit="USD" fontSize={12} />
      </>
    )
  }

  return (
    <>
      <Tooltips
        content={
          <ProxyUnlockTooltip proxyExpired={proxyExpired} proxyWDnero={proxyWDnero} proxyUnlockTime={proxyUnlockTime} />
        }
      >
        <UnderlinedBalance value={totalWDnero} decimals={2} fontWeight={600} fontSize={20} underlined />
      </Tooltips>
      <Balance prefix="~" value={totalWDneroUsdValue} decimals={2} unit="USD" fontSize={12} />
    </>
  )
}

const WDneroUnlockAt: React.FC<{
  proxyWDneroLocked: bigint
  nativeLocked: boolean
  nativeExpired: boolean
  proxyLocked: boolean
  proxyExpired: boolean
  nativeUnlockTime: number
  proxyUnlockTime: number
}> = ({
  proxyWDneroLocked,
  nativeLocked,
  nativeExpired,
  nativeUnlockTime,
  proxyLocked,
  proxyExpired,
  proxyUnlockTime,
}) => {
  const { t } = useTranslation()
  const proxyWDnero = useMemo(() => Number(formatBigInt(proxyWDneroLocked, 18)), [proxyWDneroLocked])
  const now = useCurrentBlockTimestamp()
  const [unlocked, unlockTime, unlockTimeToNow] = useMemo(() => {
    const nowDay = dayjs.unix(Number(now || 0))
    if (!nativeLocked && proxyLocked) {
      return [proxyExpired, proxyUnlockTime, proxyUnlockTime ? dayjs.unix(proxyUnlockTime).from(nowDay, true) : '']
    }
    return [nativeExpired, nativeUnlockTime, nativeUnlockTime ? dayjs.unix(nativeUnlockTime).from(nowDay, true) : '']
  }, [nativeExpired, nativeLocked, nativeUnlockTime, now, proxyExpired, proxyLocked, proxyUnlockTime])

  const TextComp = proxyLocked ? UnderlineText : Text

  const unlockText = (
    <>
      {unlocked ? (
        <TextComp fontWeight={600} fontSize={20} color={CUSTOM_WARNING_COLOR}>
          {t('Unlocked')}
        </TextComp>
      ) : (
        <TextComp fontWeight={600} fontSize={20}>
          {unlockTimeToNow}
        </TextComp>
      )}

      {unlockTime ? (
        <Text fontSize={12} color={unlocked ? CUSTOM_WARNING_COLOR : undefined}>
          {t('on')} {formatTime(Number(dayjs.unix(unlockTime)))}
        </Text>
      ) : null}
    </>
  )

  if (!proxyLocked) return unlockText

  return (
    <Tooltips
      content={
        <ProxyUnlockTooltip proxyExpired={proxyExpired} proxyWDnero={proxyWDnero} proxyUnlockTime={proxyUnlockTime} />
      }
    >
      {unlockText}
    </Tooltips>
  )
}

const UnderlinedBalance = styled(Balance).withConfig({ shouldForwardProp: (prop) => prop !== 'underlined' })<{
  underlined?: boolean
}>`
  ${({ underlined }) =>
    underlined
      ? css`
          text-decoration: underline dotted;
          text-decoration-color: ${({ theme }) => theme.colors.textSubtle};
          text-underline-offset: 0.1em;
        `
      : ''}
`

const UnderlineText = styled(Text)`
  text-decoration: underline dotted;
  text-decoration-color: currentColor;
  text-underline-offset: 0.1em;
`

const SubmitUnlockButton = () => {
  const { t } = useTranslation()
  const unlock = useWriteWithdrawCallback()
  const { wdneroLockedAmount } = useWDneroLockStatus()

  if (!wdneroLockedAmount) {
    return null
  }

  return (
    <Button variant="secondary" onClick={unlock}>
      {t('Unlock')}
    </Button>
  )
}
