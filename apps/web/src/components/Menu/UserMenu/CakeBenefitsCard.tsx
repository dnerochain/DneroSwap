import {
  Box,
  Flex,
  Message,
  Tag,
  LockIcon,
  MessageText,
  useTooltip,
  TooltipText,
  Skeleton,
  Text,
  useMatchBreakpoints,
} from '@dneroswap/uikit'
import { NextLinkFromReactRouter } from '@dneroswap/widgets-internal'

import { VaultPosition } from 'utils/wdneroPool'
import { useTranslation } from '@dneroswap/localization'
import { styled } from 'styled-components'
import useWDneroBenefits from './hooks/useWDneroBenefits'

const WDneroBenefitsCardWrapper = styled(Box)`
  width: 100%;
  margin-bottom: 24px;
  padding: 1px 1px 3px 1px;
  background: linear-gradient(180deg, #53dee9, #7645d9);
  border-radius: ${({ theme }) => theme.radii.default};
`

const WDneroBenefitsCardInner = styled(Box)`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

interface WDneroBenefitsCardProps {
  onDismiss: () => void
}

const WDneroBenefitsCard: React.FC<React.PropsWithChildren<WDneroBenefitsCardProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { data: wdneroBenefits, status: wdneroBenefitsFetchStatus } = useWDneroBenefits()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: wdneroTargetRef,
    tooltip: wdneroTooltip,
    tooltipVisible: wdneroTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`%lockedWDnero% WDNERO (including rewards) are locked in the WDNERO Pool until %lockedEndTime%`, {
          lockedWDnero: wdneroBenefits?.lockedWDnero,
          lockedEndTime: wdneroBenefits?.lockedEndTime,
        })}
      </Text>
      <NextLinkFromReactRouter to="/pools" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: iWDneroTargetRef,
    tooltip: iWDneroTooltip,
    tooltipVisible: iWDneroTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`iWDNERO allows you to participate in the IFO public sales and commit up to %iWDnero% amount of WDNERO.`, {
          iWDnero: wdneroBenefits?.iWDnero,
        })}
      </Text>
      <NextLinkFromReactRouter to="/ifo" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: bWDneroTargetRef,
    tooltip: bWDneroTooltip,
    tooltipVisible: bWDneroTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t(`bWDNERO allows you to boost your yield in DneroSwap Farms by up to 2x.`)}</Text>
      <NextLinkFromReactRouter to="/farms" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  const {
    targetRef: vWDneroTargetRef,
    tooltip: vWDneroTooltip,
    tooltipVisible: vWDneroTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`vWDNERO boosts your voting power to %totalScore% in the DneroSwap voting governance.`, {
          totalScore: wdneroBenefits?.vWDnero?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting" onClick={onDismiss}>
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  return wdneroBenefitsFetchStatus === 'success' ? (
    <>
      {wdneroBenefits && [VaultPosition.None, VaultPosition.Flexible].includes(wdneroBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" alignItems="center">
            <Tag variant="secondary" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('No WDNERO locked')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{wdneroBenefits?.lockedWDnero}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Lock WDNERO to enjoy the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
              )}{' '}
              <NextLinkFromReactRouter
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                to="/pools"
                onClick={onDismiss}
              >
                {t('Go to Pools')}
              </NextLinkFromReactRouter>
            </MessageText>
          </Message>
        </>
      ) : wdneroBenefits && [VaultPosition.LockedEnd, VaultPosition.AfterBurning].includes(wdneroBenefits?.lockPosition) ? (
        <>
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Tag variant="failure" mr="auto">
              <Flex alignItems="center">
                <Box as={LockIcon} mr="4px" />
                {t('WDNERO staking expired')}
              </Flex>
            </Tag>
            <Text fontSize="16px">{wdneroBenefits?.lockedWDnero}</Text>
          </Flex>
          <Message mt="8px" mb="16px" variant="warning">
            <MessageText maxWidth="200px">
              {t(
                'Renew your staking position to continue enjoying the benefits of farm yield boosting, participating in IFOs, voting power boosts, and so much more!',
              )}{' '}
              <NextLinkFromReactRouter
                style={{ textDecoration: 'underline', fontWeight: 'bold' }}
                to="/pools"
                onClick={onDismiss}
              >
                {t('Go to Pools')}
              </NextLinkFromReactRouter>
            </MessageText>
          </Message>
        </>
      ) : (
        <WDneroBenefitsCardWrapper>
          <WDneroBenefitsCardInner>
            <Flex flexDirection="row" alignItems="center">
              <Tag variant="secondary" mr="auto">
                <Flex alignItems="center">
                  <Box as={LockIcon} mr="4px" />
                  {t('WDNERO locked')}
                </Flex>
              </Tag>
              <TooltipText ref={wdneroTargetRef} bold fontSize="16px">
                {wdneroBenefits?.lockedWDnero}
              </TooltipText>
              {wdneroTooltipVisible && wdneroTooltip}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={iWDneroTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                iWDNERO
              </TooltipText>
              {iWDneroTooltipVisible && iWDneroTooltip}
              {wdneroBenefits?.iWDnero}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={bWDneroTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                bWDNERO
              </TooltipText>
              {bWDneroTooltipVisible && bWDneroTooltip}
              {t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
            </Flex>
            <Flex mt="10px" flexDirection="row" alignItems="center">
              <TooltipText ref={vWDneroTargetRef} color="textSubtle" fontSize="16px" mr="auto">
                vWDNERO
              </TooltipText>
              {vWDneroTooltipVisible && vWDneroTooltip}
              {wdneroBenefits?.vWDnero?.vaultScore}
            </Flex>
          </WDneroBenefitsCardInner>
        </WDneroBenefitsCardWrapper>
      )}
    </>
  ) : (
    <Skeleton width="100%" height={146} borderRadius="16px" marginBottom={24} />
  )
}

export default WDneroBenefitsCard
