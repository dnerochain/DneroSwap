import { AptosCoin } from '@dneroswap/aptos-swap-sdk'
import { defaultChain } from '@dneroswap/awgmi'
import { useMemo } from 'react'
import { useActiveChainId } from './useNetwork'

const useNativeCurrency = (chainId?: number) => {
  const webChainId = useActiveChainId()

  return useMemo(() => {
    return AptosCoin.onChain(chainId || webChainId || defaultChain.id)
  }, [chainId, webChainId])
}

export default useNativeCurrency
