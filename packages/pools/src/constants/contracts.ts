import { ChainId } from '@dneroswap/chains'
import { Address } from 'viem'

import { SupportedChainId } from './supportedChains'

export type ContractAddresses<T extends ChainId = SupportedChainId> = {
  [chainId in T]: Address
}

export const IWDNERO = {
  [ChainId.DNERO]: '0x3C458828D1622F5f4d526eb0d24Da8C4Eb8F07b1',
  [ChainId.DNERO_TESTNET]: '0x5FB0b7a782c2f192493d86922dD3873b6392C8e8',
  [ChainId.ETHEREUM]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
  [ChainId.ARBITRUM_GOERLI]: '0x',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ZKSYNC_TESTNET]: '0x',
  [ChainId.BASE_TESTNET]: '0x',
  [ChainId.LINEA_TESTNET]: '0x',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x',
  [ChainId.OPDNERO]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const WDNERO_VAULT = {
  [ChainId.DNERO]: '0x45c54210128a065de780C4B0Df3d16664f7f859e',
  [ChainId.DNERO_TESTNET]: '0x1088Fb24053F03802F673b84d16AE1A7023E400b',
  [ChainId.ETHEREUM]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
  [ChainId.ARBITRUM_GOERLI]: '0x',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ZKSYNC_TESTNET]: '0x',
  [ChainId.BASE_TESTNET]: '0x',
  [ChainId.LINEA_TESTNET]: '0x',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x',
  [ChainId.OPDNERO]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>

export const WDNERO_FLEXIBLE_SIDE_VAULT = {
  [ChainId.DNERO]: '0x615e896A8C2CA8470A2e9dc2E9552998f8658Ea0',
  [ChainId.DNERO_TESTNET]: '0x1088Fb24053F03802F673b84d16AE1A7023E400b',
  [ChainId.ETHEREUM]: '0x',
  [ChainId.ARBITRUM_ONE]: '0x',
  [ChainId.ARBITRUM_GOERLI]: '0x',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ZKSYNC_TESTNET]: '0x',
  [ChainId.BASE_TESTNET]: '0x',
  [ChainId.LINEA_TESTNET]: '0x',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x',
  [ChainId.OPDNERO]: '0x',
} as const satisfies ContractAddresses<SupportedChainId>
