import { useAccount } from 'wagmi'
import { ChainId } from '@dneroswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useWDneroVaultContract } from 'hooks/useContract'
import { useActiveChainId } from './useActiveChainId'

export const useUserWDneroLockStatus = () => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const wdneroVaultContract = useWDneroVaultContract()

  const { data: userWDneroLockStatus = null } = useQuery(
    ['userWDneroLockStatus', account],
    async () => {
      if (!account) return undefined
      const [, , , , , lockEndTime, , locked] = await wdneroVaultContract.read.userInfo([account])
      const lockEndTimeStr = lockEndTime.toString()
      return locked && (lockEndTimeStr === '0' || Date.now() > parseInt(lockEndTimeStr) * 1000)
    },
    {
      enabled: Boolean(account && chainId === ChainId.DNERO),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )
  return userWDneroLockStatus
}
