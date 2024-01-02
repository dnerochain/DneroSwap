import { defineFarmV3Configs } from '@dneroswap/farms/src/defineFarmV3Configs'
import { dneroTokens } from '@dneroswap/tokens'
import { FeeAmount } from '@dneroswap/v3-sdk'

export const tradingRewardV3Pair = defineFarmV3Configs([
  {
    pid: null,
    lpAddress: '0x172fcD41E0913e95784454622d1c3724f546f849',
    token0: dneroTokens.usdt,
    token1: dneroTokens.wdtoken,
    feeAmount: FeeAmount.LOWEST,
  },
])
