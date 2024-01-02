import { useVeWDneroContract } from 'hooks/useContract'
import { useCallback } from 'react'
import BN from 'bignumber.js'
import { getDecimalAmount } from '@dneroswap/utils/formatBalance'
import { useAccount, useWalletClient } from 'wagmi'
import { useLockWDneroData } from 'state/vewdnero/hooks'
import { useSetAtom } from 'jotai'
import { approveAndLockStatusAtom, wdneroLockTxHashAtom, ApproveAndLockStatus } from 'state/vewdnero/atoms'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'

export const useWriteIncreaseLockAmountCallback = () => {
  const veWDneroContract = useVeWDneroContract()
  const { address: account } = useAccount()
  const { wdneroLockAmount } = useLockWDneroData()
  const setTxHash = useSetAtom(wdneroLockTxHashAtom)
  const setStatus = useSetAtom(approveAndLockStatusAtom)
  const { data: walletClient } = useWalletClient()
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  const increaseLockAmount = useCallback(async () => {
    const { request } = await veWDneroContract.simulate.increaseLockAmount(
      [BigInt(getDecimalAmount(new BN(wdneroLockAmount), 18).toString())],
      {
        account: account!,
        chain: veWDneroContract.chain,
      },
    )

    setStatus(ApproveAndLockStatus.INCREASE_AMOUNT)

    const hash = await walletClient?.writeContract({
      ...request,
      account,
    })
    setTxHash(hash ?? '')
    setStatus(ApproveAndLockStatus.INCREASE_AMOUNT_PENDING)
    if (hash) {
      await waitForTransaction({ hash })
    }
    setStatus(ApproveAndLockStatus.CONFIRMED)
  }, [veWDneroContract, wdneroLockAmount, account, setStatus, setTxHash, waitForTransaction, walletClient])

  return increaseLockAmount
}
