import BN from 'bignumber.js'
import { parseNumberToFraction, formatFraction } from '@dneroswap/utils/formatFractions'
import { BigintIsh, ZERO } from '@dneroswap/sdk'

type BigNumberish = BN | number | string

interface FarmAprParams {
  poolWeight: BigNumberish
  // Total tvl staked in farm in usd
  tvlUsd: BigNumberish
  wdneroPriceUsd: BigNumberish
  wdneroPerSecond: BigNumberish

  precision?: number
}

const SECONDS_FOR_YEAR = 365 * 60 * 60 * 24

const isValid = (num: BigNumberish) => {
  const bigNumber = new BN(num)
  return bigNumber.isFinite() && bigNumber.isPositive()
}

const formatNumber = (bn: BN, precision: number) => {
  return formatFraction(parseNumberToFraction(bn.toNumber(), precision), precision)
}

export function getFarmApr({ poolWeight, tvlUsd, wdneroPriceUsd, wdneroPerSecond, precision = 6 }: FarmAprParams) {
  if (!isValid(poolWeight) || !isValid(tvlUsd) || !isValid(wdneroPriceUsd) || !isValid(wdneroPerSecond)) {
    return '0'
  }

  const wdneroRewardPerYear = new BN(wdneroPerSecond).times(SECONDS_FOR_YEAR)
  const farmApr = new BN(poolWeight).times(wdneroRewardPerYear).times(wdneroPriceUsd).div(tvlUsd).times(100)

  if (farmApr.isZero()) {
    return '0'
  }

  return formatNumber(farmApr, precision)
}

export interface PositionFarmAprParams extends Omit<FarmAprParams, 'tvlUsd'> {
  // Position liquidity
  liquidity: BigintIsh

  // Total staked liquidity in farm
  totalStakedLiquidity: BigintIsh

  // Position tvl in usd
  positionTvlUsd: BigNumberish
}

export function getPositionFarmApr({
  poolWeight,
  positionTvlUsd,
  wdneroPriceUsd,
  wdneroPerSecond,
  liquidity,
  totalStakedLiquidity,
  precision = 6,
}: PositionFarmAprParams) {
  const aprFactor = getPositionFarmAprFactor({
    poolWeight,
    wdneroPriceUsd,
    wdneroPerSecond,
    liquidity,
    totalStakedLiquidity,
  })
  if (!isValid(aprFactor) || !isValid(positionTvlUsd)) {
    return '0'
  }

  const positionApr = aprFactor.times(liquidity.toString()).div(positionTvlUsd)

  return formatNumber(positionApr, precision)
}

export function getPositionFarmAprFactor({
  poolWeight,
  wdneroPriceUsd,
  wdneroPerSecond,
  liquidity,
  totalStakedLiquidity,
}: Omit<PositionFarmAprParams, 'positionTvlUsd' | 'precision'>) {
  if (
    !isValid(poolWeight) ||
    !isValid(wdneroPriceUsd) ||
    !isValid(wdneroPerSecond) ||
    BigInt(liquidity) === ZERO ||
    BigInt(totalStakedLiquidity) === ZERO
  ) {
    return new BN(0)
  }

  const wdneroRewardPerYear = new BN(wdneroPerSecond).times(SECONDS_FOR_YEAR)
  const aprFactor = new BN(poolWeight)
    .times(wdneroRewardPerYear)
    .times(wdneroPriceUsd)
    .div((BigInt(liquidity) + BigInt(totalStakedLiquidity)).toString())
    .times(100)

  return aprFactor
}
