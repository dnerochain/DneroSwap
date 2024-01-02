import { useVeWDneroContract } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useSetAtom } from 'jotai'
import { useCallback } from 'react'
import { ApproveAndLockStatus, approveAndLockStatusAtom, wdneroLockTxHashAtom } from 'state/vewdnero/atoms'
import { calculateGasMargin } from 'utils'
import { useAccount, useWalletClient } from 'wagmi'

export const useWriteMigrateCallback = () => {
  const veWDneroContract = useVeWDneroContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(wdneroLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const lockWDnero = useCallback(async () => {
    const { request } = await veWDneroContract.simulate.migrateFromWDneroPool({
      account: account!,
      chain: veWDneroContract.chain,
    })

    setStatus(ApproveAndLockStatus.MIGRATE)

    const hash = await walletClient?.writeContract({
      ...request,
      gas: request.gas ? calculateGasMargin(request.gas) : undefined,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.MIGRATE_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veWDneroContract, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return lockWDnero
}
