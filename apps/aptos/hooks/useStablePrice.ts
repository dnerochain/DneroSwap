import { Currency, Price, Trade } from '@dneroswap/aptos-swap-sdk'
import { L0_USDC, WDNERO, CE_USDC, WH_USDC } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAllCommonPairs } from 'hooks/Trades'
import tryParseAmount from '@dneroswap/utils/tryParseAmount'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { useWDneroPrice } from './useWDneroPrice'
import useNativeCurrency from './useNativeCurrency'
import { usePairs } from './usePairs'
import getCurrencyPrice from '../utils/getCurrencyPrice'
import { useActiveChainId } from './useNetwork'

/**
 * Returns the price in stable of the input currency
 * @param currency currency to compute the stable price of
 */
export default function useStablePrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId: webChainId } = useActiveWeb3React()

  const chainId = currency?.chainId || webChainId

  const native = useNativeCurrency(chainId)
  const wnative = native.wrapped
  const wrapped = currency?.wrapped
  const defaultStable = useMemo(() => L0_USDC[chainId], [chainId])
  const stableTokens = useMemo(() => [L0_USDC[chainId], WH_USDC[chainId], CE_USDC[chainId]], [chainId])

  const [nativePairInfo, stableNativePairInfo] = usePairs(
    useMemo(
      () => [
        [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
        [chainId ? wnative : undefined, defaultStable],
      ],
      [wnative, defaultStable, chainId, currency, wrapped],
    ),
  )

  const stablePairsInfo = usePairs(
    useMemo(
      () =>
        stableTokens.map((stableToken) => {
          return [stableToken && wrapped?.equals(stableToken) ? undefined : wrapped, stableToken]
        }),
      [stableTokens, wrapped],
    ),
  )

  return useMemo(() => {
    return getCurrencyPrice(
      currency,
      defaultStable,
      wnative,
      stableTokens,
      nativePairInfo,
      stableNativePairInfo,
      stablePairsInfo,
    )
  }, [currency, defaultStable, nativePairInfo, stableNativePairInfo, stablePairsInfo, stableTokens, wnative])
}

export const useStableWDneroAmount = (_amount: number): number | undefined => {
  // const wdneroBusdPrice = useWDneroBusdPrice()
  // if (wdneroBusdPrice) {
  //   return multiplyPriceByAmount(wdneroBusdPrice, amount)
  // }
  return undefined
}

export { useWDneroPrice }

export const usePriceWDneroUsdc = () => {
  const chainId = useActiveChainId()
  const wdneroPrice = useTokenUsdcPrice(WDNERO[chainId])
  return useMemo(() => (wdneroPrice ? new BigNumber(wdneroPrice) : BIG_ZERO), [wdneroPrice])
}

export const useTokenUsdcPrice = (currency?: Currency): BigNumber => {
  const chainId = useActiveChainId()
  const USDC = L0_USDC[currency?.chainId || chainId]

  const allowedPairs = useAllCommonPairs(currency, USDC)
  const tokenInAmount = tryParseAmount('1', currency)

  if (!tokenInAmount || !allowedPairs?.length) {
    return BIG_ZERO
  }

  const trade = Trade.bestTradeExactIn(allowedPairs, tokenInAmount, USDC, { maxHops: 3, maxNumResults: 1 })[0]
  const usdcAmount = trade?.outputAmount?.toSignificant() || '0'

  return new BigNumber(usdcAmount)
}
