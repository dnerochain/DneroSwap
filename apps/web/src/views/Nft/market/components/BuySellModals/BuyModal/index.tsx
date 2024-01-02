import { MaxUint256 } from '@dneroswap/swap-sdk-core'
import { formatEther, parseUnits } from 'viem'
import { TranslateFunction, useTranslation } from '@dneroswap/localization'
import { ChainId } from '@dneroswap/chains'
import { dneroTokens } from '@dneroswap/tokens'
import { InjectedModalProps, useToast } from '@dneroswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20, useNftMarketContract } from 'hooks/useContract'
import useTheme from 'hooks/useTheme'
import useTokenBalance, { useGetDTokenBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { NftToken } from 'state/nftMarket/types'
import { bigIntToBigNumber } from '@dneroswap/utils/bigNumber'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { requiresApproval } from 'utils/requiresApproval'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import ApproveAndConfirmStage from '../shared/ApproveAndConfirmStage'
import ConfirmStage from '../shared/ConfirmStage'
import TransactionConfirmed from '../shared/TransactionConfirmed'
import ReviewStage from './ReviewStage'
import { StyledModal } from './styles'
import { BuyingStage, PaymentCurrency } from './types'

const modalTitles = (t: TranslateFunction) => ({
  [BuyingStage.REVIEW]: t('Review'),
  [BuyingStage.APPROVE_AND_CONFIRM]: t('Back'),
  [BuyingStage.CONFIRM]: t('Back'),
  [BuyingStage.TX_CONFIRMED]: t('Transaction Confirmed'),
})

interface BuyModalProps extends InjectedModalProps {
  nftToBuy: NftToken
}

// NFT WDTOKEN in testnet contract is different
const TESTNET_WDTOKEN_NFT_ADDRESS = '0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F'

const BuyModal: React.FC<React.PropsWithChildren<BuyModalProps>> = ({ nftToBuy, onDismiss }) => {
  const [stage, setStage] = useState(BuyingStage.REVIEW)
  const [confirmedTxHash, setConfirmedTxHash] = useState('')
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(PaymentCurrency.DTOKEN)
  const [isPaymentCurrentInitialized, setIsPaymentCurrentInitialized] = useState(false)
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { callWithGasPrice } = useCallWithGasPrice()

  const { account, chainId } = useAccountActiveChain()
  const wdtokenAddress = chainId === ChainId.DNERO_TESTNET ? TESTNET_WDTOKEN_NFT_ADDRESS : dneroTokens.wdtoken.address
  const wdtokenContractReader = useERC20(wdtokenAddress)
  const wdtokenContractApprover = useERC20(wdtokenAddress)
  const nftMarketContract = useNftMarketContract()

  const { toastSuccess } = useToast()

  const nftPriceWei = parseUnits(nftToBuy?.marketData?.currentAskPrice as `${number}`, 18)
  const nftPrice = parseFloat(nftToBuy?.marketData?.currentAskPrice)

  // DTOKEN - returns ethers.BigNumber
  const { balance: dtokenBalance, fetchStatus: dtokenFetchStatus } = useGetDTokenBalance()
  const formattedDTokenBalance = parseFloat(formatEther(dtokenBalance))
  // WDTOKEN - returns BigNumber
  const { balance: wdtokenBalance, fetchStatus: wdtokenFetchStatus } = useTokenBalance(wdtokenAddress)
  const formattedWdtokenBalance = getBalanceNumber(wdtokenBalance)

  const walletBalance = paymentCurrency === PaymentCurrency.DTOKEN ? formattedDTokenBalance : formattedWdtokenBalance
  const walletFetchStatus = paymentCurrency === PaymentCurrency.DTOKEN ? dtokenFetchStatus : wdtokenFetchStatus

  const notEnoughDTokenForPurchase =
    paymentCurrency === PaymentCurrency.DTOKEN ? dtokenBalance < nftPriceWei : wdtokenBalance.lt(bigIntToBigNumber(nftPriceWei))

  useEffect(() => {
    if (dtokenBalance < nftPriceWei && wdtokenBalance.gte(bigIntToBigNumber(nftPriceWei)) && !isPaymentCurrentInitialized) {
      setPaymentCurrency(PaymentCurrency.WDTOKEN)
      setIsPaymentCurrentInitialized(true)
    }
  }, [dtokenBalance, wdtokenBalance, nftPriceWei, isPaymentCurrentInitialized])

  const { isApproving, isApproved, isConfirming, handleApprove, handleConfirm } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      return requiresApproval(wdtokenContractReader, account, nftMarketContract.address)
    },
    onApprove: () => {
      return callWithGasPrice(wdtokenContractApprover, 'approve', [nftMarketContract.address, MaxUint256])
    },
    onApproveSuccess: async ({ receipt }) => {
      toastSuccess(
        t('Contract approved - you can now buy NFT with WDTOKEN!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
    onConfirm: () => {
      const payAmount = Number.isNaN(nftPrice)
        ? 0n
        : parseUnits(nftToBuy?.marketData?.currentAskPrice as `${number}`, 18)
      if (paymentCurrency === PaymentCurrency.DTOKEN) {
        return callWithGasPrice(
          nftMarketContract,
          'buyTokenUsingDTOKEN',
          [nftToBuy.collectionAddress, BigInt(nftToBuy.tokenId)],
          {
            value: payAmount,
          },
        )
      }
      return callWithGasPrice(nftMarketContract, 'buyTokenUsingWDTOKEN', [
        nftToBuy.collectionAddress,
        BigInt(nftToBuy.tokenId),
        payAmount,
      ])
    },
    onSuccess: async ({ receipt }) => {
      setConfirmedTxHash(receipt.transactionHash)
      setStage(BuyingStage.TX_CONFIRMED)
      toastSuccess(
        t('Your NFT has been sent to your wallet'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
      )
    },
  })

  const continueToNextStage = () => {
    if (paymentCurrency === PaymentCurrency.WDTOKEN && !isApproved) {
      setStage(BuyingStage.APPROVE_AND_CONFIRM)
    } else {
      setStage(BuyingStage.CONFIRM)
    }
  }

  const goBack = () => {
    setStage(BuyingStage.REVIEW)
  }

  const showBackButton = stage === BuyingStage.CONFIRM || stage === BuyingStage.APPROVE_AND_CONFIRM

  return (
    <StyledModal
      title={modalTitles(t)[stage]}
      stage={stage}
      onDismiss={onDismiss}
      onBack={showBackButton ? goBack : null}
      headerBackground={theme.colors.gradientCardHeader}
    >
      {stage === BuyingStage.REVIEW && (
        <ReviewStage
          nftToBuy={nftToBuy}
          paymentCurrency={paymentCurrency}
          setPaymentCurrency={setPaymentCurrency}
          nftPrice={nftPrice}
          walletBalance={walletBalance}
          walletFetchStatus={walletFetchStatus}
          notEnoughDTokenForPurchase={notEnoughDTokenForPurchase}
          continueToNextStage={continueToNextStage}
        />
      )}
      {stage === BuyingStage.APPROVE_AND_CONFIRM && (
        <ApproveAndConfirmStage
          variant="buy"
          handleApprove={handleApprove}
          isApproved={isApproved}
          isApproving={isApproving}
          isConfirming={isConfirming}
          handleConfirm={handleConfirm}
        />
      )}
      {stage === BuyingStage.CONFIRM && <ConfirmStage isConfirming={isConfirming} handleConfirm={handleConfirm} />}
      {stage === BuyingStage.TX_CONFIRMED && <TransactionConfirmed txHash={confirmedTxHash} onDismiss={onDismiss} />}
    </StyledModal>
  )
}

export default BuyModal
