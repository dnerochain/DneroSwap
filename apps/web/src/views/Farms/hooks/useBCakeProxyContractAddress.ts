import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBWDneroFarmBoosterContract } from 'hooks/useContract'
import { Address } from 'wagmi'
import { bWDneroSupportedChainId } from '@dneroswap/farms'
import { useQuery } from '@tanstack/react-query'

export const useBWDneroProxyContractAddress = (account?: Address, chainId?: number) => {
  const bWDneroFarmBoosterContract = useBWDneroFarmBoosterContract()
  const isSupportedChain = chainId ? bWDneroSupportedChainId.includes(chainId) : false
  const { data, status, refetch } = useQuery(
    ['bProxyAddress', account, chainId],
    async () => bWDneroFarmBoosterContract.read.proxyContract([account]),
    {
      enabled: Boolean(account && isSupportedChain),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
  const isLoading = isSupportedChain ? status !== 'success' : false

  return {
    proxyAddress: data as Address,
    isLoading,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: refetch,
  }
}
