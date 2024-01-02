import { getSourceChain } from '@dneroswap/ifos'
import { useMemo } from 'react'
import { ChainId } from '@dneroswap/chains'

// By deafult source chain is the first chain that supports native ifo
export function useIfoSourceChain(chainId?: ChainId) {
  return useMemo(() => getSourceChain(chainId) || ChainId.DNERO, [chainId])
}
