import { ApprovalState } from 'hooks/useApproveCallback'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, wdneroLockTxHashAtom } from 'state/vewdnero/atoms'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { isUserRejected } from 'utils/sentry'
import { useLockApproveCallback } from '../useLockAllowance'
import { useWriteIncreaseLockAmountCallback } from './useWriteIncreaseLockAmountCallback'
import { useWriteLockCallback } from './useWriteLockCallback'

export const useWriteWithApproveCallback = () => {
  const setTxHash = useSetAtom(wdneroLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { wdneroLockAmount } = useLockWDneroData()

  const { approvalState, approveCallback } = useLockApproveCallback(wdneroLockAmount)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const handleCancel = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
  }, [setStatus])

  return useCallback(
    async (write: () => Promise<unknown>) => {
      setTxHash('')
      try {
        if (approvalState === ApprovalState.NOT_APPROVED) {
          setStatus(ApproveAndLockStatus.APPROVING_TOKEN)
          const { hash } = await approveCallback()
          if (hash) {
            await waitForTransaction({ hash })
          }
          setStatus(ApproveAndLockStatus.LOCK_WDNERO)
          await write()
          return
        }
        if (approvalState === ApprovalState.APPROVED) {
          await write()
        }
      } catch (error) {
        console.error(error)
        if (isUserRejected(error)) {
          handleCancel()
        }
      }
    },
    [approvalState, approveCallback, handleCancel, setStatus, setTxHash, waitForTransaction],
  )
}

export const useWriteApproveAndLockCallback = () => {
  const withApprove = useWriteWithApproveCallback()
  const lockWDnero = useWriteLockCallback()

  return useCallback(async () => {
    await withApprove(lockWDnero)
  }, [withApprove, lockWDnero])
}

export const useWriteApproveAndIncreaseLockAmountCallback = () => {
  const withApprove = useWriteWithApproveCallback()
  const increaseLockAmount = useWriteIncreaseLockAmountCallback()

  return useCallback(async () => {
    await withApprove(increaseLockAmount)
  }, [withApprove, increaseLockAmount])
}
