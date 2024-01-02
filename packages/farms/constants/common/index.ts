import { ChainId } from '@dneroswap/chains'
import { ERC20Token } from '@dneroswap/sdk'
import {
  arbitrumTokens,
  baseTokens,
  dneroTestnetTokens,
  dneroTokens,
  ethereumTokens,
  goerliTestnetTokens,
  lineaTokens,
  opDneroTokens,
  polygonZkEvmTokens,
  zkSyncTestnetTokens,
  zksyncTokens,
} from '@dneroswap/tokens'
import type { FarmV3SupportedChainId } from '../../src'
import type { CommonPrice } from '../../src/fetchFarmsV3'

export const WDNERO_DTOKEN_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

export type PriceHelper = {
  chain: string
  list: ERC20Token[]
}

export const priceHelperTokens = {
  [ChainId.ETHEREUM]: {
    chain: 'ethereum',
    list: [ethereumTokens.weth, ethereumTokens.usdc, ethereumTokens.usdt],
  },
  [ChainId.DNERO]: {
    chain: 'dnero',
    list: [dneroTokens.wdtoken, dneroTokens.usdt, dneroTokens.busd, dneroTokens.eth],
  },
  [ChainId.POLYGON_ZKEVM]: {
    chain: 'polygon_zkevm',
    list: [polygonZkEvmTokens.weth, polygonZkEvmTokens.usdc, polygonZkEvmTokens.usdt, polygonZkEvmTokens.matic],
  },
  [ChainId.ZKSYNC]: {
    chain: 'zksync',
    list: [zksyncTokens.weth, zksyncTokens.usdc, zksyncTokens.usdt],
  },
  [ChainId.ARBITRUM_ONE]: {
    chain: 'arbitrum',
    list: [arbitrumTokens.weth, arbitrumTokens.usdc, arbitrumTokens.usdt, arbitrumTokens.arb],
  },
  [ChainId.LINEA]: {
    chain: 'linea',
    list: [lineaTokens.weth, lineaTokens.usdc, lineaTokens.usdt, lineaTokens.wbtc, lineaTokens.dai],
  },
  [ChainId.BASE]: {
    chain: 'base',
    list: [baseTokens.weth, baseTokens.usdbc, baseTokens.dai, baseTokens.cbETH, baseTokens.usdc],
  },
  [ChainId.OPDNERO]: {
    chain: 'opdnero',
    list: [opDneroTokens.wdtoken, opDneroTokens.usdt],
  },
} satisfies Record<number, PriceHelper>

// for testing purposes
export const DEFAULT_COMMON_PRICE: Record<FarmV3SupportedChainId, CommonPrice> = {
  [ChainId.ETHEREUM]: {},
  [ChainId.GOERLI]: {
    [goerliTestnetTokens.mockA.address]: '10',
  },
  [ChainId.DNERO]: {},
  [ChainId.DNERO_TESTNET]: {
    [dneroTestnetTokens.mockA.address]: '10',
    [dneroTestnetTokens.usdt.address]: '1',
    [dneroTestnetTokens.busd.address]: '1',
    [dneroTestnetTokens.usdc.address]: '1',
  },
  [ChainId.ZKSYNC_TESTNET]: {
    [zkSyncTestnetTokens.mock.address]: '10',
  },
  [ChainId.POLYGON_ZKEVM]: {},
  [ChainId.ZKSYNC]: {},
  [ChainId.POLYGON_ZKEVM_TESTNET]: {},
  [ChainId.ARBITRUM_ONE]: {},
  [ChainId.LINEA]: {},
  [ChainId.BASE]: {},
  [ChainId.OPDNERO_TESTNET]: {},
  [ChainId.OPDNERO]: {},
}
