import { Currency } from '@dneroswap/aptos-swap-sdk'
import { APTOS_COIN } from '@dneroswap/awgmi'

export function currencyId(currency: Currency): string {
  if (currency?.isNative) return APTOS_COIN
  if (currency?.isToken) return currency.address
  throw new Error('invalid currency')
}

export default currencyId
