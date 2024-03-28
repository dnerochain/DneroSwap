import { CurrencyAmount, Native } from '@dneroswap/sdk'
import { maxAmountSpend } from './maxAmountSpend'

describe('maxAmountSpend', () => {
  it('should be undefined if no input', () => {
    expect(maxAmountSpend()).toBeUndefined()
  })

  it('should has value when CurrencyAmount is DTOKEN and CurrencyAmount is higher than min dtoken', () => {
    expect(maxAmountSpend(CurrencyAmount.fromRawAmount(Native.onChain(5647), 100n ** 16n)).quotient > 0n).toBeTruthy()
  })

  it('should be 0 when CurrencyAmount is DTOKEN and CurrencyAmount is low', () => {
    expect(maxAmountSpend(CurrencyAmount.fromRawAmount(Native.onChain(5647), '0')).quotient === 0n).toBeTruthy()
  })
})
