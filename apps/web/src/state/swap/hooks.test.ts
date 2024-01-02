/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import { useEffect } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { useAtom } from 'jotai'
import { parse } from 'querystring'
import { Mock, vi } from 'vitest'
import { swapReducerAtom } from 'state/swap/reducer'
import { useCurrency } from 'hooks/Tokens'
import { createReduxWrapper } from 'testUtils'
import { Field, replaceSwapState } from './actions'
import { queryParametersToSwapState, useDerivedSwapInfo, useSwapState } from './hooks'

describe('hooks', () => {
  describe('#queryParametersToSwapState', () => {
    test('DTOKEN to DAI', () => {
      expect(
        queryParametersToSwapState(
          parse(
            'inputCurrency=DTOKEN&outputCurrency=0x6b175474e89094c44da98b954eedeac495271d0f&exactAmount=20.5&exactField=outPUT',
          ),
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: '0x6B175474E89094C44Da98b954EedeAC495271d0F' },
        [Field.INPUT]: { currencyId: 'DTOKEN' },
        typedValue: '20.5',
        independentField: Field.OUTPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('should return Native by default', () => {
      expect(queryParametersToSwapState(parse(''))).toEqual({
        [Field.OUTPUT]: { currencyId: undefined },
        [Field.INPUT]: { currencyId: 'DTOKEN' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('does not duplicate DTOKEN for invalid output token', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=invalid'), 'DTOKEN')).toEqual({
        [Field.INPUT]: { currencyId: '' },
        [Field.OUTPUT]: { currencyId: 'DTOKEN' },
        typedValue: '',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('output DTOKEN only', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=dtoken&exactAmount=20.5'), 'DTOKEN')).toEqual({
        [Field.OUTPUT]: { currencyId: 'DTOKEN' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('invalid recipient', () => {
      expect(queryParametersToSwapState(parse('outputCurrency=DTOKEN&exactAmount=20.5&recipient=abc'), 'DTOKEN')).toEqual({
        [Field.OUTPUT]: { currencyId: 'DTOKEN' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: null,
      })
    })

    test('valid recipient', () => {
      expect(
        queryParametersToSwapState(
          parse('outputCurrency=DTOKEN&exactAmount=20.5&recipient=0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5'),
          'DTOKEN',
        ),
      ).toEqual({
        [Field.OUTPUT]: { currencyId: 'DTOKEN' },
        [Field.INPUT]: { currencyId: '' },
        typedValue: '20.5',
        independentField: Field.INPUT,
        pairDataById: {},
        derivedPairDataById: {},
        recipient: '0x0fF2D1eFd7A57B7562b2bf27F3f37899dB27F4a5',
      })
    })
  })
})

// weird bug on jest Reference Error, must use `var` here
var mockUseActiveWeb3React: Mock

vi.mock('../../hooks/useActiveWeb3React', () => {
  mockUseActiveWeb3React = vi.fn().mockReturnValue({
    chainId: 56,
  })
  return {
    __esModule: true,
    default: mockUseActiveWeb3React,
  }
})

var mockAccount: Mock

vi.mock('wagmi', async () => {
  mockAccount = vi.fn().mockReturnValue({})
  const original = await vi.importActual('wagmi') // Step 2.
  return {
    // @ts-ignore
    ...original,
    useAccount: mockAccount,
  }
})

describe('#useDerivedSwapInfo', () => {
  it('should show Login Error', async () => {
    const { result, rerender } = renderHook(
      () => {
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        return useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
      },
      { wrapper: createReduxWrapper() },
    )
    expect(result.current.inputError).toBe('Connect Wallet')

    mockAccount.mockReturnValue({ address: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    rerender()

    expect(result.current.inputError).toBe('Enter an amount')
    mockAccount.mockClear()
  })

  it('should show [Enter a recipient] Error', async () => {
    mockAccount.mockReturnValue({ address: '0x33edFBc4934baACc78f4d317bc07639119dd3e78' })
    const { result, rerender } = renderHook(
      () => {
        const [, dispatch] = useAtom(swapReducerAtom)
        useEffect(() => {
          dispatch(
            replaceSwapState({
              field: Field.INPUT,
              typedValue: '0.11',
              inputCurrencyId: 'DTOKEN',
              outputCurrencyId: 'DTOKEN',
              recipient: undefined,
            }),
          )
        }, [dispatch])
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        return useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
      },
      {
        wrapper: createReduxWrapper(),
      },
    )

    rerender()
    expect(result.current.inputError).toBe('Enter a recipient')
    mockAccount.mockClear()
  })

  it('should return undefined when no pair', async () => {
    const { result } = renderHook(
      () => {
        const [, dispatch] = useAtom(swapReducerAtom)
        useEffect(() => {
          dispatch(
            replaceSwapState({
              field: Field.INPUT,
              typedValue: '',
              inputCurrencyId: '',
              outputCurrencyId: '',
              recipient: null,
            }),
          )
        }, [dispatch])
        const {
          independentField,
          typedValue,
          recipient,
          [Field.INPUT]: { currencyId: inputCurrencyId },
          [Field.OUTPUT]: { currencyId: outputCurrencyId },
        } = useSwapState()
        const inputCurrency = useCurrency(inputCurrencyId)
        const outputCurrency = useCurrency(outputCurrencyId)
        const swapInfo = useDerivedSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, recipient)
        return {
          swapInfo,
        }
      },
      {
        wrapper: createReduxWrapper(),
      },
    )

    expect(result.current.swapInfo.currencies.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencies.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.INPUT).toBeUndefined()
    expect(result.current.swapInfo.currencyBalances.OUTPUT).toBeUndefined()
    expect(result.current.swapInfo.v2Trade).toBeUndefined()
    expect(result.current.swapInfo.parsedAmount).toBeUndefined()
  })
})
