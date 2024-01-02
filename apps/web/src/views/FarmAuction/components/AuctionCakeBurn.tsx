import { useState, useEffect } from 'react'
import { Text, Flex, Skeleton, Image, Balance } from '@dneroswap/uikit'
import { useFarmAuctionContract } from 'hooks/useContract'
import { useIntersectionObserver } from '@dneroswap/hooks'
import { useTranslation } from '@dneroswap/localization'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { bigIntToBigNumber } from '@dneroswap/utils/bigNumber'
import { styled } from 'styled-components'

const BurnedText = styled(Text)`
  font-size: 52px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 64px;
  }
`

const AuctionWDneroBurn: React.FC<React.PropsWithChildren> = () => {
  const [burnedWDneroAmount, setBurnedWDneroAmount] = useState(0)
  const { t } = useTranslation()
  const farmAuctionContract = useFarmAuctionContract()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const wdneroPriceBusd = useWDneroPrice()

  const burnedAmountAsUSD = wdneroPriceBusd.times(burnedWDneroAmount)

  useEffect(() => {
    const fetchBurnedWDneroAmount = async () => {
      try {
        const amount = await farmAuctionContract.read.totalCollected()
        const amountAsBN = bigIntToBigNumber(amount)
        setBurnedWDneroAmount(getBalanceNumber(amountAsBN))
      } catch (error) {
        console.error('Failed to fetch burned auction cake', error)
      }
    }
    if (isIntersecting && burnedWDneroAmount === 0) {
      fetchBurnedWDneroAmount()
    }
  }, [isIntersecting, burnedWDneroAmount, farmAuctionContract])
  return (
    <Flex flexDirection={['column-reverse', null, 'row']}>
      <Flex flexDirection="column" flex="2" ref={observerRef}>
        {burnedWDneroAmount !== 0 ? (
          <Balance fontSize="64px" bold value={burnedWDneroAmount} decimals={0} unit=" WDNERO" />
        ) : (
          <Skeleton width="256px" height="64px" />
        )}
        <BurnedText textTransform="uppercase" bold color="secondary">
          {t('Burned')}
        </BurnedText>
        <Text fontSize="24px" bold>
          {t('through community auctions so far!')}
        </Text>
        {!burnedAmountAsUSD.isNaN() && !burnedAmountAsUSD.isZero() ? (
          <Text color="textSubtle">
            ~${burnedAmountAsUSD.toNumber().toLocaleString('en', { maximumFractionDigits: 0 })}
          </Text>
        ) : (
          <Skeleton width="128px" />
        )}
      </Flex>
      <Image width={350} height={320} src="/images/burnt-wdnero.png" alt={t('Burnt WDNERO')} />
    </Flex>
  )
}

export default AuctionWDneroBurn
