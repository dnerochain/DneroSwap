import { useTranslation } from '@dneroswap/localization'
import { DeserializedLockedWDneroVault, ONE_WEEK_DEFAULT, VaultKey } from '@dneroswap/pools'
import {
  AtomBox,
  Balance,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  LinkExternal,
  Message,
  MessageText,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Row,
  Text,
  WarningIcon,
  useMatchBreakpoints,
  useToast,
} from '@dneroswap/uikit'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import getTimePeriods from '@dneroswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useRevenueSharingPoolGatewayContract } from 'hooks/useContract'
import { useCallback, useMemo } from 'react'
import { useVaultPoolByKey } from 'state/pools/hooks'
import styled from 'styled-components'
import { getRevenueSharingWDneroPoolAddress, getRevenueSharingVeWDneroAddress } from 'utils/addressHelpers'
import { stringify } from 'viem'
import BenefitsTooltipsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsTooltipsText'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import {
  useWDneroPoolEmission,
  useRevShareEmission,
  useUserWDneroTVL,
  useUserSharesPercent,
  useVeWDneroAPR,
} from '../hooks/useAPR'
import { useCurrentBlockTimestamp } from '../hooks/useCurrentBlockTimestamp'
import { useRevenueSharingWDneroPool, useRevenueSharingVeWDnero } from '../hooks/useRevenueSharingProxy'
import { MyVeWDneroCard } from './MyVeWDneroCard'

const StyledModalHeader = styled(ModalHeader)`
  padding: 0;
  margin-bottom: 16px;
`

const APRDebugView = () => {
  const wdneroPoolEmission = useWDneroPoolEmission()
  const userSharesPercent = useUserSharesPercent()
  const userWDneroTVL = useUserWDneroTVL()
  const revShareEmission = useRevShareEmission()
  const { wdneroPoolAPR, revenueSharingAPR, totalAPR } = useVeWDneroAPR()
  if (!(window?.location?.hostname === 'localhost' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview')) return null
  return (
    <Flex mt="8px" flexDirection="row" alignItems="center">
      <BenefitsTooltipsText
        title="APR DebugView"
        tooltipComponent={
          <pre>
            {stringify(
              {
                wdneroPoolAPR: wdneroPoolAPR?.toSignificant(18),
                revenueSharingAPR: revenueSharingAPR?.toSignificant(18),
                totalAPR: totalAPR?.toSignificant(18),
                wdneroPoolEmission: wdneroPoolEmission?.toString(),
                userSharesPercent: userSharesPercent.toSignificant(18),
                userWDneroTVL: userWDneroTVL?.toString(),
                revShareEmission: revShareEmission?.toString(),
              },
              null,
              2,
            )}
          </pre>
        }
      />
    </Flex>
  )
}

// @notice
// migrate from: apps/web/src/views/Pools/components/RevenueSharing/BenefitsModal/RevenueSharing.tsx
export const WDneroRewardsCard = ({ onDismiss }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const wdneroPriceBusd = useWDneroPrice()
  const { userData } = useVaultPoolByKey(VaultKey.WDneroVault) as DeserializedLockedWDneroVault
  const { balanceOfAt, totalSupplyAt, nextDistributionTimestamp, lastTokenTimestamp, availableClaim } =
    useRevenueSharingVeWDnero()
  const yourShare = useMemo(() => getBalanceAmount(new BigNumber(balanceOfAt)).toNumber(), [balanceOfAt])
  const yourSharePercentage = useMemo(
    () => new BigNumber(balanceOfAt).div(totalSupplyAt).times(100).toNumber() || 0,
    [balanceOfAt, totalSupplyAt],
  )

  const showYourSharePercentage = useMemo(() => new BigNumber(totalSupplyAt).gt(0), [totalSupplyAt])

  const { availableClaim: availableClaimFromWDneroPool } = useRevenueSharingWDneroPool()
  const availableWDneroPoolWDnero = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaimFromWDneroPool)).toNumber(),
    [availableClaimFromWDneroPool],
  )
  const availableWDneroPoolWDneroUsdValue = useMemo(
    () => new BigNumber(availableWDneroPoolWDnero).times(wdneroPriceBusd).toNumber(),
    [availableWDneroPoolWDnero, wdneroPriceBusd],
  )

  const availableRevenueSharingWDnero = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaim)).toNumber(),
    [availableClaim],
  )
  const availableRevenueSharingWDneroUsdValue = useMemo(
    () => new BigNumber(availableRevenueSharingWDnero).times(wdneroPriceBusd).toNumber(),
    [availableRevenueSharingWDnero, wdneroPriceBusd],
  )

  const totalAvailableClaim = useMemo(
    () => getBalanceAmount(new BigNumber(availableClaim).plus(availableClaimFromWDneroPool)).toNumber(),
    [availableClaim, availableClaimFromWDneroPool],
  )
  const totalAvailableClaimUsdValue = useMemo(
    () => new BigNumber(totalAvailableClaim).times(wdneroPriceBusd).toNumber(),
    [totalAvailableClaim, wdneroPriceBusd],
  )

  const showExpireSoonWarning = useMemo(() => {
    const endTime = new BigNumber(nextDistributionTimestamp).plus(ONE_WEEK_DEFAULT)
    return new BigNumber(userData?.lockEndTime ?? '0').lt(endTime)
  }, [nextDistributionTimestamp, userData?.lockEndTime])

  const showNoWDneroAmountWarning = useMemo(
    () => new BigNumber(userData?.lockedAmount ?? '0').lte(0),
    [userData?.lockedAmount],
  )
  const currentDate = useCurrentBlockTimestamp()
  // const currentDate = Date.now() / 1000
  const timeRemaining = nextDistributionTimestamp - Number(currentDate || 0)
  const { days, hours, minutes, seconds } = getTimePeriods(timeRemaining)

  const nextDistributionTime = useMemo(() => {
    if (!days && hours && minutes && seconds) {
      return `< 1 ${t('day')}`
    }

    return t('in %day% days', { day: days })
  }, [days, hours, minutes, seconds, t])

  const { wdneroPoolAPR, revenueSharingAPR, totalAPR } = useVeWDneroAPR()

  return (
    <ModalContainer
      title={t('WDNERO Reward / Yield')}
      style={{ minWidth: '375px', padding: isDesktop ? '24px' : '24px 24px 0 24px' }}
    >
      <AtomBox
        justifyContent="space-between"
        bg="gradientBubblegum"
        p="24px"
        maxWidth="420px"
        height="100%"
        style={{ margin: '-24px' }}
      >
        <StyledModalHeader headerBorderColor="transparent">
          <ModalTitle>
            <Heading scale="md">{t('WDNERO Reward / Yield')}</Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={onDismiss} />
        </StyledModalHeader>

        <ModalBody style={{ marginLeft: '-24px', marginRight: '-24px', paddingLeft: '24px', paddingRight: '24px' }}>
          <Row>
            <Text fontSize="16px" bold color="secondary">
              {t('EARN WDNERO')}
            </Text>
            <Text fontSize="16px" bold color="textSubtle" ml="3px">
              {t('WEEKLY')}
            </Text>
          </Row>
          <Text fontSize="14px" color="textSubtle" mb="16px" mt="13px">
            {t('From WDNERO pool rewards and revenue sharing!')}
          </Text>
          <MyVeWDneroCard />
          <Card mt="16px" style={{ overflow: 'unset' }} mb={isDesktop ? '0' : '24px'}>
            <Box padding={16}>
              <Box>
                <Flex flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('Your shares')}
                    tooltipComponent={
                      <>
                        <Text>
                          {t('The virtual shares you currently own and the % against the whole revenue sharing pool.')}
                        </Text>
                        <Text m="4px 0">
                          {t(
                            'Please note that after locking or updating, your shares will only update upon revenue distributions.',
                          )}
                        </Text>
                        <LinkExternal href="https://docs.pancakeswap.finance/products/revenue-sharing/faq#50b7c683-feb0-47f6-809f-39c1a0976bb5">
                          <Text bold color="primary">
                            {t('Learn More')}
                          </Text>
                        </LinkExternal>
                      </>
                    }
                  />
                  <Box>
                    {yourShare === 0 ? (
                      <Text bold color="failure">
                        0
                      </Text>
                    ) : (
                      <>
                        {yourShare <= 0.01 ? (
                          <Text as="span" bold>{`< 0.01`}</Text>
                        ) : (
                          <Balance
                            display="inline-block"
                            color="success"
                            fontWeight={800}
                            value={yourShare}
                            decimals={2}
                          />
                        )}
                        {showYourSharePercentage && (
                          <>
                            {yourSharePercentage <= 0.01 ? (
                              <Text as="span" ml="4px">{`(< 0.01%)`}</Text>
                            ) : (
                              <Balance
                                display="inline-block"
                                prefix="("
                                unit="%)"
                                ml="4px"
                                value={yourSharePercentage}
                                decimals={2}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </Box>
                </Flex>

                <Flex mt="8px" flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('Next distribution')}
                    tooltipComponent={
                      <Text>{t('Time remaining until the next revenue distribution and share updates.')}</Text>
                    }
                  />
                  <Text color={showExpireSoonWarning ? 'failure' : 'text'} bold>
                    {nextDistributionTime}
                  </Text>
                </Flex>

                <Flex mt="8px" flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('Last distribution')}
                    tooltipComponent={<Text>{t('The time of the last revenue distribution and shares update.')}</Text>}
                  />
                  <Text bold>{timeFormat(locale, lastTokenTimestamp)}</Text>
                </Flex>
                <Flex mt="8px" flexDirection="row" alignItems="center">
                  <BenefitsTooltipsText
                    title={t('APR')}
                    tooltipComponent={
                      <div>
                        <p>
                          {t('WDNERO Pool:')}{' '}
                          <Text bold style={{ display: 'inline' }}>
                            {wdneroPoolAPR.toFixed(2)}%
                          </Text>
                        </p>
                        <p>
                          {t('Revenue Sharing:')}{' '}
                          <Text bold style={{ display: 'inline' }}>
                            {revenueSharingAPR.toFixed(2)}%
                          </Text>
                        </p>
                        <br />
                        <p>
                          {t(
                            'WDNERO Pool APR is calculated based on the voting result and the emission of the veWDNERO Pool gauge.',
                          )}
                        </p>
                        <br />
                        <p>
                          {t(
                            'Revenue Sharing APR is subject to various external factors, including trading volume, and could vary weekly.',
                          )}
                        </p>
                      </div>
                    }
                  />
                  <Text bold>{totalAPR.toFixed(2)}%</Text>
                </Flex>

                <APRDebugView />

                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('wdnero pool')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Reward amount')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in WDNERO.')}</Text>}
                    />
                    <Box>
                      {availableWDneroPoolWDnero > 0 && availableWDneroPoolWDnero <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 WDNERO`}</Text>
                      ) : (
                        <Balance unit=" WDNERO" textAlign="right" bold value={availableWDneroPoolWDnero} decimals={2} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableWDneroPoolWDneroUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('revenue sharing')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Reward amount')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in WDNERO.')}</Text>}
                    />
                    <Box>
                      {availableRevenueSharingWDnero > 0 && availableRevenueSharingWDnero <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 WDNERO`}</Text>
                      ) : (
                        <Balance unit=" WDNERO" textAlign="right" bold value={availableRevenueSharingWDnero} decimals={2} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={availableRevenueSharingWDneroUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
                <Box mt="16px">
                  <Text fontSize={12} bold color="secondary" textTransform="uppercase">
                    {t('total')}
                  </Text>
                  <Flex mt="8px" flexDirection="row" alignItems="start">
                    <BenefitsTooltipsText
                      title={t('Available for claiming')}
                      tooltipComponent={<Text>{t('Amount of revenue available for claiming in WDNERO.')}</Text>}
                    />
                    <Box>
                      {totalAvailableClaim > 0 && totalAvailableClaim <= 0.01 ? (
                        <Text bold textAlign="right">{`< 0.01 WDNERO`}</Text>
                      ) : (
                        <Balance unit=" WDNERO" textAlign="right" bold value={totalAvailableClaim} decimals={2} />
                      )}
                      <Balance
                        ml="4px"
                        color="textSubtle"
                        fontSize={12}
                        textAlign="right"
                        lineHeight="110%"
                        prefix="(~ $"
                        unit=")"
                        value={totalAvailableClaimUsdValue}
                        decimals={2}
                      />
                    </Box>
                  </Flex>
                </Box>
              </Box>
              {showNoWDneroAmountWarning && (
                <Message variant="danger" padding="8px" mt="8px" icon={<WarningIcon color="failure" />}>
                  <MessageText lineHeight="120%">
                    {t('You need to update your staking in order to start earning from protocol revenue sharing.')}
                  </MessageText>
                </Message>
              )}
              <ClaimButton availableClaim={availableClaim} onDismiss={onDismiss} />
              <LinkExternal
                external
                m="8px auto auto auto"
                href="https://docs.pancakeswap.finance/products/revenue-sharing"
              >
                {t('Learn More')}
              </LinkExternal>
            </Box>
          </Card>
        </ModalBody>
      </AtomBox>
    </ModalContainer>
  )
}

const ClaimButton: React.FC<{
  availableClaim: string
  onDismiss?: () => void
}> = ({ availableClaim, onDismiss }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { account, chainId } = useAccountActiveChain()
  const contract = useRevenueSharingPoolGatewayContract()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const isReady = useMemo(() => new BigNumber(availableClaim).gt(0) && !isPending, [availableClaim, isPending])

  const handleClaim = useCallback(async () => {
    try {
      if (!account || !chainId) return

      const revenueSharingPools = [getRevenueSharingWDneroPoolAddress(chainId), getRevenueSharingVeWDneroAddress(chainId)]
      const receipt = await fetchWithCatchTxError(() =>
        contract.write.claimMultiple([revenueSharingPools, account], { account, chain: contract.chain }),
      )

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You have successfully claimed your rewards.')}
          </ToastDescriptionWithTx>,
        )

        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit Revenue Claim Button', error)
    }
  }, [account, chainId, contract.chain, contract.write, fetchWithCatchTxError, onDismiss, t, toastSuccess])

  return (
    <Button mt="24px" width="100%" variant="subtle" disabled={!isReady} onClick={handleClaim}>
      {t('Claim All')}
    </Button>
  )
}
