import { ERC20Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'

export const dneroWarningTokens = {
  pokemoney: new ERC20Token(ChainId.DNERO, '0x32ff5b4C3B1744F0344D96fA2f87799Ed2805749', 18, 'PMY', 'Pokemoney Coin', ''),
  free: new ERC20Token(
    ChainId.DNERO,
    '0x880BCe9321c79cAc1D290De6d31DDE722C606165',
    8,
    'FREE',
    'Freedom Protocol Token',
    '',
  ),
  safemoon: new ERC20Token(
    ChainId.DNERO,
    '0x8076C74C5e3F5852037F31Ff0093Eeb8c8ADd8D3',
    9,
    'SAFEMOON',
    'Safemoon Token',
    'https://safemoon.net/',
  ),
  gala: new ERC20Token(
    ChainId.DNERO,
    '0x7dDEE176F665cD201F93eEDE625770E2fD911990',
    18,
    'GALA',
    'pTokens GALA',
    'https://games.gala.com/',
  ),
  xcad: new ERC20Token(
    ChainId.DNERO,
    '0x431e0cD023a32532BF3969CddFc002c00E98429d',
    18,
    'XCAD',
    'Chainport.io-Peg XCAD Token',
    'https://xcadnetwork.com/',
  ),
  lusd: new ERC20Token(
    ChainId.DNERO,
    '0x23e8a70534308a4AAF76fb8C32ec13d17a3BD89e',
    18,
    'lUSD',
    'lUSD',
    'https://linear.finance/',
  ),
}
