import { ChainId } from '@dneroswap/chains'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVWDneroContract } from 'hooks/useContract'
import { useQuery } from '@tanstack/react-query'

interface UseVWDnero {
  isInitialization?: boolean
  refresh: () => void
}

const useVWDnero = (): UseVWDnero => {
  const { account, chainId } = useAccountActiveChain()
  const vWDneroContract = useVWDneroContract({ chainId })

  const { data, refetch } = useQuery(
    ['/v-wdnero-initialization', account, chainId],
    async () => {
      if (!account) return undefined
      try {
        return await vWDneroContract.read.initialization([account])
      } catch (error) {
        console.error('[ERROR] Fetching vWDnero initialization', error)
        return undefined
      }
    },
    {
      enabled: Boolean(account && chainId === ChainId.DNERO),
    },
  )

  return {
    isInitialization: data,
    refresh: refetch,
  }
}

export default useVWDnero
