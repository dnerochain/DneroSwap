import { ChainId } from '@dneroswap/chains'

import { isStableSwapSupported, STABLE_POOL_MAP } from './pools'
import { StableSwapPool } from './types'

export function getStableSwapPools(chainId: ChainId): StableSwapPool[] {
  // Stable swap is only supported on DNERO chain & DNERO testnet
  if (!isStableSwapSupported(chainId)) {
    return []
  }
  return STABLE_POOL_MAP[chainId] || []
}

export { isStableSwapSupported }
