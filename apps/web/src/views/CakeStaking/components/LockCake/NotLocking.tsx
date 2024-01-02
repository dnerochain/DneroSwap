import { useTranslation } from '@dneroswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading, useMatchBreakpoints } from '@dneroswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { WEEK } from 'config/constants/veWDnero'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { getVeWDneroAmount } from 'utils/getVeWDneroAmount'
import { useWriteApproveAndLockCallback } from 'views/WDneroStaking/hooks/useContractWrite'
import { NewStakingDataSet } from '../DataSet'
import { LockWDneroForm } from '../LockWDneroForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotLocking = () => {
  return (
    <>
      <Box maxWidth={['100%', '100%', '72%']} mx="auto">
        <NotLockingCard />
      </Box>
    </>
  )
}

export const NotLockingCard = () => {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { wdneroLockAmount, wdneroLockWeeks } = useLockWDneroData()
  const { isDesktop } = useMatchBreakpoints()

  const disabled = useMemo(
    () => Boolean(!Number(wdneroLockAmount) || !Number(wdneroLockWeeks)),
    [wdneroLockAmount, wdneroLockWeeks],
  )

  const handleModalOpen = useWriteApproveAndLockCallback()

  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Lock WDNERO to get veWDNERO')}</Heading>
      <Grid
        gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'}
        gridColumnGap="24px"
        gridRowGap={isDesktop ? '0' : '24px'}
        padding={[0, 0, 12]}
        mt={32}
        mb={32}
      >
        <LockWDneroForm fieldOnly />
        <LockWeeksForm fieldOnly />
      </Grid>
      <NewStakingDataSet
        veWDneroAmount={getVeWDneroAmount(wdneroLockAmount, Number(wdneroLockWeeks || 0) * WEEK)}
        wdneroAmount={Number(wdneroLockAmount)}
      />
      <ColumnCenter>
        {account ? (
          <Button disabled={disabled} width={['100%', '100%', '50%']} onClick={handleModalOpen}>
            {t('Lock WDNERO')}
          </Button>
        ) : (
          <ConnectWalletButton width={['100%', '100%', '50%']} />
        )}
      </ColumnCenter>
    </StyledCard>
  )
}
