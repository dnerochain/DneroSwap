import { ChainId, Token } from '@dneroswap/sdk'
import { WDNERO, dneroTestnetTokens } from '@dneroswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useDNEROWDneroToken = (): Token | undefined => {
  const { chainId } = useActiveChainId()

  if (chainId === ChainId.DNERO) return WDNERO[chainId]
  if (chainId === ChainId.DNERO_TESTNET) return dneroTestnetTokens.wdnero2

  return undefined
}
