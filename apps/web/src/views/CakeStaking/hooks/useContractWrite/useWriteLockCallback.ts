import { getDecimalAmount } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeWDneroContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, wdneroLockTxHashAtom } from 'state/vewdnero/atoms'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { calculateGasMargin } from 'utils'
import { useAccount, useWalletClient } from 'wagmi'
import { useRoundedUnlockTimestamp } from '../useRoundedUnlockTimestamp'

// invoke the lock function on the vewdnero contract
export const useWriteLockCallback = () => {
  const veWDneroContract = useVeWDneroContract()
  const { address: account } = useAccount()
  const { wdneroLockAmount, wdneroLockWeeks } = useLockWDneroData()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(wdneroLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const roundedUnlockTimestamp = useRoundedUnlockTimestamp()

  const lockWDnero = useCallback(async () => {
    const week = Number(wdneroLockWeeks)
    if (!week || !wdneroLockAmount || !roundedUnlockTimestamp) return

    const { request } = await veWDneroContract.simulate.createLock(
      [BigInt(getDecimalAmount(new BN(wdneroLockAmount), 18).toString()), roundedUnlockTimestamp],
      {
        account: account!,
        chain: veWDneroContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.LOCK_WDNERO)

    const hash = await walletClient?.writeContract({
      ...request,
      gas: request.gas ? calculateGasMargin(request.gas) : undefined,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.LOCK_WDNERO_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [
    wdneroLockWeeks,
    wdneroLockAmount,
    roundedUnlockTimestamp,
    veWDneroContract.simulate,
    veWDneroContract.chain,
    account,
    setStatus,
    walletClient,
    setTxHash,
    waitForTransaction,
  ])

  return lockWDnero
}
