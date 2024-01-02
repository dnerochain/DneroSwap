import { useTranslation } from '@dneroswap/localization'
import { DneroScanIcon, Modal, ModalProps, ModalV2, ScanLink, UseModalV2Props } from '@dneroswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApproveAndLockStatus } from 'state/vewdnero/atoms'
import { getBlockExploreLink } from 'utils'
import { LockInfo } from './LockInfo'
import { PendingModalContent } from './PendingModalContent'
import { StepsIndicator } from './StepsIndicator'
import { TxSubmittedModalContent } from './TxSubmittedModalContent'

const SeamlessModal: React.FC<React.PropsWithChildren<Omit<ModalProps, 'title'> & { title?: string }>> = ({
  children,
  title = '',
  ...props
}) => {
  return (
    <Modal
      title={title}
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      headerPadding="12px 24px"
      bodyPadding="0 24px 24px"
      headerBackground="transparent"
      headerBorderColor="transparent"
      {...props}
    >
      {children}
    </Modal>
  )
}
type ApproveAndLockModalProps = UseModalV2Props & {
  status: ApproveAndLockStatus
  wdneroLockAmount: string
  wdneroLockWeeks: string
  wdneroLockTxHash?: string
  wdneroLockApproved?: boolean
}

export const ApproveAndLockModal: React.FC<ApproveAndLockModalProps> = ({
  status,
  wdneroLockAmount,
  wdneroLockWeeks,
  wdneroLockTxHash,
  wdneroLockApproved,
  // modal props
  isOpen,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const lockInfo = <LockInfo status={status} amount={wdneroLockAmount} week={wdneroLockWeeks} />
  const scanLink = wdneroLockTxHash ? (
    <ScanLink small icon={<DneroScanIcon />} href={getBlockExploreLink(wdneroLockTxHash, 'transaction', chainId)}>
      {t('View on %site%', {
        site: t('Explorer'),
      })}
      {` ${wdneroLockTxHash.slice(0, 8)}...`}
    </ScanLink>
  ) : null
  return (
    <ModalV2 isOpen={isOpen} onDismiss={onDismiss}>
      <SeamlessModal>
        {status < ApproveAndLockStatus.LOCK_WDNERO_PENDING ? (
          <>
            <PendingModalContent
              title={status === ApproveAndLockStatus.APPROVING_TOKEN ? t('Approve WDNERO spending') : t('Confirm Lock')}
              subTitle={status === ApproveAndLockStatus.APPROVING_TOKEN ? null : lockInfo}
            />
            {!wdneroLockApproved ? <StepsIndicator currentStep={status} /> : null}
          </>
        ) : null}

        {[
          ApproveAndLockStatus.LOCK_WDNERO_PENDING,
          ApproveAndLockStatus.INCREASE_WEEKS_PENDING,
          ApproveAndLockStatus.INCREASE_AMOUNT_PENDING,
        ].includes(status) ? (
          <TxSubmittedModalContent title={t('Transaction Submitted')} subTitle={lockInfo} />
        ) : null}

        {status === ApproveAndLockStatus.INCREASE_AMOUNT ? (
          <PendingModalContent title={t('Confirm Lock')} subTitle={lockInfo} />
        ) : null}
        {status === ApproveAndLockStatus.INCREASE_WEEKS ? (
          <PendingModalContent title={t('Confirm Lock')} subTitle={lockInfo} />
        ) : null}

        {status === ApproveAndLockStatus.UNLOCK_WDNERO ? <PendingModalContent title={t('Confirm unlock')} /> : null}

        {status === ApproveAndLockStatus.MIGRATE ? <PendingModalContent title={t('Confirm migrate')} /> : null}

        {[ApproveAndLockStatus.UNLOCK_WDNERO_PENDING, ApproveAndLockStatus.MIGRATE_PENDING].includes(status) ? (
          <TxSubmittedModalContent title={t('Transaction Submitted')} />
        ) : null}

        {status === ApproveAndLockStatus.CONFIRMED ? (
          <TxSubmittedModalContent title={t('Transaction receipt:')} subTitle={scanLink} />
        ) : null}
      </SeamlessModal>
    </ModalV2>
  )
}
