import { ChainId } from '@dneroswap/chains'
import { Chain, createPublicClient, http, PublicClient } from 'viem'
import {
  arbitrum,
  dnero,
  dneroTestnet,
  goerli,
  mainnet,
  opDNERO,
  opDNEROTestnet,
  polygonZkEvm,
  zkSync,
  zkSyncTestnet,
} from 'viem/chains'

const requireCheck = [
  ETH_NODE,
  GOERLI_NODE,
  DNERO_NODE,
  DNERO_TESTNET_NODE,
  POLYGON_ZKEVM_NODE,
  ZKSYNC_NODE,
  ARBITRUM_ONE_NODE,
  LINEA_NODE,
  BASE_NODE,
  OPDNERO_NODE,
  OPDNERO_TESTNET_NODE,
]

const base = {
  id: 8453,
  network: 'base',
  name: 'Base',
  nativeCurrency: {
    name: 'Base',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    blockscout: {
      name: 'Basescout',
      url: 'https://base.blockscout.com',
    },
    default: {
      name: 'Basescan',
      url: 'https://basescan.org',
    },
    etherscan: {
      name: 'Basescan',
      url: 'https://basescan.org',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 5022,
    },
  },
} as const

const linea = {
  id: 59_144,
  name: 'Linea Mainnet',
  network: 'linea-mainnet',
  nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    infura: {
      http: ['https://linea-mainnet.infura.io/v3'],
      webSocket: ['wss://linea-mainnet.infura.io/ws/v3'],
    },
    default: {
      http: ['https://rpc.linea.build'],
      webSocket: ['wss://rpc.linea.build'],
    },
    public: {
      http: ['https://rpc.linea.build'],
      webSocket: ['wss://rpc.linea.build'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
    etherscan: {
      name: 'Etherscan',
      url: 'https://lineascan.build',
    },
    blockscout: {
      name: 'Blockscout',
      url: 'https://explorer.linea.build',
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 42,
    },
  },
  testnet: false,
} as const

requireCheck.forEach((node) => {
  if (!node) {
    throw new Error('Missing env var')
  }
})

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http(ETH_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

export const dneroClient: PublicClient = createPublicClient({
  chain: dnero,
  transport: http(DNERO_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

export const dneroTestnetClient: PublicClient = createPublicClient({
  chain: dneroTestnet,
  transport: http(DNERO_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const goerliClient = createPublicClient({
  chain: goerli,
  transport: http(GOERLI_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const zksyncTestnetClient = createPublicClient({
  chain: zkSyncTestnet as Chain,
  transport: http(),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const polygonZkEvmClient = createPublicClient({
  chain: {
    ...polygonZkEvm,
    contracts: {
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 57746,
      },
    },
  },
  transport: http(POLYGON_ZKEVM_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const zksyncClient = createPublicClient({
  chain: zkSync as Chain,
  transport: http(ZKSYNC_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const arbitrumOneClient = createPublicClient({
  chain: arbitrum,
  transport: http(ARBITRUM_ONE_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const lineaClient = createPublicClient({
  chain: linea,
  transport: http(LINEA_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const baseClient = createPublicClient({
  chain: base,
  transport: http(BASE_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
  pollingInterval: 6_000,
})

const opDNEROClient = createPublicClient({
  chain: opDNERO,
  transport: http(OPDNERO_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
})

const opDNEROTestnetClient = createPublicClient({
  chain: opDNEROTestnet,
  transport: http(OPDNERO_TESTNET_NODE),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
      wait: 16,
    },
  },
})

export const viemProviders = ({ chainId }: { chainId?: ChainId }): PublicClient => {
  switch (chainId) {
    case ChainId.ETHEREUM:
      return mainnetClient
    case ChainId.DNERO:
      return dneroClient
    case ChainId.DNERO_TESTNET:
      return dneroTestnetClient
    case ChainId.GOERLI:
      return goerliClient
    case ChainId.ZKSYNC_TESTNET:
      return zksyncTestnetClient
    case ChainId.POLYGON_ZKEVM:
      return polygonZkEvmClient
    case ChainId.ZKSYNC:
      return zksyncClient
    case ChainId.ARBITRUM_ONE:
      return arbitrumOneClient
    case ChainId.LINEA:
      return lineaClient
    case ChainId.BASE:
      return baseClient
    case ChainId.OPDNERO:
      return opDNEROClient
    case ChainId.OPDNERO_TESTNET:
      return opDNEROTestnetClient
    default:
      return dneroClient
  }
}
