import { useMemo } from 'react'
import { Currency } from '@dneroswap/sdk'
import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'
import { useTotalStakedInUsd } from 'views/PositionManagers/hooks/useTotalStakedInUsd'
import { YEAR_IN_SECONDS } from '@dneroswap/utils/getTimePeriods'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'

interface AprProps {
  currencyA: Currency
  currencyB: Currency
  rewardPerSecond: string
  avgToken0Amount: number
  avgToken1Amount: number
  poolToken0Amount?: bigint
  poolToken1Amount?: bigint
  token0PriceUSD?: number
  token1PriceUSD?: number
  earningToken: Currency
  rewardEndTime: number
  rewardStartTime: number
}

export interface AprResult {
  combinedApr: string
  lpApr: string
  cakeYieldApr: string
  isInWDneroRewardDateRange: boolean
}

const ONE_YEAR = 365

export const useApr = ({
  currencyA,
  currencyB,
  rewardPerSecond,
  poolToken0Amount,
  poolToken1Amount,
  token0PriceUSD,
  token1PriceUSD,
  avgToken0Amount,
  avgToken1Amount,
  earningToken,
  rewardEndTime,
  rewardStartTime,
}: AprProps): AprResult => {
  const wdneroPriceBusd = useWDneroPrice()

  const isInWDneroRewardDateRange = useMemo(
    () => Date.now() / 1000 < rewardEndTime && Date.now() / 1000 >= rewardStartTime,
    [rewardEndTime, rewardStartTime],
  )

  const totalStakedInUsd = useTotalStakedInUsd({
    currencyA,
    currencyB,
    poolToken0Amount,
    poolToken1Amount,
    token0PriceUSD,
    token1PriceUSD,
  })

  const totalLpApr = useMemo(() => {
    const totalToken0Usd = getBalanceAmount(new BigNumber(avgToken0Amount), currencyA.decimals).times(
      token0PriceUSD ?? 0,
    )
    const totalToken1Usd = getBalanceAmount(new BigNumber(avgToken1Amount), currencyB.decimals).times(
      token1PriceUSD ?? 0,
    )

    const totalAvgStakedInUsd = totalToken0Usd.plus(totalToken1Usd)

    return totalAvgStakedInUsd.times(ONE_YEAR).div(totalStakedInUsd).times(100)
  }, [avgToken0Amount, avgToken1Amount, currencyA, currencyB, token0PriceUSD, token1PriceUSD, totalStakedInUsd])

  const cakeYieldApr = useMemo(() => {
    if (!isInWDneroRewardDateRange) {
      return BIG_ZERO
    }

    return getBalanceAmount(new BigNumber(rewardPerSecond), earningToken.decimals)
      .times(YEAR_IN_SECONDS)
      .times(wdneroPriceBusd)
      .div(totalStakedInUsd)
      .times(100)
  }, [isInWDneroRewardDateRange, earningToken, rewardPerSecond, wdneroPriceBusd, totalStakedInUsd])

  const totalApr = useMemo(() => cakeYieldApr.plus(totalLpApr), [cakeYieldApr, totalLpApr])

  const aprData = useMemo(() => {
    return {
      combinedApr: !totalApr.isNaN() ? totalApr.toFixed(2) ?? '-' : '',
      lpApr: !totalLpApr.isNaN() ? totalLpApr.toFixed(2) ?? '-' : '',
      cakeYieldApr: !cakeYieldApr.isNaN() ? cakeYieldApr.toFixed(2) ?? '-' : '',
      isInWDneroRewardDateRange,
    }
  }, [totalApr, totalLpApr, cakeYieldApr, isInWDneroRewardDateRange])

  return aprData
}
