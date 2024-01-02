import { styled } from 'styled-components'
import { Card, CardHeader, Box, Heading, Text } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import EasterPrizesGrid from './PrizesGrid/EasterPrizesGrid'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 40px;
    flex: 1;
  }
`

const EasterPrizesCard = () => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <CardHeader>
        <Heading scale="lg" color="secondary">
          {t('Prizes by Team')}
        </Heading>
        <Text color="textSubtle" fontSize="14px">
          {t('Higher trading volume = higher rank!')}
        </Text>
      </CardHeader>
      <EasterPrizesGrid />
      <Box p="24px">
        <Text color="textSubtle" fontSize="14px">
          {t(
            'Prizes to be distributed in WDNERO and shared by all members of a tier. WDNERO price in USD to be determined on the day of distribution. Details below.',
          )}
        </Text>
      </Box>
    </StyledCard>
  )
}

export default EasterPrizesCard
