import { useTranslation } from '@dneroswap/localization'
import { Button, useModal, useToast } from '@dneroswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { useAppDispatch } from 'state'

import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import { BWDneroMigrateModal } from '../../BWDneroMigrateModal'

interface MigrateActionButtonPropsType {
  pid: number
}

const MigrateActionButton: React.FunctionComponent<MigrateActionButtonPropsType> = ({ pid }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account, chainId } = useAccountActiveChain()
  const { onUnstake } = useUnstakeFarms(pid)
  const { stakedBalance } = useFarmUser(pid)
  const { lpAddress } = useFarmFromPid(pid)
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()

  const handleUnstakeWithCallback = async (amount: string, callback: () => void) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      callback()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    }
  }

  const [onPresentMigrate] = useModal(
    <BWDneroMigrateModal
      pid={pid}
      stakedBalance={stakedBalance}
      lpContract={lpContract}
      onUnStack={handleUnstakeWithCallback}
    />,
  )

  return <Button onClick={onPresentMigrate}>{t('Migrate')}</Button>
}

export default MigrateActionButton
