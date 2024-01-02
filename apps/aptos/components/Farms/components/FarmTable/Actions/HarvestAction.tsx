import { TransactionResponse } from '@dneroswap/awgmi/core'
import { useTranslation } from '@dneroswap/localization'
import { Skeleton, useToast } from '@dneroswap/uikit'
import { FarmWidget } from '@dneroswap/widgets-internal'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { usePriceWDneroUsdc } from 'hooks/useStablePrice'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'
import { FarmWithStakedValue } from '@dneroswap/farms'
import useHarvestFarm from '../../../hooks/useHarvestFarm'

const { FarmTableHarvestAction } = FarmWidget.FarmTable

interface HarvestActionProps extends FarmWithStakedValue {
  userDataReady: boolean
  onReward: () => Promise<TransactionResponse>
}

export const HarvestActionContainer = ({ children, ...props }) => {
  const { onReward } = useHarvestFarm(props.lpAddress)

  return children({ ...props, onReward })
}

export const HarvestAction: React.FunctionComponent<React.PropsWithChildren<HarvestActionProps>> = ({
  userData,
  userDataReady,
  onReward,
}) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const earningsBigNumber = userData?.earnings ? new BigNumber(userData.earnings) : BIG_ZERO
  const wdneroPrice = usePriceWDneroUsdc()
  let earnings = BIG_ZERO
  let earningsBusd = 0
  let displayBalance = userDataReady ? earnings.toFixed(5, BigNumber.ROUND_DOWN) : <Skeleton width={60} />

  // If user didn't connect wallet default balance will be 0
  if (!earningsBigNumber.isZero()) {
    earnings = getBalanceAmount(earningsBigNumber, FARM_DEFAULT_DECIMALS)
    earningsBusd = earnings.multipliedBy(wdneroPrice).toNumber()
    displayBalance = earnings.toFixed(5, BigNumber.ROUND_DOWN)
  }

  const handleHarvest = async () => {
    const receipt = await fetchWithCatchTxError(() => onReward())
    if (receipt?.status) {
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'WDNERO' })}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <FarmTableHarvestAction
      earnings={earnings}
      earningsBusd={earningsBusd}
      displayBalance={displayBalance}
      pendingTx={pendingTx}
      userDataReady={userDataReady}
      handleHarvest={handleHarvest}
    />
  )
}

export default HarvestAction
