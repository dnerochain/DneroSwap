import { ChainId, V3_SUBGRAPHS } from '@dneroswap/chains'
import { OnChainProvider, SubgraphProvider } from '@dneroswap/smart-router/evm'
import { createPublicClient, http } from 'viem'
import { dnero, dneroTestnet, goerli, mainnet } from 'viem/chains'
import { GraphQLClient } from 'graphql-request'

import { SupportedChainId } from './constants'

const requireCheck = [ETH_NODE, GOERLI_NODE, DNERO_NODE, DNERO_TESTNET_NODE]
requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_NODE),
})

const dneroClient = createPublicClient({
  chain: dnero,
  transport: http(DNERO_NODE),
})

const dneroTestnetClient = createPublicClient({
  chain: dneroTestnet,
  transport: http(DNERO_TESTNET_NODE),
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
})

// @ts-ignore
export const viemProviders: OnChainProvider = ({ chainId }: { chainId?: ChainId }) => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.DNERO:
      return dneroClient
    case ChainId.DNERO_TESTNET:
      return dneroTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    default:
      return dneroClient
  }
}

export const v3SubgraphClients: Record<SupportedChainId, GraphQLClient> = {
  [ChainId.ETHEREUM]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ETHEREUM], { fetch }),
  [ChainId.POLYGON_ZKEVM]: new GraphQLClient(V3_SUBGRAPHS[ChainId.POLYGON_ZKEVM], { fetch }),
  [ChainId.ZKSYNC]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ZKSYNC], { fetch }),
  [ChainId.LINEA_TESTNET]: new GraphQLClient(V3_SUBGRAPHS[ChainId.LINEA_TESTNET], { fetch }),
  [ChainId.GOERLI]: new GraphQLClient(V3_SUBGRAPHS[ChainId.GOERLI], { fetch }),
  [ChainId.DNERO]: new GraphQLClient(V3_SUBGRAPHS[ChainId.DNERO], { fetch }),
  [ChainId.DNERO_TESTNET]: new GraphQLClient(V3_SUBGRAPHS[ChainId.DNERO_TESTNET], { fetch }),
  [ChainId.ARBITRUM_ONE]: new GraphQLClient(V3_SUBGRAPHS[ChainId.ARBITRUM_ONE], { fetch }),
  [ChainId.LINEA]: new GraphQLClient(V3_SUBGRAPHS[ChainId.LINEA], { fetch }),
  [ChainId.SCROLL_SEPOLIA]: new GraphQLClient(V3_SUBGRAPHS[ChainId.SCROLL_SEPOLIA], { fetch }),
  [ChainId.BASE_TESTNET]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BASE_TESTNET], { fetch }),
  [ChainId.BASE]: new GraphQLClient(V3_SUBGRAPHS[ChainId.BASE], { fetch }),
  [ChainId.OPDNERO]: new GraphQLClient(V3_SUBGRAPHS[ChainId.OPDNERO], { fetch }),
} as const

export const v3SubgraphProvider: SubgraphProvider = ({ chainId = ChainId.DNERO }: { chainId?: ChainId }) => {
  return v3SubgraphClients[chainId as SupportedChainId] || v3SubgraphClients[ChainId.DNERO]
}
