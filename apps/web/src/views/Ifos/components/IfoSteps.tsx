import { styled } from 'styled-components'
import every from 'lodash/every'
import {
  Balance,
  Box,
  Button,
  Card,
  CardBody,
  CheckmarkIcon,
  Container,
  Flex,
  FlexGap,
  Heading,
  Link,
  LogoRoundIcon,
  Skeleton,
  Step,
  StepStatus,
  Stepper,
  Text,
  TooltipText,
  useTooltip,
} from '@dneroswap/uikit'
import { NextLinkFromReactRouter as RouterLink } from '@dneroswap/widgets-internal'
import { ChainId, CurrencyAmount, Currency } from '@dneroswap/sdk'
import { Address, useAccount } from 'wagmi'
import { useMemo, ReactNode } from 'react'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'

import { useTranslation } from '@dneroswap/localization'
import { useProfile } from 'state/profile/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { getIWDneroWeekDisplay } from 'views/Pools/helpers'

import { useIfoCeiling } from '../hooks/useIfoCredit'
import { useChainName } from '../hooks/useChainNames'

interface TypeProps {
  sourceChainIfoCredit?: CurrencyAmount<Currency>
  dstChainIfoCredit?: CurrencyAmount<Currency>
  srcChainId?: ChainId
  ifoChainId?: ChainId
  ifoCurrencyAddress: Address
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
  isFinished?: boolean
  isCrossChainIfo?: boolean
  hasBridged?: boolean
}

const SmallStakePoolCard = styled(Box)`
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const Wrapper = styled(Container)`
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const InlineLink = styled(Link)`
  display: inline;
`

function IWDneroCard({
  icon,
  title,
  credit,
  more,
  action,
}: {
  action?: ReactNode
  icon?: ReactNode
  title?: ReactNode
  credit?: CurrencyAmount<Currency>
  more?: ReactNode
}) {
  const balanceNumber = useMemo(() => credit && Number(credit.toExact()), [credit])

  return (
    <SmallStakePoolCard borderRadius="default" p="16px">
      <FlexGap justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="16px">
        <Flex>
          {icon}
          <Box ml="16px">
            <Text bold fontSize="12px" textTransform="uppercase" color="secondary">
              {title}
            </Text>
            <Balance fontSize="20px" bold decimals={5} value={balanceNumber ?? 0} />
            {more}
          </Box>
        </Flex>
        {action}
      </FlexGap>
    </SmallStakePoolCard>
  )
}

const Step1 = ({
  srcChainId,
  hasProfile,
  sourceChainIfoCredit,
}: {
  srcChainId?: ChainId
  hasProfile: boolean
  sourceChainIfoCredit?: CurrencyAmount<Currency>
}) => {
  const { t } = useTranslation()
  const wdneroPrice = useWDneroPrice()
  const balanceNumber = useMemo(
    () => sourceChainIfoCredit && Number(sourceChainIfoCredit.toExact()),
    [sourceChainIfoCredit],
  )
  const ceiling = useIfoCeiling({ chainId: srcChainId })
  const creditDollarValue = wdneroPrice.multipliedBy(balanceNumber ?? 1).toNumber()
  const weeksDisplay = getIWDneroWeekDisplay(ceiling ?? BIG_ZERO)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>
        {t(
          'The number of iWDNERO equals the locked staking amount if the staking duration is longer than %weeks% weeks. If the staking duration is less than %weeks% weeks, it will linearly decrease based on the staking duration.',
          {
            weeks: weeksDisplay,
          },
        )}
      </Text>
      <InlineLink external href="https://docs.pancakeswap.finance/products/ifo-initial-farm-offering/iwdnero">
        {t('Learn more about iWDNERO')}
      </InlineLink>
    </Box>,
    {},
  )

  return (
    <CardBody>
      {tooltipVisible && tooltip}
      <Heading as="h4" color="secondary" mb="16px">
        {t('Lock WDNERO in the WDNERO pool')}
      </Heading>
      <Box>
        <Text mb="4px" color="textSubtle" small>
          {t(
            'The maximum amount of WDNERO you can commit to the Public Sale equals the number of your iWDNERO, which is based on your veWDNERO balance at the snapshot time of each IFO. Lock more WDNERO for longer durations to increase the maximum WDNERO you can commit to the sale.',
          )}
        </Text>
        <TooltipText as="span" fontWeight={700} ref={targetRef} color="textSubtle" small>
          {t('How does the number of iWDNERO calculated?')}
        </TooltipText>
        <Text mt="4px" color="textSubtle" small>
          {t('Missed this IFO? Lock WDNERO today for the next IFO, while enjoying a wide range of veWDNERO benefits!')}
        </Text>
      </Box>
      {hasProfile && (
        <IWDneroCard
          icon={<LogoRoundIcon style={{ alignSelf: 'flex-start' }} width={32} height={32} />}
          credit={sourceChainIfoCredit}
          title={t('Your max WDNERO entry')}
          more={
            <Text fontSize="12px" color="textSubtle">
              {creditDollarValue !== undefined ? (
                <Balance
                  value={creditDollarValue}
                  fontSize="12px"
                  color="textSubtle"
                  decimals={2}
                  prefix="~"
                  unit=" USD"
                />
              ) : (
                <Skeleton mt="1px" height={16} width={64} />
              )}
            </Text>
          }
        />
      )}
    </CardBody>
  )
}

const Step2 = ({ hasProfile, isLive, isCommitted }: { hasProfile: boolean; isLive: boolean; isCommitted: boolean }) => {
  const { t } = useTranslation()
  return (
    <CardBody>
      <Heading as="h4" color="secondary" mb="1rem">
        {t('Commit WDNERO')}
      </Heading>
      <Text color="textSubtle" small>
        {t('When the IFO sales are live, you can click “commit” to commit WDNERO and buy the tokens being sold.')}
      </Text>
      <Text color="textSubtle" small mt="1rem">
        {t('You will need a separate amount of WDNERO in your wallet balance to commit to the IFO sales.')}
      </Text>
      {hasProfile && isLive && !isCommitted && (
        <Button as="a" href="#current-ifo" mt="1rem">
          {t('Commit WDNERO')}
        </Button>
      )}
    </CardBody>
  )
}

const IfoSteps: React.FC<React.PropsWithChildren<TypeProps>> = ({
  dstChainIfoCredit,
  sourceChainIfoCredit,
  srcChainId,
  ifoChainId,
  isCommitted,
  hasClaimed,
  isLive,
  isFinished,
  isCrossChainIfo,
  hasBridged,
}) => {
  const { hasActiveProfile } = useProfile()
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const ifoChainName = useChainName(ifoChainId)
  const sourceChainHasIWDnero = useMemo(
    () => sourceChainIfoCredit && sourceChainIfoCredit.quotient > 0n,
    [sourceChainIfoCredit],
  )
  const stepsValidationStatus = isCrossChainIfo
    ? [hasActiveProfile, sourceChainHasIWDnero, hasBridged, isCommitted, hasClaimed]
    : [hasActiveProfile, sourceChainHasIWDnero, isCommitted, hasClaimed]

  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid = index === 0 ? true : every(stepsValidationStatus.slice(0, index), Boolean)
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? 'past' : 'future'
    }
    return arePreviousValid ? 'current' : 'future'
  }

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]

    const renderAccountStatus = () => {
      if (!account) {
        return <ConnectWalletButton />
      }

      if (isStepValid) {
        return (
          <Flex alignItems="center">
            <Text color="success" bold mr="8px">
              {t('Profile Active!')}
            </Text>
            <CheckmarkIcon color="success" />
          </Flex>
        )
      }

      return (
        <Button as={RouterLink} to={`/profile/${account.toLowerCase()}`}>
          {t('Activate your Profile')}
        </Button>
      )
    }

    const renderCommitWDneroStep = () => (
      <Step2 hasProfile={hasActiveProfile} isLive={Boolean(isLive)} isCommitted={isCommitted} />
    )
    const renderClaimStep = () => (
      <CardBody>
        <Heading as="h4" color="secondary" mb="16px">
          {t('Claim your tokens')}
        </Heading>
        <Text color="textSubtle" small>
          {t('After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent WDNERO.')}
        </Text>
      </CardBody>
    )
    const renderBridge = () => (
      <CardBody>
        <Heading as="h4" color="secondary" mb="16px">
          {t('Bridge iWDNERO')}
        </Heading>
        <Text color="textSubtle" small>
          {t(
            'To participate in the cross chain Public Sale, you need to bridge your iWDNERO to the blockchain where the IFO will be hosted on.',
          )}
        </Text>
        <Text color="textSubtle" small mt="1rem">
          {t(
            'Before or during the sale, you may bridge you iWDNERO again if you’ve added more WDNERO or extended your lock staking position.',
          )}
        </Text>
        {sourceChainHasIWDnero && (
          <IWDneroCard
            icon={<LogoRoundIcon style={{ alignSelf: 'flex-start' }} width={32} height={32} />}
            credit={dstChainIfoCredit}
            title={t('Your iWDNERO on %chainName%', { chainName: ifoChainName })}
            action={
              !isStepValid && !isFinished ? (
                <Button as="a" href="#bridge-iwdnero">
                  {t('Bridge iWDNERO')}
                </Button>
              ) : null
            }
          />
        )}
      </CardBody>
    )

    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Activate your Profile')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t('You’ll need an active DneroSwap Profile to take part in an IFO!')}
            </Text>
            {renderAccountStatus()}
          </CardBody>
        )
      case 1:
        return (
          <Step1 hasProfile={hasActiveProfile} sourceChainIfoCredit={sourceChainIfoCredit} srcChainId={srcChainId} />
        )
      case 2:
        if (isCrossChainIfo) {
          return renderBridge()
        }
        return renderCommitWDneroStep()
      case 3:
        if (isCrossChainIfo) {
          return renderCommitWDneroStep()
        }
        return renderClaimStep()
      case 4:
        return renderClaimStep()
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <Heading id="ifo-how-to" as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
        {t('How to Take Part in the Public Sale')}
      </Heading>
      <Stepper>
        {stepsValidationStatus.map((_, index) => (
          <Step
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            statusFirstPart={getStatusProp(index)}
            statusSecondPart={getStatusProp(index + 1)}
          >
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
