import { describe, it, expect } from 'vitest'
import { CurrencyAmount, Percent } from '@dneroswap/sdk'
import { dneroTokens } from '@dneroswap/tokens'

import { getSwapOutput, getSwapInput } from './getSwapOutput'

describe('getSwapOutput', () => {
  it('Exact output should match exact input', () => {
    const params = {
      amplifier: 1000,
      balances: [
        CurrencyAmount.fromRawAmount(dneroTokens.usdt, '45783656091242964455008335'),
        CurrencyAmount.fromRawAmount(dneroTokens.busd, '67779343437455288075126268'),
      ],
      outputCurrency: dneroTokens.busd,
      amount: CurrencyAmount.fromRawAmount(dneroTokens.usdt, '2000000000000000000'),
      fee: new Percent('15000000', '10000000000'),
    }
    const exactIn = getSwapOutput(params)
    expect(exactIn.currency).toBe(dneroTokens.busd)
    expect(exactIn.quotient).toEqual(1997834290490693375n)

    const exactOut = getSwapInput({
      ...params,
      outputCurrency: dneroTokens.usdt,
      amount: CurrencyAmount.fromRawAmount(dneroTokens.busd, '1997834290490693375'),
    })
    expect(exactOut.currency).toBe(dneroTokens.usdt)
    expect(exactOut.quotient).toEqual(2000000000000000000n)
  })
})
