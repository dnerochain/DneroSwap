import { ChainId } from '@dneroswap/chains'
import { supportedChainId } from '@dneroswap/farms'

export const SUPPORT_ONLY_DNERO = [ChainId.DNERO]
export const SUPPORT_FARMS = supportedChainId
export const SUPPORT_BUY_CRYPTO = [
  ChainId.DNERO,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ZKSYNC, // NO PROVIDER SUPPORT ZK_SYNC_ERA
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.BASE,
]

export const LIQUID_STAKING_SUPPORTED_CHAINS = [
  ChainId.DNERO,
  ChainId.ETHEREUM,
  ChainId.DNERO_TESTNET,
  ChainId.ARBITRUM_GOERLI,
]
export const FIXED_STAKING_SUPPORTED_CHAINS = [ChainId.DNERO]

export const V3_MIGRATION_SUPPORTED_CHAINS = [ChainId.DNERO, ChainId.ETHEREUM]

export const SUPPORT_WDNERO_STAKING = [ChainId.DNERO, ChainId.DNERO_TESTNET]
