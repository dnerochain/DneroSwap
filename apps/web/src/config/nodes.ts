import { ChainId } from '@dneroswap/chains'
import { getNodeRealUrl } from 'utils/node/nodeReal'
import { getGroveUrl } from 'utils/node/pokt'
import {
  arbitrum,
  arbitrumGoerli,
  base,
  baseGoerli,
  linea,
  opDNERO,
  opDNEROTestnet,
  polygonZkEvm,
  polygonZkEvmTestnet,
  scrollSepolia,
  zkSync,
  zkSyncTestnet,
} from 'wagmi/chains'

const ARBITRUM_NODES = [
  ...arbitrum.rpcUrls.public.http,
  'https://arbitrum-one.publicnode.com',
  'https://arbitrum.llamarpc.com',
].filter(Boolean)

export const SERVER_NODES = {
  [ChainId.DNERO]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
    getGroveUrl(ChainId.DNERO, process.env.NEXT_PUBLIC_GROVE_API_KEY) || '',
    'https://dnero.publicnode.com',
    'https://binance.llamarpc.com',
    'https://dnero-dataseed1.defibit.io',
    'https://dnero-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.DNERO_TESTNET]: ['https://data-seed-prednero-1-s1.binance.org:8545'],
  [ChainId.ETHEREUM]: [
    getNodeRealUrl(ChainId.ETHEREUM, process.env.SERVER_NODE_REAL_API_ETH) || '',
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ],
  [ChainId.GOERLI]: [
    getNodeRealUrl(ChainId.GOERLI, process.env.SERVER_NODE_REAL_API_GOERLI) || '',
    'https://eth-goerli.public.blastapi.io',
  ].filter(Boolean),
  [ChainId.ARBITRUM_ONE]: ARBITRUM_NODES,
  [ChainId.ARBITRUM_GOERLI]: arbitrumGoerli.rpcUrls.public.http,
  [ChainId.POLYGON_ZKEVM]: [
    'https://f2562de09abc5efbd21eefa083ff5326.zkevm-rpc.com/',
    process.env.NEXT_PUBLIC_NODIES_POLYGON_ZKEVM || '',
    ...polygonZkEvm.rpcUrls.public.http,
  ].filter(Boolean),
  [ChainId.POLYGON_ZKEVM_TESTNET]: [
    'https://polygon-zkevm-testnet.rpc.thirdweb.com',
    ...polygonZkEvmTestnet.rpcUrls.public.http,
  ],
  [ChainId.ZKSYNC]: [
    ...zkSync.rpcUrls.public.http,
    getNodeRealUrl(ChainId.ZKSYNC, process.env.SERVER_NODE_REAL_API_ETH) || '',
  ],
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnet.rpcUrls.public.http,
  [ChainId.LINEA]: linea.rpcUrls.public.http,
  [ChainId.LINEA_TESTNET]: [
    'https://rpc.goerli.linea.build',
    'https://linea-testnet.rpc.thirdweb.com',
    'https://consensys-zkevm-goerli-prealpha.infura.io/v3/93e8a17747e34ec0ac9a554c1b403965',
  ],
  [ChainId.OPDNERO_TESTNET]: opDNEROTestnet.rpcUrls.public.http,
  [ChainId.OPDNERO]: [
    ...opDNERO.rpcUrls.public.http,
    getNodeRealUrl(ChainId.OPDNERO, process.env.SERVER_NODE_REAL_API_ETH) || '',
  ],
  [ChainId.BASE]: [
    'https://base.publicnode.com',
    // process.env.NEXT_PUBLIC_NODE_REAL_BASE_PRODUCTION,
    ...base.rpcUrls.public.http,
  ],
  [ChainId.BASE_TESTNET]: baseGoerli.rpcUrls.public.http,
  [ChainId.SCROLL_SEPOLIA]: scrollSepolia.rpcUrls.public.http,
} satisfies Record<ChainId, readonly string[]>

export const PUBLIC_NODES = {
  [ChainId.DNERO]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
    getNodeRealUrl(ChainId.DNERO, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    process.env.NEXT_PUBLIC_NODIES_DNERO || '',
    getGroveUrl(ChainId.DNERO, process.env.NEXT_PUBLIC_GROVE_API_KEY) || '',
    'https://dnero.publicnode.com',
    'https://binance.llamarpc.com',
    'https://dnero-dataseed1.defibit.io',
    'https://dnero-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.DNERO_TESTNET]: ['https://data-seed-prednero-1-s1.binance.org:8545'],
  [ChainId.ETHEREUM]: [
    getNodeRealUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    process.env.NEXT_PUBLIC_NODIES_ETH || '',
    getGroveUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_GROVE_API_KEY) || '',
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ].filter(Boolean),
  [ChainId.GOERLI]: [
    getNodeRealUrl(ChainId.GOERLI, process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) || '',
    'https://eth-goerli.public.blastapi.io',
  ].filter(Boolean),
  [ChainId.ARBITRUM_ONE]: [
    ...ARBITRUM_NODES,
    process.env.NEXT_PUBLIC_NODIES_ARB || '',
    getNodeRealUrl(ChainId.ARBITRUM_ONE, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    getGroveUrl(ChainId.ARBITRUM_ONE, process.env.NEXT_PUBLIC_GROVE_API_KEY) || '',
  ].filter(Boolean),
  [ChainId.ARBITRUM_GOERLI]: arbitrumGoerli.rpcUrls.public.http,
  [ChainId.POLYGON_ZKEVM]: [
    process.env.NEXT_PUBLIC_NODIES_POLYGON_ZKEVM || '',
    ...polygonZkEvm.rpcUrls.public.http,
    'https://f2562de09abc5efbd21eefa083ff5326.zkevm-rpc.com/',
    getGroveUrl(ChainId.POLYGON_ZKEVM, process.env.NEXT_PUBLIC_GROVE_API_KEY) || '',
  ].filter(Boolean),
  [ChainId.POLYGON_ZKEVM_TESTNET]: [
    ...polygonZkEvmTestnet.rpcUrls.public.http,
    'https://polygon-zkevm-testnet.rpc.thirdweb.com',
  ],
  [ChainId.ZKSYNC]: [
    ...zkSync.rpcUrls.public.http,
    getNodeRealUrl(ChainId.ZKSYNC, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
  ],
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnet.rpcUrls.public.http,
  [ChainId.LINEA]: linea.rpcUrls.public.http,
  [ChainId.LINEA_TESTNET]: [
    'https://rpc.goerli.linea.build',
    'https://linea-testnet.rpc.thirdweb.com',
    'https://consensys-zkevm-goerli-prealpha.infura.io/v3/93e8a17747e34ec0ac9a554c1b403965',
  ],
  [ChainId.OPDNERO_TESTNET]: opDNEROTestnet.rpcUrls.public.http,
  [ChainId.OPDNERO]: [
    ...opDNERO.rpcUrls.public.http,
    getNodeRealUrl(ChainId.OPDNERO, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    'https://opdnero.publicnode.com',
  ],
  [ChainId.BASE]: [
    'https://base.publicnode.com',
    process.env.NEXT_PUBLIC_NODIES_BASE || '',
    getGroveUrl(ChainId.BASE, process.env.NEXT_PUBLIC_GROVE_API_KEY) || '',
    // process.env.NEXT_PUBLIC_NODE_REAL_BASE_PRODUCTION,
    ...base.rpcUrls.public.http,
  ].filter(Boolean),
  [ChainId.BASE_TESTNET]: baseGoerli.rpcUrls.public.http,
  [ChainId.SCROLL_SEPOLIA]: scrollSepolia.rpcUrls.public.http,
} satisfies Record<ChainId, readonly string[]>
