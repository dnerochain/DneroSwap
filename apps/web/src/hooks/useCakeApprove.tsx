import { MaxUint256 } from '@dneroswap/swap-sdk-core'
import { useTranslation } from '@dneroswap/localization'
import { useToast } from '@dneroswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useWDnero } from 'hooks/useContract'

const useWDneroApprove = (setLastUpdated: () => void, spender, successMsg) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const wdneroContract = useWDnero()

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(wdneroContract, 'approve', [spender, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>{successMsg}</ToastDescriptionWithTx>,
      )
      setLastUpdated()
    }
  }

  return { handleApprove, pendingTx }
}

export default useWDneroApprove
