import { useCallback } from 'react'
import { Button, useToast } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVWDneroContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

interface JoinButtonProps {
  refresh?: () => void
  onDismiss?: () => void
}

const JoinButton: React.FunctionComponent<React.PropsWithChildren<JoinButtonProps>> = ({ refresh, onDismiss }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { chainId } = useAccountActiveChain()
  const vWDneroContract = useVWDneroContract({ chainId })
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()

  const handleJoinButton = useCallback(async () => {
    try {
      const receipt = await fetchWithCatchTxError(() => vWDneroContract.write.syncFromWDneroPool([]))

      if (receipt?.status) {
        toastSuccess(
          t('Success!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Joined Revenue Sharing Pool.')}
          </ToastDescriptionWithTx>,
        )
        await refresh?.()
        onDismiss?.()
      }
    } catch (error) {
      console.error('[ERROR] Submit vWDnero syncFromWDneroPool', error)
    }
  }, [fetchWithCatchTxError, onDismiss, refresh, t, toastSuccess, vWDneroContract.write])

  return (
    <Button width="100%" m="24px 0 8px 0" disabled={isPending} onClick={handleJoinButton}>
      {t('Update Staking Position')}
    </Button>
  )
}

export default JoinButton
