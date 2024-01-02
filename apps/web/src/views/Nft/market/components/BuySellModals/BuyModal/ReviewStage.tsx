import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Flex, Text, Button, ButtonMenu, ButtonMenuItem, Message, Link } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import { NftToken } from 'state/nftMarket/types'
import { getDneroScanLinkForNft } from 'utils'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { Divider, RoundedImage } from '../shared/styles'
import { BorderedBox, DTokenAmountCell } from './styles'
import { PaymentCurrency } from './types'

interface ReviewStageProps {
  nftToBuy: NftToken
  paymentCurrency: PaymentCurrency
  setPaymentCurrency: (index: number) => void
  nftPrice: number
  walletBalance: number
  walletFetchStatus: TFetchStatus
  notEnoughDTokenForPurchase: boolean
  continueToNextStage: () => void
}

const ReviewStage: React.FC<React.PropsWithChildren<ReviewStageProps>> = ({
  nftToBuy,
  paymentCurrency,
  setPaymentCurrency,
  nftPrice,
  walletBalance,
  walletFetchStatus,
  notEnoughDTokenForPurchase,
  continueToNextStage,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  return (
    <>
      <Flex px="24px" pt="24px" flexDirection="column">
        <Flex>
          <RoundedImage src={nftToBuy.image.thumbnail} height={68} width={68} mr="16px" />
          <Flex flexDirection="column" justifyContent="space-evenly">
            <Text color="textSubtle" fontSize="12px">
              {nftToBuy?.collectionName}
            </Text>
            <Text bold>{nftToBuy.name}</Text>
            <Flex alignItems="center">
              <Text fontSize="12px" color="textSubtle" p="0px" height="16px" mr="4px">
                {t('Token ID:')}
              </Text>
              <Button
                as={Link}
                scale="xs"
                px="0px"
                pt="2px"
                external
                variant="text"
                href={getDneroScanLinkForNft(nftToBuy.collectionAddress, nftToBuy.tokenId)}
              >
                {nftToBuy.tokenId}
              </Button>
            </Flex>
          </Flex>
        </Flex>
        <BorderedBox>
          <Text small color="textSubtle">
            {t('Pay with')}
          </Text>
          <ButtonMenu
            activeIndex={paymentCurrency}
            onItemClick={(index) => setPaymentCurrency(index)}
            scale="sm"
            variant="subtle"
          >
            <ButtonMenuItem>DTOKEN</ButtonMenuItem>
            <ButtonMenuItem>WDTOKEN</ButtonMenuItem>
          </ButtonMenu>
          <Text small color="textSubtle">
            {t('Total payment')}
          </Text>
          <DTokenAmountCell dtokenAmount={nftPrice} />
          <Text small color="textSubtle">
            {t('%symbol% in wallet', { symbol: paymentCurrency === PaymentCurrency.DTOKEN ? 'DTOKEN' : 'WDTOKEN' })}
          </Text>
          {!account ? (
            <Flex justifySelf="flex-end">
              <ConnectWalletButton scale="sm" />
            </Flex>
          ) : (
            <DTokenAmountCell
              dtokenAmount={walletBalance}
              isLoading={walletFetchStatus !== FetchStatus.Fetched}
              isInsufficient={walletFetchStatus === FetchStatus.Fetched && notEnoughDTokenForPurchase}
            />
          )}
        </BorderedBox>
        {walletFetchStatus === FetchStatus.Fetched && notEnoughDTokenForPurchase && (
          <Message p="8px" variant="danger">
            <Text>
              {t('Not enough %symbol% to purchase this NFT', {
                symbol: paymentCurrency === PaymentCurrency.DTOKEN ? 'DTOKEN' : 'WDTOKEN',
              })}
            </Text>
          </Message>
        )}
        <Flex alignItems="center">
          <Text my="16px" mr="4px">
            {t('Convert between DTOKEN and WDTOKEN for free')}:
          </Text>
          <Button
            as={Link}
            p="0px"
            height="16px"
            external
            variant="text"
            href="/swap?inputCurrency=DTOKEN&outputCurrency=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
          >
            {t('Convert')}
          </Button>
        </Flex>
      </Flex>
      <Divider />
      <Flex px="24px" pb="24px" flexDirection="column">
        <Button
          onClick={continueToNextStage}
          disabled={walletFetchStatus !== FetchStatus.Fetched || notEnoughDTokenForPurchase}
          mb="8px"
        >
          {t('Checkout')}
        </Button>
        <Button as={Link} external style={{ width: '100%' }} href="/swap?outputCurrency=DTOKEN" variant="secondary">
          {t('Get %symbol1% or %symbol2%', { symbol1: 'DTOKEN', symbol2: 'WDTOKEN' })}
        </Button>
      </Flex>
    </>
  )
}

export default ReviewStage
