import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getWDneroContract } from 'utils/contractHelpers'
import { useAccount, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export const useWDneroApprovalStatus = (spender) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, refetch } = useContractRead({
    chainId,
    ...getWDneroContract(chainId),
    enabled: Boolean(account && spender),
    functionName: 'allowance',
    args: [account, spender],
    watch: true,
  })

  return useMemo(
    () => ({
      isVaultApproved: data > 0,
      allowance: new BigNumber(data?.toString()),
      setLastUpdated: refetch,
    }),
    [data, refetch],
  )
}

export default useWDneroApprovalStatus
