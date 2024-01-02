import { ERC20Token, ChainId } from '@dneroswap/sdk'

export const WDNERO_DTOKEN_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

export const wdneroDTokenLpToken = new ERC20Token(ChainId.DNERO, WDNERO_DTOKEN_LP_MAINNET, 18, 'WDNERO-DTOKEN LP')
