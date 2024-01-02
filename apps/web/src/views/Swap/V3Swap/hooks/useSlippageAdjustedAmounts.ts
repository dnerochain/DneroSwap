import { TradeType } from '@dneroswap/sdk'
import { SmartRouterTrade } from '@dneroswap/smart-router/evm'
import { useMemo } from 'react'
import { useUserSlippage } from '@dneroswap/utils/user'
import { computeSlippageAdjustedAmounts } from '../utils/exchange'

export function useSlippageAdjustedAmounts(trade?: SmartRouterTrade<TradeType>) {
  const [allowedSlippage] = useUserSlippage()
  return useMemo(() => computeSlippageAdjustedAmounts(trade, allowedSlippage), [allowedSlippage, trade])
}
