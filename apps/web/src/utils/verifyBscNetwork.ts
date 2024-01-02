import { ChainId } from '@dneroswap/chains'

export const verifyDneroNetwork = (chainId?: number) => {
  return Boolean(chainId && (chainId === ChainId.DNERO || chainId === ChainId.DNERO_TESTNET))
}
