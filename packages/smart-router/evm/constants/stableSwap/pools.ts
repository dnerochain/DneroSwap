import { ChainId } from '@dneroswap/chains'

import { StableSwapPool } from './types'
import { pools as dneroPools } from './5647'
import { pools as dneroTestnetPools } from './97'

export type StableSwapPoolMap<TChainId extends number> = {
  [chainId in TChainId]: StableSwapPool[]
}

export const isStableSwapSupported = (chainId: number | undefined): chainId is StableSupportedChainId => {
  if (!chainId) {
    return false
  }
  return STABLE_SUPPORTED_CHAIN_IDS.includes(chainId)
}

export const STABLE_SUPPORTED_CHAIN_IDS = [ChainId.DNERO, ChainId.DNERO_TESTNET] as const

export type StableSupportedChainId = (typeof STABLE_SUPPORTED_CHAIN_IDS)[number]

export const STABLE_POOL_MAP = {
  [ChainId.DNERO]: dneroPools,
  [ChainId.DNERO_TESTNET]: dneroTestnetPools,
} satisfies StableSwapPoolMap<StableSupportedChainId>
