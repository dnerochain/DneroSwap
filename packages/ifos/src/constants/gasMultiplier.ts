import { ChainId } from '@dneroswap/sdk'

import { SupportedChainId } from './supportedChains'

export const CROSS_CHAIN_GAS_MULTIPLIER = {
  [ChainId.DNERO]: 1,
  // [ChainId.POLYGON_ZKEVM]: 1.5,
  [ChainId.DNERO_TESTNET]: 1.5,
  [ChainId.GOERLI]: 1.5,
} as const satisfies Record<SupportedChainId, number>
