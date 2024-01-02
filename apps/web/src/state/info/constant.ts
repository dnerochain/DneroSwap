import {
  BLOCKS_CLIENT,
  BLOCKS_CLIENT_ETH,
  BLOCKS_CLIENT_ZKSYNC,
  BLOCKS_CLIENT_LINEA,
  BLOCKS_CLIENT_BASE,
  BLOCKS_CLIENT_OPDNERO,
} from 'config/constants/endpoints'
import { infoClientETH, infoClient, infoStableSwapClient, v2Clients } from 'utils/graphql'
import { GraphQLClient } from 'graphql-request'

import { ChainId } from '@dneroswap/chains'
import {
  ETH_TOKEN_BLACKLIST,
  PCS_ETH_START,
  PCS_V2_START,
  TOKEN_BLACKLIST,
  DNERO_TOKEN_WHITELIST,
  ETH_TOKEN_WHITELIST,
} from 'config/constants/info'
import { arbitrum, dnero, mainnet, polygonZkEvm, zkSync, linea, base, opDNERO } from 'wagmi/chains'
import mapValues from 'lodash/mapValues'

export type MultiChainName = 'DNERO' | 'ETH' | 'POLYGON_ZKEVM' | 'ZKSYNC' | 'ARB' | 'LINEA' | 'BASE' | 'OPDNERO'

export type MultiChainNameExtend = MultiChainName | 'DNERO_TESTNET' | 'ZKSYNC_TESTNET'

export const multiChainName: Record<number | string, MultiChainNameExtend> = {
  [ChainId.DNERO]: 'DNERO',
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.DNERO_TESTNET]: 'DNERO_TESTNET',
  [ChainId.POLYGON_ZKEVM]: 'POLYGON_ZKEVM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.LINEA]: 'LINEA',
  [ChainId.BASE]: 'BASE',
  [ChainId.OPDNERO]: 'OPDNERO',
}

export const multiChainShortName: Record<number, string> = {
  [ChainId.POLYGON_ZKEVM]: 'zkEVM',
}

export const multiChainQueryMainToken: Record<MultiChainName, string> = {
  DNERO: 'DTOKEN',
  ETH: 'ETH',
  POLYGON_ZKEVM: 'ETH',
  ZKSYNC: 'ETH',
  ARB: 'ARB',
  LINEA: 'ETH',
  BASE: 'ETH',
  OPDNERO: 'DTOKEN',
}

export const multiChainBlocksClient: Record<MultiChainNameExtend, string> = {
  DNERO: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
  DNERO_TESTNET: 'https://api.thegraph.com/subgraphs/name/lengocphuc99/dnero_testnet-blocks',
  POLYGON_ZKEVM: 'https://api.studio.thegraph.com/query/45376/polygon-zkevm-block/version/latest',
  ZKSYNC_TESTNET: 'https://api.studio.thegraph.com/query/45376/blocks-zksync-testnet/version/latest',
  ZKSYNC: BLOCKS_CLIENT_ZKSYNC,
  ARB: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
  LINEA: BLOCKS_CLIENT_LINEA,
  BASE: BLOCKS_CLIENT_BASE,
  OPDNERO: BLOCKS_CLIENT_OPDNERO,
}

export const multiChainStartTime = {
  DNERO: PCS_V2_START,
  ETH: PCS_ETH_START,
  POLYGON_ZKEVM: 1686236845,
  ZKSYNC: 1690462800, // Thu Jul 27 2023 13:00:00 UTC+0000
  ARB: 1686732526,
  LINEA: 1692878400,
  BASE: 1693483200,
  OPDNERO: 1695945600,
}

export const multiChainId: Record<MultiChainName, ChainId> = {
  DNERO: ChainId.DNERO,
  ETH: ChainId.ETHEREUM,
  POLYGON_ZKEVM: ChainId.POLYGON_ZKEVM,
  ZKSYNC: ChainId.ZKSYNC,
  ARB: ChainId.ARBITRUM_ONE,
  LINEA: ChainId.LINEA,
  BASE: ChainId.BASE,
  OPDNERO: ChainId.OPDNERO,
}

export const multiChainPaths = {
  [ChainId.DNERO]: '',
  [ChainId.ETHEREUM]: '/eth',
  [ChainId.POLYGON_ZKEVM]: '/polygon-zkevm',
  [ChainId.ZKSYNC]: '/zksync',
  [ChainId.ARBITRUM_ONE]: '/arb',
  [ChainId.LINEA]: '/linea',
  [ChainId.BASE]: '/base',
  [ChainId.OPDNERO]: '/opdnero',
}

export const multiChainQueryClient = {
  DNERO: infoClient,
  ETH: infoClientETH,
  POLYGON_ZKEVM: v2Clients[ChainId.POLYGON_ZKEVM],
  ZKSYNC: v2Clients[ChainId.ZKSYNC],
  ARB: v2Clients[ChainId.ARBITRUM_ONE],
  LINEA: v2Clients[ChainId.LINEA],
  BASE: v2Clients[ChainId.BASE],
  OPDNERO: v2Clients[ChainId.OPDNERO],
}

export const multiChainScan: Record<MultiChainName, string> = {
  DNERO: dnero.blockExplorers.etherscan.name,
  ETH: mainnet.blockExplorers.etherscan.name,
  POLYGON_ZKEVM: polygonZkEvm.blockExplorers.default.name,
  ZKSYNC: zkSync.blockExplorers.default.name,
  ARB: arbitrum.blockExplorers.default.name,
  LINEA: linea.blockExplorers.default.name,
  BASE: base.blockExplorers.default.name,
  OPDNERO: opDNERO.blockExplorers.default.name,
}

export const multiChainTokenBlackList: Record<MultiChainName, string[]> = mapValues(
  {
    DNERO: TOKEN_BLACKLIST,
    ETH: ETH_TOKEN_BLACKLIST,
    POLYGON_ZKEVM: ['0x'],
    ZKSYNC: ['0x'],
    ARB: ['0x'],
    LINEA: ['0x'],
    BASE: ['0x'],
    OPDNERO: ['0x'],
  },
  (val) => val.map((address) => address.toLowerCase()),
)

export const multiChainTokenWhiteList: Record<MultiChainName, string[]> = mapValues(
  {
    DNERO: DNERO_TOKEN_WHITELIST,
    ETH: ETH_TOKEN_WHITELIST,
    POLYGON_ZKEVM: [],
    ZKSYNC: [],
    ARB: [],
    LINEA: [],
    BASE: [],
    OPDNERO: [],
  },
  (val) => val.map((address) => address.toLowerCase()),
)

export const getMultiChainQueryEndPointWithStableSwap = (chainName: MultiChainNameExtend): GraphQLClient => {
  const isStableSwap = checkIsStableSwap()
  if (isStableSwap) return infoStableSwapClient
  return multiChainQueryClient[chainName]
}

// FIXME: this should be per chain
export const subgraphTokenName = {
  '0x738d96Caf7096659DB4C1aFbf1E1BDFD281f388C': 'Ankr Staked MATIC',
  '0x14016E85a25aeb13065688cAFB43044C2ef86784': 'True USD Old',
}

// FIXME: this should be per chain
export const subgraphTokenSymbol = {
  '0x14016E85a25aeb13065688cAFB43044C2ef86784': 'TUSDOLD',
}

export const checkIsStableSwap = () => window.location.href.includes('stableSwap')

export const ChainLinkSupportChains = [ChainId.DNERO, ChainId.DNERO_TESTNET]
