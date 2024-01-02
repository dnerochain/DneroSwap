import { useTranslation } from '@dneroswap/localization'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  HelpIcon,
  Link,
  RocketIcon,
  Text,
  useMatchBreakpoints,
  useTooltip,
} from '@dneroswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Image from 'next/legacy/image'
import NextLink from 'next/link'
import { styled, useTheme } from 'styled-components'
import { useAccount } from 'wagmi'
import boosterCardImage from '../../../../images/boosterCardImage.png'
import { useBWDneroBoostLimitAndLockInfo } from '../../hooks/bWDneroV3/useBWDneroV3Info'

export const CardWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-top: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 296px;
    margin-left: 50px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
  }
`
export const ImageWrapper = styled.div`
  position: absolute;
  top: -50px;
  transform: translateY(-50%) scale(75%);
  right: 10px;
  ${({ theme }) => theme.mediaQueries.sm} {
    right: auto;
    top: 50%;
    left: -70px;
    transform: translateY(-50%);
  }
  z-index: 2;
`
const StyledCardBody = styled(CardBody)`
  border-bottom: none;
`
const StyledCardFooter = styled(CardFooter)`
  border-top: none;
  position: relative;
  padding: 8px 24px 16px;
  &::before {
    content: '';
    position: absolute;
    height: 1px;
    width: calc(100% - 48px);
    top: 0px;
    left: 24px;
    background-color: ${({ theme }) => theme.colors.cardBorder};
  }
`

export const useBWDneroTooltipContent = () => {
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Box mb="20px">
        {t(
          'Yield Boosters allow you to boost your farming yields by locking WDNERO in the fixed-term staking WDNERO pool. The more WDNERO you lock, and the longer you lock them, the higher the boost you will receive.',
        )}
      </Box>
      <Box>
        {t('To learn more, check out the')}
        <Link target="_blank" href="https://medium.com/pancakeswap/introducing-bwdnero-farm-yield-boosters-b27b7a6f0f84">
          {t('Medium Article')}
        </Link>
      </Box>
    </>
  )
  return tooltipContent
}

export const BWDneroBoosterCard = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const { isMobile } = useMatchBreakpoints()

  const tooltipContent = useBWDneroTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
    ...(isMobile && { hideTimeout: 1500 }),
  })
  return (
    <CardWrapper>
      <ImageWrapper>
        <Image src={boosterCardImage} alt="boosterCardImage" width={99} height={191} placeholder="blur" />
      </ImageWrapper>
      <Card p="0px" style={{ zIndex: 1 }}>
        <StyledCardBody style={{ padding: '15px 24px' }}>
          <RocketIcon />
          <Text fontSize={22} bold color="text" marginBottom="-12px" display="inline-block" ml="7px">
            {t('Yield Booster')}
          </Text>
          {tooltipVisible && tooltip}
          <Box ref={targetRef} style={{ float: 'right', position: 'relative', top: '6px' }}>
            <HelpIcon color={theme.colors.textSubtle} />
          </Box>
        </StyledCardBody>
        <StyledCardFooter>
          <CardContent />
        </StyledCardFooter>
      </Card>
    </CardWrapper>
  )
}

const CardContent: React.FC = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { locked } = useBWDneroBoostLimitAndLockInfo()
  const theme = useTheme()

  if (!account)
    return (
      <Box>
        <Text color="textSubtle" fontSize={12} bold>
          {t('Connect wallet to view booster')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active veWDNERO staking position is required for activating farm yield boosters.')}
        </Text>
        <ConnectWalletButton width="100%" style={{ backgroundColor: theme.colors.textSubtle }} />
      </Box>
    )
  if (!locked)
    return (
      <Box width="100%">
        <Text color="textSubtle" fontSize={12} bold>
          {t('No WDNERO locked')}
        </Text>
        <Text color="textSubtle" fontSize={12} mb="16px">
          {t('An active veWDNERO staking position is required for activating farm yield boosters.')}
        </Text>
        <NextLink href="/wdnero-staking" passHref>
          <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
            {t('Go to WDNERO Staking')}
          </Button>
        </NextLink>
      </Box>
    )

  return (
    <Box>
      <Flex justifyContent="space-between">
        <Text color="secondary" fontSize={12} bold textTransform="uppercase">
          {t('Yield booster active')}
        </Text>
      </Flex>
      <Text color="textSubtle" fontSize={12} mb="10px">
        {t(
          'Boost unlimited number of positions on all V3 Farms. Boost will be applied when staking. Lock more WDNERO or extend your lock to receive a higher boost.',
        )}
      </Text>
      <NextLink href="/wdnero-staking" passHref>
        <Button width="100%" style={{ backgroundColor: theme.colors.textSubtle }}>
          {t('Go to WDNERO Staking')}
        </Button>
      </NextLink>
    </Box>
  )
}
