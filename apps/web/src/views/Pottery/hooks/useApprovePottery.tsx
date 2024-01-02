import { useCallback } from 'react'
import { useToast } from '@dneroswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useTranslation } from '@dneroswap/localization'
import { ToastDescriptionWithTx } from 'components/Toast'
import { MaxUint256 } from '@dneroswap/swap-sdk-core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useWDnero } from 'hooks/useContract'
import { Address } from 'viem'

export const useApprovePottery = (potteryVaultAddress: string) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const wdneroContract = useWDnero()

  const onApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(wdneroContract, 'approve', [potteryVaultAddress as Address, MaxUint256])
    })

    if (receipt?.status) {
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Please progress to the next step.')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [potteryVaultAddress, wdneroContract, t, callWithGasPrice, fetchWithCatchTxError, toastSuccess])

  return { isPending, onApprove }
}
