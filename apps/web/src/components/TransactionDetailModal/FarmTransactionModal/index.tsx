import { useMemo } from 'react'
import { Modal, ModalBody, Flex } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import { LightGreyCard } from 'components/Card'
import { useFarmHarvestTransaction } from 'state/global/hooks'
import { useAllTransactions } from 'state/transactions/hooks'
import { FarmTransactionStatus, NonDneroFarmStepType } from 'state/transactions/actions'
import FarmInfo from './FarmInfo'
import FarmDetail from './FarmDetail'

interface FarmTransactionModalProps {
  onDismiss: () => void
}

const FarmTransactionModal: React.FC<React.PropsWithChildren<FarmTransactionModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const allTransactions = useAllTransactions()
  const { pickedTx } = useFarmHarvestTransaction()

  const pickedData = useMemo(() => allTransactions?.[pickedTx.chainId]?.[pickedTx.tx], [allTransactions, pickedTx])

  const modalTitle = useMemo(() => {
    let title = ''

    if (pickedData?.nonDneroFarm) {
      const { type, status } = pickedData?.nonDneroFarm || {}
      const isPending = status === FarmTransactionStatus.PENDING
      if (type === NonDneroFarmStepType.STAKE) {
        title = isPending ? t('Staking') : t('Staked!')
      } else if (type === NonDneroFarmStepType.UNSTAKE) {
        title = isPending ? t('Unstaking') : t('Unstaked!')
      }
    }
    return title
  }, [pickedData, t])

  return (
    <Modal title={modalTitle} onDismiss={onDismiss}>
      <ModalBody width={['100%', '100%', '100%', '352px']}>
        <Flex flexDirection="column">
          <FarmInfo pickedData={pickedData} />
          <LightGreyCard padding="16px 16px 0 16px">
            {pickedData?.nonDneroFarm?.steps.map((step) => (
              <FarmDetail key={step.step} step={step} status={pickedData?.nonDneroFarm?.status} />
            ))}
          </LightGreyCard>
        </Flex>
      </ModalBody>
    </Modal>
  )
}

export default FarmTransactionModal
