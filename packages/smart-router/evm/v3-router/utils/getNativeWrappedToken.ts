import { Token, WNATIVE } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'

export function getNativeWrappedToken(chainId: ChainId): Token | null {
  return WNATIVE[chainId] ?? null
}
