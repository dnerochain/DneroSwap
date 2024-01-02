import { getDecimalAmount } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useSetAtom } from 'jotai'
import { useCallback, useEffect, useState } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, wdneroLockApprovedAtom } from 'state/vewdnero/atoms'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { useLockApproveCallback } from './useLockAllowance'

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const setStatus = useSetAtom(approveAndLockStatusAtom)

  const onDismiss = useCallback(() => {
    setStatus(ApproveAndLockStatus.IDLE)
    setIsOpen(false)
  }, [setStatus])
  const onOpen = useCallback(() => setIsOpen(true), [])

  return {
    onDismiss,
    onOpen,
    isOpen,
    setIsOpen,
  }
}

export const useLockModal = () => {
  const modal = useModal()

  const lockWDneroData = useLockWDneroData()
  const { status, wdneroLockApproved, wdneroLockAmount } = lockWDneroData
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setWDneroLockApproved = useSetAtom(wdneroLockApprovedAtom)

  const { currentAllowance } = useLockApproveCallback(wdneroLockAmount)

  // when IDLE status, close modal
  useEffect(() => {
    if (modal.isOpen && status === ApproveAndLockStatus.IDLE) {
      modal.onDismiss()
    }
  }, [modal, modal.isOpen, setStatus, status])

  // on status change from IDLE, open modal
  useEffect(() => {
    if (!modal.isOpen && status !== ApproveAndLockStatus.IDLE) {
      modal.onOpen()
    }
  }, [modal, status])

  // when current allowance < lock amount, set approved to false
  useEffect(() => {
    if (!modal.isOpen) {
      const wdneroLockAmountBN = getDecimalAmount(new BN(wdneroLockAmount || 0)).toString()

      if (currentAllowance?.lessThan(wdneroLockAmountBN)) {
        setWDneroLockApproved(false)
      } else {
        setWDneroLockApproved(true)
      }
    }
  }, [wdneroLockApproved, wdneroLockAmount, setWDneroLockApproved, modal.isOpen, currentAllowance])

  return {
    modal,
    modalData: lockWDneroData,
  }
}
