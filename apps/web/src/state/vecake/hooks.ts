import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback } from 'react'
import {
  approveAndLockStatusAtom,
  wdneroLockAmountAtom,
  wdneroLockApprovedAtom,
  wdneroLockTxHashAtom,
  wdneroLockWeeksAtom,
} from './atoms'

export const useWDneroApproveAndLockStatus = () => {
  return useAtomValue(approveAndLockStatusAtom)
}

export const useLockWDneroData = () => {
  const wdneroLockApproved = useAtomValue(wdneroLockApprovedAtom)
  const status = useWDneroApproveAndLockStatus()
  const wdneroLockAmount = useAtomValue(wdneroLockAmountAtom)
  const wdneroLockWeeks = useAtomValue(wdneroLockWeeksAtom)
  const wdneroLockTxHash = useAtomValue(wdneroLockTxHashAtom)

  return {
    status,
    wdneroLockApproved,
    wdneroLockAmount,
    wdneroLockWeeks,
    wdneroLockTxHash,
  }
}

export const useLockWDneroDataResetCallback = () => {
  const setWDneroLockAmount = useSetAtom(wdneroLockAmountAtom)
  const setWDneroLockWeeks = useSetAtom(wdneroLockWeeksAtom)

  return useCallback(() => {
    setWDneroLockAmount('0')
    setWDneroLockWeeks('10')
  }, [setWDneroLockAmount, setWDneroLockWeeks])
}
