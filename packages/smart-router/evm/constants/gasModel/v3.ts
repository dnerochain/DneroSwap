import { ChainId } from '@dneroswap/chains'

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = 0n

export const BASE_SWAP_COST_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.DNERO:
    case ChainId.DNERO_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPDNERO:
    case ChainId.OPDNERO_TESTNET:
      return 2000n
    default:
      return 0n
  }
}
export const COST_PER_INIT_TICK = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.DNERO:
    case ChainId.DNERO_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPDNERO:
    case ChainId.OPDNERO_TESTNET:
      return 31000n
    default:
      return 0n
  }
}

export const COST_PER_HOP_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.DNERO:
    case ChainId.DNERO_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPDNERO:
    case ChainId.OPDNERO_TESTNET:
      return 80000n
    default:
      return 0n
  }
}
