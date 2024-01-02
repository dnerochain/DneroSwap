import { useTranslation } from '@dneroswap/localization'
import { Grid, Heading, useMatchBreakpoints } from '@dneroswap/uikit'
import { LockWDneroForm } from '../LockWDneroForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const Migrate = () => {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  return (
    <StyledCard innerCardProps={{ padding: ['24px 16px', '24px 16px', '24px'] }}>
      <Heading scale="md">{t('Migrate to get veWDNERO')}</Heading>

      <Grid gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'} mt={32} gridColumnGap="24px" gridRowGap="24px">
        <LockWDneroForm disabled />
        <LockWeeksForm disabled />
      </Grid>
    </StyledCard>
  )
}
