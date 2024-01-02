import { Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { dneroTokens, ethereumTokens } from '@dneroswap/tokens'
import { dneroWarningTokens } from 'config/constants/warningTokens'

const { alETH } = ethereumTokens
const { bondly, itam, ccar, bttold, adtokenc, metis } = dneroTokens
const { pokemoney, free, safemoon, gala, xcad, lusd } = dneroWarningTokens

interface WarningTokenList {
  [chainId: number]: {
    [key: string]: Token
  }
}

const SwapWarningTokens = <WarningTokenList>{
  [ChainId.ETHEREUM]: {
    alETH,
  },
  [ChainId.DNERO]: {
    safemoon,
    bondly,
    itam,
    ccar,
    bttold,
    pokemoney,
    free,
    gala,
    adtokenc,
    xcad,
    metis,
    lusd,
  },
}

export default SwapWarningTokens
