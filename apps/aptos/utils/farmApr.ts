import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'
import { BIG_TEN } from '@dneroswap/utils/bigNumber'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param wdneroPriceUsd WDnero price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  wdneroPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  regularWDneroPerSeconds: number,
): { wdneroRewardsApr: number } => {
  const yearlyWDneroRewardAllocation = poolWeight
    ? poolWeight.times(SECONDS_IN_YEAR * regularWDneroPerSeconds)
    : new BigNumber(NaN)
  const wdneroRewardsApr = yearlyWDneroRewardAllocation.times(wdneroPriceUsd).div(poolLiquidityUsd).times(100)
  let wdneroRewardsAprAsNumber: null | number = null
  if (!wdneroRewardsApr.isNaN() && wdneroRewardsApr.isFinite()) {
    wdneroRewardsAprAsNumber = wdneroRewardsApr.div(BIG_TEN.pow(FARM_DEFAULT_DECIMALS)).toNumber()
  }
  return { wdneroRewardsApr: wdneroRewardsAprAsNumber as number }
}

export default null
