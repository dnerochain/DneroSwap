import { ChainId } from '@dneroswap/chains'
import { ERC20Token, WDTOKEN } from '@dneroswap/sdk'

import { WDNERO, USDT } from './common'

export const opDneroTokens = {
  wdtoken: WDTOKEN[ChainId.OPDNERO],
  usdt: USDT[ChainId.OPDNERO],
  wdnero: WDNERO[ChainId.OPDNERO],
  alp: new ERC20Token(
    ChainId.OPDNERO,
    '0xC8424F526553ac394E9020DB0a878fAbe82b698C',
    18,
    'ALP',
    'ApolloX LP',
    'https://www.apollox.finance/en',
  ),
}
