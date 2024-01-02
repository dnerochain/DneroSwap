import { useTranslation } from '@dneroswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@dneroswap/uikit'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { LockWDneroForm } from '../LockWDneroForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { NotLockingCard } from './NotLocking'
import { StyledCard } from './styled'

export const Staking = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { wdneroLocked } = useWDneroLockStatus()

  if (!wdneroLocked) return <NotLockingCard />

  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Increase your veWDNERO')}</Heading>

      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockWDneroForm />
        <LockWeeksForm />
      </Grid>
    </StyledCard>
  )
}
