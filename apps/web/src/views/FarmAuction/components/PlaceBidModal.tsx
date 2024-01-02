import { useState, useEffect } from 'react'
import { styled } from 'styled-components'
import BigNumber from 'bignumber.js'
import { Modal, Text, Flex, BalanceInput, Box, Button, LogoRoundIcon, useToast } from '@dneroswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@dneroswap/localization'
import { formatNumber, getBalanceAmount, getBalanceNumber } from '@dneroswap/utils/formatBalance'
import useTheme from 'hooks/useTheme'
import useTokenBalance from 'hooks/useTokenBalance'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useFarmAuctionContract } from 'hooks/useContract'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ApproveConfirmButtons, { ButtonArrangement } from 'components/ApproveConfirmButtons'
import { ConnectedBidder, FetchStatus } from 'config/constants/types'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import { dneroTokens, WDNERO } from '@dneroswap/tokens'
import { ChainId } from '@dneroswap/chains'

const StyledModal = styled(Modal)`
  & > div:nth-child(2) {
    padding: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

const ExistingInfo = styled(Box)`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.dropdown};
`

const InnerContent = styled(Box)`
  padding: 24px;
`

interface PlaceBidModalProps {
  onDismiss?: () => void
  // undefined initialBidAmount is passed only if auction is not loaded
  // in this case modal will not be possible to open
  initialBidAmount?: number
  connectedBidder: ConnectedBidder
  refreshBidders: () => void
}

const PlaceBidModal: React.FC<React.PropsWithChildren<PlaceBidModalProps>> = ({
  onDismiss,
  initialBidAmount,
  connectedBidder,
  refreshBidders,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { callWithGasPrice } = useCallWithGasPrice()

  const [bid, setBid] = useState('')
  const [isMultipleOfTen, setIsMultipleOfTen] = useState(false)
  const [isMoreThanInitialBidAmount, setIsMoreThanInitialBidAmount] = useState(false)
  const [userNotEnoughWDnero, setUserNotEnoughWDnero] = useState(false)
  const [errorText, setErrorText] = useState(null)

  const { balance: userWDnero, fetchStatus } = useTokenBalance(dneroTokens.wdnero.address)
  const userWDneroBalance = getBalanceAmount(userWDnero)

  const wdneroPriceBusd = useWDneroPrice()
  const farmAuctionContract = useFarmAuctionContract()

  const { toastSuccess } = useToast()

  const { bidderData } = connectedBidder
  const { amount, position } = bidderData
  const isFirstBid = amount.isZero()
  const isInvalidFirstBid = isFirstBid && !isMoreThanInitialBidAmount

  useEffect(() => {
    setIsMoreThanInitialBidAmount(parseFloat(bid) >= initialBidAmount)
    setIsMultipleOfTen(parseFloat(bid) % 10 === 0 && parseFloat(bid) !== 0)
    if (fetchStatus === FetchStatus.Fetched && userWDneroBalance.lt(bid)) {
      setUserNotEnoughWDnero(true)
    } else {
      setUserNotEnoughWDnero(false)
    }
  }, [bid, initialBidAmount, fetchStatus, userWDneroBalance])

  useEffect(() => {
    if (userNotEnoughWDnero) {
      setErrorText(t('Insufficient WDNERO balance'))
    } else if (!isMoreThanInitialBidAmount && isFirstBid) {
      setErrorText(t('First bid must be %initialBidAmount% WDNERO or more.', { initialBidAmount }))
    } else if (!isMultipleOfTen) {
      setErrorText(t('Bid must be a multiple of 10'))
    } else {
      setErrorText(null)
    }
  }, [isMultipleOfTen, isMoreThanInitialBidAmount, userNotEnoughWDnero, initialBidAmount, t, isFirstBid])

  let minAmount = 0n
  try {
    minAmount = BigInt(new BigNumber(bid).times(DEFAULT_TOKEN_DECIMAL).toString())
  } catch {
    //
  }

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      minAmount,
      spender: farmAuctionContract?.address,
      token: WDNERO[ChainId.DNERO],
      onApproveSuccess: async ({ receipt }) => {
        toastSuccess(
          t('Contract approved - you can now place your bid!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
        )
      },
      onConfirm: () => {
        const bidAmount = new BigNumber(bid).times(DEFAULT_TOKEN_DECIMAL).toString()
        return callWithGasPrice(farmAuctionContract, 'bid', [BigInt(bidAmount)])
      },
      onSuccess: async ({ receipt }) => {
        refreshBidders()
        onDismiss?.()
        toastSuccess(t('Bid placed!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      },
    })

  const handleInputChange = (input: string) => {
    setBid(input)
  }

  const setPercentageValue = (percentage: number) => {
    const rounding = percentage === 1 ? BigNumber.ROUND_FLOOR : BigNumber.ROUND_CEIL
    const valueToSet = getBalanceAmount(userWDnero.times(percentage)).div(10).integerValue(rounding).times(10)
    setBid(valueToSet.toString())
  }
  return (
    <StyledModal title={t('Place a Bid')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <ExistingInfo>
        <Flex justifyContent="space-between">
          <Text>{t('Your existing bid')}</Text>
          <Text>{t('%num% WDNERO', { num: getBalanceNumber(amount) })}</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text>{t('Your position')}</Text>
          <Text>{position ? `#${position}` : '-'}</Text>
        </Flex>
      </ExistingInfo>
      <InnerContent>
        <Flex justifyContent="space-between" alignItems="center" pb="8px">
          <Text>{t('Bid a multiple of 10')}</Text>
          <Flex>
            <LogoRoundIcon width="24px" height="24px" mr="4px" />
            <Text bold>WDNERO</Text>
          </Flex>
        </Flex>
        {isFirstBid && (
          <Text pb="8px" small>
            {t('First bid must be %initialBidAmount% WDNERO or more.', { initialBidAmount })}
          </Text>
        )}
        <BalanceInput
          isWarning={!isMultipleOfTen || isInvalidFirstBid}
          placeholder="0"
          value={bid}
          onUserInput={handleInputChange}
          currencyValue={
            wdneroPriceBusd.gt(0) && `~${bid ? wdneroPriceBusd.times(new BigNumber(bid)).toNumber() : '0.00'} USD`
          }
        />
        <Flex justifyContent="flex-end" mt="8px">
          <Text fontSize="12px" color="textSubtle" mr="8px">
            {t('Balance')}:
          </Text>
          <Text fontSize="12px" color="textSubtle">
            {formatNumber(userWDneroBalance.toNumber(), 3, 3)}
          </Text>
        </Flex>
        {errorText && (
          <Text color="failure" textAlign="right" fontSize="12px">
            {errorText}
          </Text>
        )}
        <Flex justifyContent="space-between" mt="8px" mb="24px">
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(0.25)}
          >
            25%
          </Button>
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(0.5)}
          >
            50%
          </Button>
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(0.75)}
          >
            75%
          </Button>
          <Button
            disabled={fetchStatus !== FetchStatus.Fetched}
            scale="xs"
            mx="2px"
            p="4px 16px"
            variant="tertiary"
            onClick={() => setPercentageValue(1)}
          >
            <Text small color="currentColor" textTransform="uppercase">
              {t('Max')}
            </Text>
          </Button>
        </Flex>
        <Flex flexDirection="column">
          {account ? (
            <ApproveConfirmButtons
              isApproveDisabled={isApproved}
              isApproving={isApproving}
              isConfirmDisabled={
                !isMultipleOfTen ||
                getBalanceAmount(userWDnero).lt(bid) ||
                isConfirmed ||
                isInvalidFirstBid ||
                userNotEnoughWDnero
              }
              isConfirming={isConfirming}
              onApprove={handleApprove}
              onConfirm={handleConfirm}
              buttonArrangement={ButtonArrangement.SEQUENTIAL}
            />
          ) : (
            <ConnectWalletButton />
          )}
        </Flex>
        <Text color="textSubtle" small mt="24px">
          {t('If your bid is unsuccessful, you’ll be able to reclaim your WDNERO after the auction.')}
        </Text>
      </InnerContent>
    </StyledModal>
  )
}

export default PlaceBidModal
