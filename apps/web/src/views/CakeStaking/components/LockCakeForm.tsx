import { ChainId } from '@dneroswap/chains'
import { useTranslation } from '@dneroswap/localization'
import { WDNERO } from '@dneroswap/tokens'
import {
  AutoRow,
  Balance,
  BalanceInput,
  BalanceInputProps,
  Box,
  Button,
  Flex,
  FlexGap,
  Text,
  TokenImage,
} from '@dneroswap/uikit'
import { formatBigInt, getFullDisplayBalance } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useMemo, useState } from 'react'
import { wdneroLockAmountAtom } from 'state/vewdnero/atoms'
import { useDNEROWDneroBalance } from '../hooks/useDNEROWDneroBalance'
import { useWriteApproveAndIncreaseLockAmountCallback } from '../hooks/useContractWrite'
import { LockWDneroDataSet } from './DataSet'

const percentShortcuts = [25, 50, 75]

const WDneroInput: React.FC<{
  value: BalanceInputProps['value']
  onUserInput: BalanceInputProps['onUserInput']
  disabled?: boolean
}> = ({ value, onUserInput, disabled }) => {
  const { t } = useTranslation()
  const cakeUsdPrice = useWDneroPrice()
  const cakeUsdValue = useMemo(() => {
    return cakeUsdPrice && value ? cakeUsdPrice.times(value).toNumber() : 0
  }, [cakeUsdPrice, value])
  const [percent, setPercent] = useState<number | null>(null)
  const _wdneroBalance = useDNEROWDneroBalance()
  const wdneroBalance = BigInt(_wdneroBalance.toString())

  const onInput = useCallback(
    (input: string) => {
      setPercent(null)
      onUserInput(input)
    },
    [onUserInput],
  )

  const handlePercentChange = useCallback(
    (p: number) => {
      if (p > 0) {
        onUserInput(getFullDisplayBalance(new BN(wdneroBalance.toString()).multipliedBy(p).dividedBy(100), 18, 18))
      } else {
        onUserInput('')
      }
      setPercent(p)
    },
    [wdneroBalance, onUserInput, setPercent],
  )

  const balance = (
    <Flex>
      <Text textAlign="left" color="textSubtle" ml="4px" fontSize="12px">
        {t('Balance: %balance%', { balance: formatBigInt(wdneroBalance, 2) })}
      </Text>
    </Flex>
  )

  const usdValue = (
    <Flex>
      <Balance mt={1} fontSize="12px" color="textSubtle" decimals={2} value={cakeUsdValue} unit=" USD" prefix="~" />
    </Flex>
  )

  return (
    <>
      <BalanceInput
        width="100%"
        value={value}
        onUserInput={onInput}
        inputProps={{ style: { textAlign: 'left', height: '20px' }, disabled }}
        currencyValue={usdValue}
        unit={balance}
      />
      {!disabled && balance ? (
        <FlexGap justifyContent="space-between" flexWrap="wrap" gap="4px" width="100%">
          {percentShortcuts.map((p) => {
            return (
              <Button
                key={p}
                style={{ flex: 1 }}
                scale="sm"
                variant={p === percent ? 'primary' : 'tertiary'}
                onClick={() => handlePercentChange(p)}
              >
                {`${p}%`}
              </Button>
            )
          })}
          <Button
            scale="sm"
            style={{ flex: 1 }}
            variant={percent === 100 ? 'primary' : 'tertiary'}
            onClick={() => handlePercentChange(100)}
          >
            {t('Max')}
          </Button>
        </FlexGap>
      ) : null}
    </>
  )
}

export const LockWDneroForm: React.FC<{
  // show input field only
  fieldOnly?: boolean
  disabled?: boolean
}> = ({ fieldOnly, disabled }) => {
  const { t } = useTranslation()
  const [value, onChange] = useAtom(wdneroLockAmountAtom)

  return (
    <AutoRow alignSelf="start" gap="16px">
      <FlexGap gap="8px" alignItems="center" height="40px">
        <Box width={40}>
          <TokenImage
            src={`https://pancakeswap.finance/images/tokens/${WDNERO[ChainId.DNERO].address}.png`}
            height={40}
            width={40}
            title={WDNERO[ChainId.DNERO].symbol}
          />
        </Box>
        <FlexGap gap="4px">
          <Text color="textSubtle" textTransform="uppercase" fontSize={16} bold>
            {t('add')}
          </Text>
          <Text color="secondary" textTransform="uppercase" fontSize={16} bold>
            {t('stake')}
          </Text>
        </FlexGap>
      </FlexGap>
      <WDneroInput value={value} onUserInput={onChange} disabled={disabled} />

      {fieldOnly ? null : (
        <>
          {disabled ? null : <LockWDneroDataSet />}

          <SubmitLockButton />
        </>
      )}
    </AutoRow>
  )
}

const SubmitLockButton = () => {
  const { t } = useTranslation()
  const wdneroLockAmount = useAtomValue(wdneroLockAmountAtom)
  const disabled = useMemo(() => !wdneroLockAmount || wdneroLockAmount === '0', [wdneroLockAmount])
  const increaseLockAmount = useWriteApproveAndIncreaseLockAmountCallback()

  return (
    <Button disabled={disabled} width="100%" onClick={increaseLockAmount}>
      {t('Add WDNERO')}
    </Button>
  )
}
