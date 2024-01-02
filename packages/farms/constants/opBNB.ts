import { opDneroTokens } from '@dneroswap/tokens'
import { FeeAmount } from '@dneroswap/v3-sdk'

import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0xc4f981189558682F15F60513158B699354B30204',
    token0: opDneroTokens.wdtoken,
    token1: opDneroTokens.usdt,
    feeAmount: FeeAmount.LOW,
  },
])
