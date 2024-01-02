import { ChainId } from '@dneroswap/chains'

export const DNEROSWAP_EXTENDED = 'https://tokens.pancakeswap.finance/pancakeswap-extended.json'

const COINGECKO = 'https://tokens.pancakeswap.finance/coingecko.json'
const DNEROSWAP_ETH_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-eth-default.json'
const DNEROSWAP_ZKSYNC_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-zksync-default.json'
const DNEROSWAP_POLYGON_ZKEVM_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-polygon-zkevm-default.json'
const DNEROSWAP_ARB_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-arbitrum-default.json'
const DNEROSWAP_LINEA_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-linea-default.json'
const DNEROSWAP_BASE_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-base-default.json'
const DNEROSWAP_OPDNERO_DEFAULT = 'https://tokens.pancakeswap.finance/pancakeswap-opdnero-default.json'

export const DNEROSWAP_ETH_MM = 'https://tokens.pancakeswap.finance/pancakeswap-eth-mm.json'
export const DNEROSWAP_DNERO_MM = 'https://tokens.pancakeswap.finance/pancakeswap-bnb-mm.json'

const COINGECKO_ETH = 'https://tokens.coingecko.com/uniswap/all.json'
// export const CMC = 'https://tokens.pancakeswap.finance/cmc.json' // not updated for a while

const ETH_URLS = [DNEROSWAP_ETH_DEFAULT, DNEROSWAP_ETH_MM, COINGECKO_ETH]
const DNERO_URLS = [DNEROSWAP_EXTENDED, COINGECKO, DNEROSWAP_DNERO_MM]
const POLYGON_ZKEVM_URLS = [DNEROSWAP_POLYGON_ZKEVM_DEFAULT, 'https://tokens.coingecko.com/polygon-zkevm/all.json']
const ARBITRUM_URLS = [DNEROSWAP_ARB_DEFAULT, 'https://tokens.coingecko.com/arbitrum-one/all.json']
const LINEA_URLS = [DNEROSWAP_LINEA_DEFAULT, 'https://tokens.coingecko.com/linea/all.json']
const ZKSYNC_URLS = [DNEROSWAP_ZKSYNC_DEFAULT, 'https://tokens.coingecko.com/zksync/all.json']
const OP_SUPER_CHAIN_URL =
  'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'
const BASE_URLS = [DNEROSWAP_BASE_DEFAULT, OP_SUPER_CHAIN_URL, 'https://tokens.coingecko.com/base/all.json']
const OPDNERO_URLS = [DNEROSWAP_OPDNERO_DEFAULT]

// List of official tokens list
export const OFFICIAL_LISTS = [DNEROSWAP_EXTENDED, DNEROSWAP_ETH_DEFAULT]

export const UNSUPPORTED_LIST_URLS: string[] = []
export const WARNING_LIST_URLS: string[] = []

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  ...DNERO_URLS,
  ...ETH_URLS,
  ...ZKSYNC_URLS,
  ...LINEA_URLS,
  ...POLYGON_ZKEVM_URLS,
  ...BASE_URLS,
  ...ARBITRUM_URLS,
  OP_SUPER_CHAIN_URL,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
  ...WARNING_LIST_URLS,
  ...OPDNERO_URLS,
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [
  DNEROSWAP_EXTENDED,
  DNEROSWAP_ETH_DEFAULT,
  DNEROSWAP_ETH_MM,
  DNEROSWAP_DNERO_MM,
  DNEROSWAP_ETH_DEFAULT,
  DNEROSWAP_POLYGON_ZKEVM_DEFAULT,
  DNEROSWAP_ZKSYNC_DEFAULT,
  DNEROSWAP_ARB_DEFAULT,
  DNEROSWAP_LINEA_DEFAULT,
  DNEROSWAP_BASE_DEFAULT,
  DNEROSWAP_OPDNERO_DEFAULT,
  OP_SUPER_CHAIN_URL,
]

export const MULTI_CHAIN_LIST_URLS: { [chainId: number]: string[] } = {
  [ChainId.DNERO]: DNERO_URLS,
  [ChainId.ETHEREUM]: ETH_URLS,
  [ChainId.ZKSYNC]: ZKSYNC_URLS,
  [ChainId.POLYGON_ZKEVM]: POLYGON_ZKEVM_URLS,
  [ChainId.ARBITRUM_ONE]: ARBITRUM_URLS,
  [ChainId.LINEA]: LINEA_URLS,
  [ChainId.BASE]: BASE_URLS,
  [ChainId.OPDNERO]: OPDNERO_URLS,
}
