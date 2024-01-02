import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { ArrowForwardIcon, Button, Flex, Heading, Skeleton, Text } from '@dneroswap/uikit'
import { NextLinkFromReactRouter } from '@dneroswap/widgets-internal'

import { useTranslation } from '@dneroswap/localization'
import { formatLocalisedCompactNumber } from '@dneroswap/utils/formatBalance'
import { useIntersectionObserver } from '@dneroswap/hooks'
import { getTotalWon } from 'state/predictions/helpers'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { SLOW_INTERVAL } from 'config/constants'
import { useDTOKENPrice } from 'hooks/useDTOKENPrice'
import { useQuery } from '@tanstack/react-query'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const PredictionCardHeader: React.FC<React.PropsWithChildren<{ preText: string; won: string }>> = ({
  preText,
  won,
}) => {
  return (
    <Heading color="#280D5F" my="8px" scale="xl" bold>
      {preText}
      {won}
    </Heading>
  )
}

const PredictionCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const dtokenBusdPrice = useDTOKENPrice({ enabled: loadData })
  const wdneroPrice = useWDneroPrice({ enabled: loadData })

  const { data } = useQuery(['prediction', 'tokenWon'], getTotalWon, {
    enabled: Boolean(loadData),
    refetchInterval: SLOW_INTERVAL,
  })

  const dtokenWonInUsd = dtokenBusdPrice.multipliedBy(data?.totalWonDTOKEN || 0).toNumber()
  const wdneroWonInUsd = wdneroPrice.multipliedBy(data?.totalWonWDNERO || 0).toNumber()

  const localisedDTokenUsdString = formatLocalisedCompactNumber(dtokenWonInUsd + wdneroWonInUsd)
  const dtokenWonText = t('$%wonInUsd% in DTOKEN + WDNERO won so far', { wonInUsd: localisedDTokenUsdString })
  const [pretext, wonSoFar] = dtokenWonText.split(localisedDTokenUsdString)

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <Text color="#280D5F" bold fontSize="16px">
          {t('Prediction')}
        </Text>
        {dtokenWonInUsd ? (
          <PredictionCardHeader preText={pretext} won={localisedDTokenUsdString} />
        ) : (
          <>
            <Skeleton width={230} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="#280D5F" mb="24px" bold fontSize="16px">
          {wonSoFar}
        </Text>
        <Text color="#280D5F" mb="40px">
          {t('Predict the price trend of DTOKEN or WDNERO to win')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/prediction" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Play')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default PredictionCardContent
