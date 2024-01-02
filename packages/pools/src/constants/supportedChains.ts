import { ChainId } from '@dneroswap/chains'

export const SUPPORTED_CHAIN_IDS = [
  ChainId.DNERO,
  ChainId.DNERO_TESTNET,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.BASE_TESTNET,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.OPDNERO,
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAIN_IDS)[number]

export const WDNERO_VAULT_SUPPORTED_CHAINS = [ChainId.DNERO, ChainId.DNERO_TESTNET] as const

export type WDneroVaultSupportedChainId = (typeof WDNERO_VAULT_SUPPORTED_CHAINS)[number]
