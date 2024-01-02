import { useTranslation } from '@dneroswap/localization'
import { AddIcon, Button, Flex, IconButton, MinusIcon, useModal, useToast } from '@dneroswap/uikit'
import { FarmWidget } from '@dneroswap/widgets-internal'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import BWDneroCalculator from 'views/Farms/components/YieldBooster/components/BWDneroCalculator'
import { useCallback, useContext, useState, useMemo } from 'react'
import { styled } from 'styled-components'
import { useRouter } from 'next/router'
import { useFarmFromPid } from 'state/farms/hooks'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useAppDispatch } from 'state'
import { WNATIVE, NATIVE } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { SendTransactionResult } from 'wagmi/actions'
import BigNumber from 'bignumber.js'
import { useIsBloctoETH } from 'views/Farms'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { formatLpBalance } from '@dneroswap/utils/formatBalance'
import { pickFarmTransactionTx } from 'state/global/actions'
import { useTransactionAdder, useNonDneroFarmPendingTransaction } from 'state/transactions/hooks'
import { FarmTransactionStatus, NonDneroFarmStepType } from 'state/transactions/actions'
import WalletModal, { WalletView } from 'components/Menu/UserMenu/WalletModal'
import { FarmWithStakedValue } from '@dneroswap/farms'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { YieldBoosterStateContext } from '../YieldBooster/components/ProxyFarmContainer'
import { YieldBoosterState } from '../YieldBooster/hooks/useYieldBoosterState'
import { useFirstTimeCrossFarming } from '../../hooks/useFirstTimeCrossFarming'

interface FarmCardActionsProps extends FarmWithStakedValue {
  lpLabel?: string
  addLiquidityUrl?: string
  displayApr?: string
  onStake?: (value: string) => Promise<SendTransactionResult>
  onUnstake?: (value: string) => Promise<SendTransactionResult>
  onDone?: () => void
  onApprove?: () => Promise<SendTransactionResult>
  isApproved?: boolean
}

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  vaultPid,
  quoteToken,
  token,
  lpSymbol,
  lpTokenPrice,
  multiplier,
  apr,
  lpAddress,
  displayApr,
  addLiquidityUrl,
  lpLabel,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  userData,
  onStake,
  onUnstake,
  onDone,
  onApprove,
  isApproved,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const { account, chainId } = useAccountActiveChain()
  const native = useNativeCurrency()
  const { tokenBalance, stakedBalance, allowance } = userData
  const wdneroPrice = useWDneroPrice()
  const router = useRouter()
  const { lpTokenStakedAmount } = useFarmFromPid(pid)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()
  const { boosterState } = useContext(YieldBoosterStateContext)
  const [bWDneroMultiplier, setBWDneroMultiplier] = useState<number | null>(() => null)
  const pendingFarm = useNonDneroFarmPendingTransaction(lpAddress)
  const { isFirstTime, refresh: refreshFirstTime } = useFirstTimeCrossFarming(vaultPid)
  const isBloctoETH = useIsBloctoETH()

  const crossChainWarningText = useMemo(() => {
    return isFirstTime
      ? t('A small amount of %nativeToken% is required for the first-time setup of cross-chain WDNERO farming.', {
          nativeToken: native.symbol,
        })
      : t('For safety, cross-chain transactions will take around 30 minutes to confirm.')
  }, [isFirstTime, native, t])

  const isStakeReady = useMemo(() => {
    return ['history', 'archived'].some((item) => router.pathname.includes(item)) || pendingFarm.length > 0
  }, [pendingFarm, router])

  const handleStake = async (amount: string) => {
    if (vaultPid) {
      await handleNonDneroStake(amount)
      refreshFirstTime()
    } else {
      const receipt = await fetchWithCatchTxError(() => onStake(amount))
      if (receipt?.status) {
        toastSuccess(
          `${t('Staked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the farm')}
          </ToastDescriptionWithTx>,
        )
        onDone()
      }
    }
  }

  const handleNonDneroStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onStake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber), 18)

    if (receipt) {
      addTransaction(receipt, {
        type: 'non-dnero-farm',
        translatableSummary: {
          text: 'Stake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        nonDneroFarm: {
          type: NonDneroFarmStepType.STAKE,
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
              tx: receipt.hash,
              isFirstTime,
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 2,
              tx: '',
              chainId: ChainId.DNERO,
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
      onDone()
    }
  }

  const handleUnstake = async (amount: string) => {
    if (vaultPid) {
      await handleNonDneroUnStake(amount)
    } else {
      const receipt = await fetchWithCatchTxError(() => onUnstake(amount))
      if (receipt?.status) {
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your earnings have also been harvested to your wallet')}
          </ToastDescriptionWithTx>,
        )
        onDone()
      }
    }
  }

  const handleNonDneroUnStake = async (amountValue: string) => {
    const receipt = await fetchTxResponse(() => onUnstake(amountValue))
    const amountAsBigNumber = new BigNumber(amountValue).times(DEFAULT_TOKEN_DECIMAL)
    const amount = formatLpBalance(new BigNumber(amountAsBigNumber), 18)

    if (receipt) {
      addTransaction(receipt, {
        type: 'non-dnero-farm',
        translatableSummary: {
          text: 'Unstake %amount% %lpSymbol% Token',
          data: { amount, lpSymbol },
        },
        nonDneroFarm: {
          type: NonDneroFarmStepType.UNSTAKE,
          status: FarmTransactionStatus.PENDING,
          amount,
          lpSymbol,
          lpAddress,
          steps: [
            {
              step: 1,
              chainId,
              tx: receipt.hash,
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 2,
              chainId: ChainId.DNERO,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
            {
              step: 3,
              chainId,
              tx: '',
              status: FarmTransactionStatus.PENDING,
            },
          ],
        },
      })

      dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
      onDone()
    }
  }

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onApprove()
    })
    if (receipt?.status) {
      toastSuccess(t('Contract Enabled'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
      onDone()
    }
  }, [onApprove, t, toastSuccess, fetchWithCatchTxError, onDone])

  const bWDneroCalculatorSlot = (calculatorBalance) => (
    <BWDneroCalculator
      targetInputBalance={calculatorBalance}
      earningTokenPrice={wdneroPrice.toNumber()}
      lpTokenStakedAmount={lpTokenStakedAmount}
      setBWDneroMultiplier={setBWDneroMultiplier}
    />
  )

  const [onPresentDeposit] = useModal(
    <FarmWidget.DepositModal
      account={account}
      pid={pid}
      lpTotalSupply={lpTotalSupply}
      max={tokenBalance}
      stakedBalance={stakedBalance}
      tokenName={lpSymbol}
      multiplier={multiplier}
      lpPrice={lpTokenPrice}
      lpLabel={lpLabel}
      apr={apr}
      displayApr={displayApr}
      addLiquidityUrl={addLiquidityUrl}
      wdneroPrice={wdneroPrice}
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      bWDneroMultiplier={bWDneroMultiplier}
      showCrossChainFarmWarning={chainId !== ChainId.DNERO && chainId !== ChainId.DNERO_TESTNET}
      crossChainWarningText={crossChainWarningText}
      decimals={18}
      allowance={allowance}
      enablePendingTx={pendingTx}
      onConfirm={handleStake}
      handleApprove={handleApprove}
      bWDneroCalculatorSlot={bWDneroCalculatorSlot}
    />,
    true,
    true,
    `farm-deposit-modal-${pid}`,
  )

  const [onPresentWithdraw] = useModal(
    <FarmWidget.WithdrawModal
      showActiveBooster={boosterState === YieldBoosterState.ACTIVE}
      max={stakedBalance}
      onConfirm={handleUnstake}
      lpPrice={lpTokenPrice}
      tokenName={lpSymbol}
      showCrossChainFarmWarning={chainId !== ChainId.DNERO && chainId !== ChainId.DNERO_TESTNET}
      decimals={18}
    />,
  )

  const renderStakingButtons = () => {
    return stakedBalance.eq(0) ? (
      <Button onClick={onPresentDeposit} disabled={isStakeReady}>
        {t('Stake LP')}
      </Button>
    ) : (
      <IconButtonWrapper>
        <IconButton mr="6px" variant="tertiary" disabled={pendingFarm.length > 0} onClick={onPresentWithdraw}>
          <MinusIcon color="primary" width="14px" />
        </IconButton>
        <IconButton variant="tertiary" onClick={onPresentDeposit} disabled={isStakeReady || isBloctoETH}>
          <AddIcon color="primary" width="14px" />
        </IconButton>
      </IconButtonWrapper>
    )
  }

  const [onPresentTransactionModal] = useModal(<WalletModal initialView={WalletView.TRANSACTIONS} />)

  const onClickLoadingIcon = () => {
    const { length } = pendingFarm
    if (length) {
      if (length > 1) {
        onPresentTransactionModal()
      } else {
        dispatch(pickFarmTransactionTx({ tx: pendingFarm[0].txid, chainId }))
      }
    }
  }

  // TODO: Move this out to prevent unnecessary re-rendered
  if (!isApproved) {
    return (
      <Button mt="8px" width="100%" disabled={pendingTx || isBloctoETH} onClick={handleApprove}>
        {t('Enable Contract')}
      </Button>
    )
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <FarmWidget.StakedLP
        decimals={18}
        stakedBalance={stakedBalance}
        quoteTokenSymbol={WNATIVE[chainId]?.symbol === quoteToken.symbol ? NATIVE[chainId]?.symbol : quoteToken.symbol}
        tokenSymbol={WNATIVE[chainId]?.symbol === token.symbol ? NATIVE[chainId]?.symbol : token.symbol}
        lpTotalSupply={lpTotalSupply}
        lpTokenPrice={lpTokenPrice}
        tokenAmountTotal={tokenAmountTotal}
        quoteTokenAmountTotal={quoteTokenAmountTotal}
        pendingFarmLength={pendingFarm.length}
        onClickLoadingIcon={onClickLoadingIcon}
      />
      {renderStakingButtons()}
    </Flex>
  )
}

export default StakeAction
