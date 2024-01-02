import { useState, useCallback, useMemo, useEffect } from 'react'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { getFullDisplayBalance } from '@dneroswap/utils/formatBalance'
import { useAppDispatch } from 'state'
import { updateUserBalance } from 'state/pools'
import { Native } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { WDNERO } from '@dneroswap/tokens'
import tryParseAmount from '@dneroswap/utils/tryParseAmount'
import { useTradeExactOut } from 'hooks/Trades'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import BigNumber from 'bignumber.js'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

export const useWDneroEnable = (enableAmount: BigNumber) => {
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()
  const [pendingEnableTx, setPendingEnableTx] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>()
  const isTransactionPending = useIsTransactionPending(transactionHash)
  const swapAmount = useMemo(() => getFullDisplayBalance(enableAmount), [enableAmount])

  const parsedAmount = tryParseAmount(swapAmount, WDNERO[chainId])

  const trade = useTradeExactOut(Native.onChain(ChainId.DNERO), parsedAmount)

  const swapCalls = useSwapCallArguments(trade, INITIAL_ALLOWED_SLIPPAGE, null)

  const { callback: swapCallback } = useSwapCallback(trade, INITIAL_ALLOWED_SLIPPAGE, null, swapCalls)

  useEffect(() => {
    if (pendingEnableTx && transactionHash && !isTransactionPending) {
      dispatch(updateUserBalance({ sousId: 0, account, chainId }))
      setPendingEnableTx(isTransactionPending)
    }
  }, [account, dispatch, transactionHash, pendingEnableTx, isTransactionPending, chainId])

  const handleEnable = useCallback(() => {
    if (!swapCallback) {
      return
    }
    setPendingEnableTx(true)
    swapCallback()
      .then((hash) => {
        setTransactionHash(hash)
      })
      .catch(() => {
        setPendingEnableTx(false)
      })
  }, [swapCallback])

  return { handleEnable, pendingEnableTx }
}
