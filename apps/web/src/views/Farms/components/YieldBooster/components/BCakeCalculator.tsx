import { useTranslation } from '@dneroswap/localization'
import {
  BalanceInput,
  Box,
  Button,
  Flex,
  HelpIcon,
  Text,
  Toggle,
  useTooltip,
  useRoiCalculatorReducer,
  CalculatorMode,
  EditingCurrency,
} from '@dneroswap/uikit'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { styled, useTheme } from 'styled-components'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { useBWDneroTooltipContent } from 'views/Farms/components/YieldBooster/components/bWDneroV3/BWDneroBoosterCard'
import { useUserLockedWDneroStatus } from 'views/Farms/hooks/useUserLockedWDneroStatus'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import { useGetCalculatorMultiplier } from '../hooks/useGetBoostedAPR'
import LockDurationField from './BWDneroLockedDuration'

const BWDneroBlock = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
  padding: 16px;
  box-sizing: border-box;
  border-radius: 16px;
`
interface BWDneroCalculatorProps {
  targetInputBalance: string
  earningTokenPrice: number
  lpTokenStakedAmount: BigNumber
  initialState?: any
  stakingTokenSymbol?: string
  setBWDneroMultiplier: (multiplier: number) => void
}

const BWDneroCalculator: React.FC<React.PropsWithChildren<BWDneroCalculatorProps>> = ({
  targetInputBalance,
  earningTokenPrice,
  initialState,
  stakingTokenSymbol = 'WDNERO',
  lpTokenStakedAmount,
  setBWDneroMultiplier,
}) => {
  const [isShow, setIsShow] = useState(true)
  const { t } = useTranslation()
  const [duration, setDuration] = useState(() => weeksToSeconds(1))
  const { isLoading, lockedAmount, lockedStart, lockedEnd } = useUserLockedWDneroStatus()
  const { state, setPrincipalFromUSDValue, setPrincipalFromTokenValue, toggleEditingCurrency, setCalculatorMode } =
    useRoiCalculatorReducer(
      { stakingTokenPrice: earningTokenPrice, earningTokenPrice, autoCompoundFrequency: 0 },
      initialState,
    )
  const { editingCurrency } = state.controls
  const { principalAsUSD, principalAsToken } = state.data
  const onBalanceFocus = () => {
    setCalculatorMode(CalculatorMode.ROI_BASED_ON_PRINCIPAL)
  }
  const userBalanceInFarm = useMemo(
    () => new BigNumber(targetInputBalance).multipliedBy(DEFAULT_TOKEN_DECIMAL),
    [targetInputBalance],
  )
  const userLockedAmount = useMemo(
    () => new BigNumber(principalAsToken).multipliedBy(DEFAULT_TOKEN_DECIMAL),
    [principalAsToken],
  )

  const bWDneroMultiplier = useGetCalculatorMultiplier(userBalanceInFarm, lpTokenStakedAmount, userLockedAmount, duration)

  useEffect(() => {
    setBWDneroMultiplier(bWDneroMultiplier)
  }, [bWDneroMultiplier, setBWDneroMultiplier])

  const editingUnit = editingCurrency === EditingCurrency.TOKEN ? stakingTokenSymbol : 'USD'
  const editingValue = editingCurrency === EditingCurrency.TOKEN ? principalAsToken : principalAsUSD
  const conversionUnit = editingCurrency === EditingCurrency.TOKEN ? 'USD' : stakingTokenSymbol
  const conversionValue = editingCurrency === EditingCurrency.TOKEN ? principalAsUSD : principalAsToken
  const onUserInput = editingCurrency === EditingCurrency.TOKEN ? setPrincipalFromTokenValue : setPrincipalFromUSDValue

  const { address: account } = useAccount()

  const tooltipContent = useBWDneroTooltipContent()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'bottom-start',
  })

  const {
    targetRef: myBalanceTargetRef,
    tooltip: myBalanceTooltip,
    tooltipVisible: myBalanceTooltipVisible,
  } = useTooltip(t('Boost multiplier calculation does not include profit from WDNERO staking pool'), {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })
  const theme = useTheme()

  return (
    <>
      <Text color="secondary" bold fontSize="12px" textTransform="uppercase" mt="24px" mb="8px">
        {t('Yield Booster')}
      </Text>

      <Toggle scale="md" checked={isShow} onClick={() => setIsShow(!isShow)} />
      {isShow && (
        <>
          <BWDneroBlock style={{ marginTop: 24 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              {t('WDnero locked')}
            </Text>
            <BalanceInput
              inputProps={{
                scale: 'sm',
              }}
              currencyValue={`${conversionValue} ${conversionUnit}`}
              // innerRef={balanceInputRef}
              placeholder="0.00"
              value={editingValue}
              unit={editingUnit}
              onUserInput={onUserInput}
              switchEditingUnits={toggleEditingCurrency}
              onFocus={onBalanceFocus}
            />
            <Flex justifyContent="space-between" mt="8px">
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('100')}
              >
                $100
              </Button>
              <Button
                scale="xs"
                p="4px 16px"
                width="68px"
                variant="tertiary"
                onClick={() => setPrincipalFromUSDValue('1000')}
              >
                $1000
              </Button>
              <Button
                disabled={!account || isLoading || lockedAmount.eq(0)}
                scale="xs"
                p="4px 16px"
                width="128px"
                variant="tertiary"
                style={{ textTransform: 'uppercase' }}
                onClick={() =>
                  setPrincipalFromUSDValue(getBalanceNumber(lockedAmount.times(earningTokenPrice)).toFixed(2))
                }
              >
                {t('My Balance')}
              </Button>
              <span ref={myBalanceTargetRef}>
                <HelpIcon width="16px" height="16px" color="textSubtle" />
              </span>
              {myBalanceTooltipVisible && myBalanceTooltip}
            </Flex>
            <LockDurationField
              duration={duration}
              setDuration={setDuration}
              currentDuration={_toNumber(lockedEnd) - _toNumber(lockedStart)}
              isOverMax={false}
            />
          </BWDneroBlock>
          <BWDneroBlock style={{ marginTop: 16 }}>
            <Text color="secondary" bold fontSize="12px" textTransform="uppercase">
              <>{t('Boost Multiplier')}</>
            </Text>
            <Text color="text" bold fontSize="20px" textTransform="uppercase">
              <>{bWDneroMultiplier}X</>
              {tooltipVisible && tooltip}
              <Box ref={targetRef} marginLeft="3px" display="inline-block" position="relative" top="3px">
                <HelpIcon color={theme.colors.textSubtle} />
              </Box>
            </Text>
            <Text color="textSubtle" fontSize={12}>
              {t(
                'The estimated boost multiplier is calculated using live data. The actual boost multiplier may change upon activation.',
              )}
            </Text>
          </BWDneroBlock>
        </>
      )}
    </>
  )
}

export default BWDneroCalculator

export const getBWDneroMultiplier = (
  userBalanceInFarm: BigNumber,
  userLockAmount: BigNumber,
  userLockDuration: number,
  totalLockAmount: BigNumber,
  lpBalanceOfFarm: BigNumber,
  averageLockDuration: number,
  cA: number,
  cB: number,
) => {
  const dB = userBalanceInFarm.times(cA)
  const aBPart1 = lpBalanceOfFarm.times(userLockAmount).times(userLockDuration)
  const aBPart3 = totalLockAmount.times(averageLockDuration)
  const aB = aBPart1.dividedBy(cB).dividedBy(aBPart3)
  const bigNumberResult = dB.plus(aB).gt(userBalanceInFarm)
    ? userBalanceInFarm.dividedBy(dB)
    : dB.plus(aB).dividedBy(dB)
  return bigNumberResult
}
