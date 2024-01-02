import { ChainId } from '@dneroswap/chains'

export const SUPPORTED_CHAINS = [
  ChainId.ETHEREUM,
  ChainId.DNERO,
  ChainId.LINEA_TESTNET,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
  ChainId.DNERO_TESTNET,
  ChainId.GOERLI,
  ChainId.ARBITRUM_ONE,
  ChainId.SCROLL_SEPOLIA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.LINEA,
  ChainId.OPDNERO,
] as const

export type SupportedChainId = (typeof SUPPORTED_CHAINS)[number]
