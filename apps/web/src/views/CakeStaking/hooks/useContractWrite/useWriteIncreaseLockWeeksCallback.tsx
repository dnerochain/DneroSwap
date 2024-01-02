import { useVeWDneroContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import {
  ApproveAndLockStatus,
  approveAndLockStatusAtom,
  wdneroLockTxHashAtom,
  wdneroLockWeeksAtom,
} from 'state/vewdnero/atoms'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'
import { useWDneroLockStatus } from '../useVeWDneroUserInfo'

export const useWriteIncreaseLockWeeksCallback = () => {
  const veWDneroContract = useVeWDneroContract()
  const { wdneroUnlockTime, wdneroLockExpired } = useWDneroLockStatus()
  const { address: account } = useAccount()
  const { wdneroLockWeeks } = useLockWDneroData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(wdneroLockTxHashAtom)
  const setWDneroLockWeeks = useSetAtom(wdneroLockWeeksAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp(wdneroLockExpired ? undefined : Number(wdneroUnlockTime))

  const increaseLockWeeks = useCallback(async () => {
    const week = Number(wdneroLockWeeks)
    if (!week || !roundedUnlockTimestamp) return

    const { request } = await veWDneroContract.simulate.increaseUnlockTime([roundedUnlockTimestamp], {
      account: account!,
      chain: veWDneroContract.chain,
    })

    setStatus(ApproveAndLockStatus.INCREASE_WEEKS)

    const hash = await walletClient?.writeContract({
      ...request,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.INCREASE_WEEKS_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
      setWDneroLockWeeks('')
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [
    wdneroLockWeeks,
    veWDneroContract.simulate,
    veWDneroContract.chain,
    roundedUnlockTimestamp,
    account,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
    setWDneroLockWeeks,
  ])

  return increaseLockWeeks
}
