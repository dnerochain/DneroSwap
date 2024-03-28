import { ChainId, chainNames } from '@dneroswap/chains'
import memoize from 'lodash/memoize'
import {
  Chain,
  arbitrum,
  arbitrumGoerli,
  base,
  baseGoerli,
  dneroTestnet,
  dnero as dnero_,
  goerli,
  linea,
  lineaTestnet,
  mainnet,
  opDNERO,
  opDNEROTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  scrollSepolia,
  zkSync,
  zkSyncTestnet,
} from 'wagmi/chains'

export const CHAIN_QUERY_NAME = chainNames

const CHAIN_QUERY_NAME_TO_ID = Object.entries(CHAIN_QUERY_NAME).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName.toLowerCase()]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

export const getChainId = memoize((chainName: string) => {
  if (!chainName) return undefined
  return CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] ? +CHAIN_QUERY_NAME_TO_ID[chainName.toLowerCase()] : undefined
})

const dnero = {
  ...dnero_,
  rpcUrls: {
    ...dnero_.rpcUrls,
    public: {
      ...dnero_.rpcUrls.public,
      http: ['https://eth-rpc-api.dnerochain.xyz/rpc/'],
    },
    default: {
      ...dnero_.rpcUrls.default,
      http: ['https://eth-rpc-api.dnerochain.xyz/rpc/'],
    },
  },
} satisfies Chain

/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export const L2_CHAIN_IDS: ChainId[] = [
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON_ZKEVM,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.ZKSYNC,
  ChainId.ZKSYNC_TESTNET,
  ChainId.LINEA_TESTNET,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.BASE_TESTNET,
  ChainId.OPDNERO,
  ChainId.OPDNERO_TESTNET,
]

export const CHAINS = [
  dnero,
  mainnet,
  dneroTestnet,
  goerli,
  polygonZkEvm,
  polygonZkEvmTestnet,
  zkSync,
  zkSyncTestnet,
  arbitrum,
  arbitrumGoerli,
  linea,
  lineaTestnet,
  arbitrumGoerli,
  arbitrum,
  base,
  baseGoerli,
  opDNERO,
  opDNEROTestnet,
  scrollSepolia,
]
