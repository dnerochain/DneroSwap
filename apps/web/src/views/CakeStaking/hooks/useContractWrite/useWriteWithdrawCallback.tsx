import { useVeWDneroContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, wdneroLockTxHashAtom, ApproveAndLockStatus } from 'state/vewdnero/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { zeroAddress } from 'viem'

// invoke the lock function on the vewdnero contract
export const useWriteWithdrawCallback = () => {
  const veWDneroContract = useVeWDneroContract()
  const { address: account } = useAccount()
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const setTxHash = useSetAtom(wdneroLockTxHashAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const withdraw = useCallback(async () => {
    const { request } = await veWDneroContract.simulate.withdrawAll([zeroAddress], {
      account: account!,
      chain: veWDneroContract.chain,
    })

    setStatus(ApproveAndLockStatus.UNLOCK_WDNERO)

    const hash = await walletClient?.writeContract({
      ...request,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.UNLOCK_WDNERO_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veWDneroContract, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return withdraw
}
