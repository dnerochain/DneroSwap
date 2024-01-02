import { useState, useEffect } from 'react'
import { Flex, Text, Skeleton, Button, ArrowForwardIcon, Balance } from '@dneroswap/uikit'
import { NextLinkFromReactRouter } from '@dneroswap/widgets-internal'

import { useTranslation } from '@dneroswap/localization'
import { useIntersectionObserver } from '@dneroswap/hooks'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { styled } from 'styled-components'
import { fetchLottery, fetchCurrentLotteryId } from 'state/lottery/helpers'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import { SLOW_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'

const StyledLink = styled(NextLinkFromReactRouter)`
  width: 100%;
`

const StyledBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const LotteryCardContent = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const wdneroPriceBusd = useWDneroPrice()
  const { data: currentLotteryId } = useQuery(['currentLotteryId'], fetchCurrentLotteryId, {
    enabled: Boolean(loadData),
    refetchInterval: SLOW_INTERVAL,
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
  const { data: currentLottery } = useQuery(
    ['currentLottery'],
    async () => fetchLottery(currentLotteryId?.toString() ?? ''),
    {
      enabled: Boolean(loadData),
      refetchInterval: SLOW_INTERVAL,
      refetchOnReconnect: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  )

  const wdneroPrizesText = t('%wdneroPrizeInUsd% in WDNERO prizes this round', { wdneroPrizeInUsd: wdneroPriceBusd.toString() })
  const [pretext, prizesThisRound] = wdneroPrizesText.split(wdneroPriceBusd.toString())
  const amountCollectedInWDnero = currentLottery ? parseFloat(currentLottery.amountCollectedInWDnero) : null
  const currentLotteryPrize = amountCollectedInWDnero ? wdneroPriceBusd.times(amountCollectedInWDnero) : null

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  return (
    <>
      <Flex flexDirection="column" mt="48px">
        <Text color="white" bold fontSize="16px">
          {t('Lottery')}
        </Text>
        {pretext && (
          <Text color="white" mt="12px" bold fontSize="16px">
            {pretext}
          </Text>
        )}
        {currentLotteryPrize && currentLotteryPrize.gt(0) ? (
          <StyledBalance
            fontSize="40px"
            bold
            prefix="$"
            decimals={0}
            value={getBalanceAmount(currentLotteryPrize).toNumber()}
          />
        ) : (
          <>
            <Skeleton width={200} height={40} my="8px" />
            <div ref={observerRef} />
          </>
        )}
        <Text color="white" mb="24px" bold fontSize="16px">
          {prizesThisRound}
        </Text>
        <Text color="white" mb="40px">
          {t('Buy tickets with WDNERO, win WDNERO if your numbers match')}
        </Text>
      </Flex>
      <Flex alignItems="center" justifyContent="center">
        <StyledLink to="/lottery" id="homepage-prediction-cta">
          <Button width="100%">
            <Text bold color="invertedContrast">
              {t('Buy Tickets')}
            </Text>
            <ArrowForwardIcon ml="4px" color="invertedContrast" />
          </Button>
        </StyledLink>
      </Flex>
    </>
  )
}

export default LotteryCardContent
