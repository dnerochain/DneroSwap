import { useTranslation } from '@dneroswap/localization'
import { Button, Flex, Heading, TooltipText, useToast, useTooltip, useModal, Balance } from '@dneroswap/uikit'
import { FarmWidget } from '@dneroswap/widgets-internal'
import { useAccount } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import BigNumber from 'bignumber.js'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'

import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import { Token } from '@dneroswap/sdk'
import MultiChainHarvestModal from 'views/Farms/components/MultiChainHarvestModal'

interface FarmCardActionsProps {
  pid?: number
  token?: Token
  quoteToken?: Token
  earnings?: BigNumber
  vaultPid?: number
  proxyWDneroBalance?: number
  lpSymbol?: string
  onReward?: () => Promise<SendTransactionResult>
  onDone?: () => void
}

const HarvestAction: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  pid,
  token,
  quoteToken,
  vaultPid,
  earnings,
  proxyWDneroBalance,
  lpSymbol,
  onReward,
  onDone,
}) => {
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { t } = useTranslation()
  const wdneroPrice = useWDneroPrice()
  const rawEarningsBalance = account ? getBalanceAmount(earnings) : BIG_ZERO
  const displayBalance = rawEarningsBalance.toFixed(5, BigNumber.ROUND_DOWN)
  const earningsBusd = rawEarningsBalance ? rawEarningsBalance.multipliedBy(wdneroPrice).toNumber() : 0
  const tooltipBalance = rawEarningsBalance.isGreaterThan(FarmWidget.FARMS_SMALL_AMOUNT_THRESHOLD)
    ? displayBalance
    : '< 0.00001'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    `${tooltipBalance} ${t(
      `WDNERO has been harvested to the farm booster contract and will be automatically sent to your wallet upon the next harvest.`,
    )}`,
    {
      placement: 'bottom',
    },
  )

  const onClickHarvestButton = () => {
    if (vaultPid) {
      onPresentNonDneroHarvestModal()
    } else {
      handleHarvest()
    }
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return onReward()
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'WDNERO' })}
        </ToastDescriptionWithTx>,
      )
      onDone?.()
    }
  }

  const [onPresentNonDneroHarvestModal] = useModal(
    <MultiChainHarvestModal
      pid={pid}
      token={token}
      lpSymbol={lpSymbol}
      quoteToken={quoteToken}
      earningsBigNumber={earnings}
      earningsBusd={earningsBusd}
    />,
  )

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Flex flexDirection="column" alignItems="flex-start">
        {proxyWDneroBalance ? (
          <>
            <TooltipText ref={targetRef} decorationColor="secondary">
              <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
            </TooltipText>
            {tooltipVisible && tooltip}
          </>
        ) : (
          <Heading color={rawEarningsBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
        )}
        {earningsBusd > 0 && (
          <Balance fontSize="12px" color="textSubtle" decimals={2} value={earningsBusd} unit=" USD" prefix="~" />
        )}
      </Flex>
      <Button disabled={rawEarningsBalance.eq(0) || pendingTx} onClick={onClickHarvestButton}>
        {pendingTx ? t('Harvesting') : t('Harvest')}
      </Button>
    </Flex>
  )
}

export default HarvestAction
