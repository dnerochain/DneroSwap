import { useTranslation } from '@dneroswap/localization'
import { Grid, Heading, ModalV2, PageHeader, QuestionHelper, useMatchBreakpoints } from '@dneroswap/uikit'
import { formatBigInt, formatNumber } from '@dneroswap/utils/formatBalance'
import { formatAmount } from '@dneroswap/utils/formatInfoNumbers'
import Page from 'components/Layout/Page'
import { useWDneroDistributed } from 'hooks/useWDneroDistributed'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import styled from 'styled-components'
import { BenefitCard } from './components/BenefitCard'
import { WDneroRewardsCard } from './components/WDneroRewardsCard'
import { LockWDnero } from './components/LockWDnero'
import { PageHead } from './components/PageHead'
import { useGaugesVotingCount } from './hooks/useGaugesVotingCount'
import { useSnapshotProposalsCount } from './hooks/useSnapshotProposalsCount'
import { useTotalIFOSold } from './hooks/useTotalIFOSold'

const WDneroStaking = () => {
  const { t } = useTranslation()
  const gaugesVotingCount = useGaugesVotingCount()
  const snapshotProposalsCount = useSnapshotProposalsCount()
  const totalWDneroDistributed = useWDneroDistributed()
  const [wdneroRewardModalVisible, setWDneroRewardModalVisible] = useState(false)
  const totalIFOSold = useTotalIFOSold()
  const { isDesktop, isMobile } = useMatchBreakpoints()
  const { theme } = useTheme()

  return (
    <>
      <ModalV2 isOpen={wdneroRewardModalVisible} closeOnOverlayClick onDismiss={() => setWDneroRewardModalVisible(false)}>
        <WDneroRewardsCard onDismiss={() => setWDneroRewardModalVisible(false)} />
      </ModalV2>
      <StyledPageHeader background={isMobile ? theme.colors.gradientInverseBubblegum : undefined}>
        <PageHead />
        <LockWDnero />
        <Heading scale="xl" color="secondary" mt={['40px', '40px', '45px']} mb={['24px', '24px', '48px']}>
          {t('Benefits of veWDNERO')}
        </Heading>
        <Grid
          maxWidth="820px"
          gridGap="24px"
          gridTemplateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          alignItems="center"
          mx="auto"
        >
          <BenefitCard
            type="earnWDnero"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Claim freshly cooked WDNERO rewards weekly on Thursday from veWDNERO gauge emission as well as trading revenue sharing.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`${formatNumber(Number(formatBigInt(totalWDneroDistributed)))} WDNERO`}
            onClick={() => {
              setWDneroRewardModalVisible(true)
            }}
          />
          <BenefitCard
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use your veWDNERO to vote on your favourite farms, position managers, reward pools, and any WDNERO emission products, increase their allocations, and get more WDNERO rewards.',
                )}
                placement="top"
                ml="4px"
              />
            }
            type="gaugesVoting"
            dataText={`${gaugesVotingCount ?? 0}`}
            onClick={() => {}}
          />
        </Grid>
      </StyledPageHeader>
      <Page title={t('WDNERO Staking')}>
        <Heading scale="xl" mb={['24px', '24px', '48px']} mt={['16px', '16px', 0]}>
          {t('And So Much More...')}
        </Heading>
        <Grid
          maxWidth="820px"
          gridGap="24px"
          gridTemplateColumns={isDesktop ? 'repeat(2, 1fr)' : '1fr'}
          alignItems="center"
          mx="auto"
        >
          <BenefitCard
            type="farmBoost"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Boost your DneroSwap farming APR by up to 2.5x. Aquire more veWDNERO to receive a higher boost.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText="2.5x"
          />
          <BenefitCard
            type="snapshotVoting"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use veWDNERO as your Snapshot voting power to vote on governance proposals. Including important protocol decisions, and adding new farming gauges.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`${snapshotProposalsCount}`}
          />
          <BenefitCard
            type="ifo"
            headSlot={
              <QuestionHelper
                size="20px"
                text={t(
                  'Use your veWDNERO as your IFO Public Sales commit credits. Aquire more veWDNERO to commit more in the next DneroSwap IFOs.',
                )}
                placement="top"
                ml="4px"
              />
            }
            dataText={`$${formatAmount(totalIFOSold, { notation: 'standard' })}`}
          />
          <BenefitCard type="more" />
        </Grid>
      </Page>
    </>
  )
}

const StyledPageHeader = styled(PageHeader)`
  padding-top: 32px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 56px;
  }
`

export default WDneroStaking
