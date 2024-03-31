import BigNumber from 'bignumber.js'
import { ChainId } from '@dneroswap/chains'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs5647 from 'config/constants/lpAprs/5647.json'
import lpAprs1 from 'config/constants/lpAprs/1.json'

const getLpApr = (chainId?: number) => {
  switch (chainId) {
    case ChainId.DNERO:
      return lpAprs5647
    case ChainId.ETHEREUM:
      return lpAprs1
    default:
      return {}
  }
}

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number | null,
  rewardTokenPrice: number | null,
  totalStaked: number | null,
  tokenPerBlock: number | null,
): number | null => {
  if (stakingTokenPrice === null || rewardTokenPrice === null || totalStaked === null || tokenPerBlock === null) {
    return null
  }

  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

const BIG_NUMBER_NAN = new BigNumber(NaN)

/**
 * Get farm APR value in %
 * @param chainId
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param wdneroPriceUsd WDnero price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @param regularWDneroPerBlock
 * @returns Farm Apr
 */
export const getFarmApr = (
  chainId: number | undefined,
  poolWeight: BigNumber | null | undefined,
  wdneroPriceUsd: BigNumber | null,
  poolLiquidityUsd: BigNumber | null | undefined,
  farmAddress: string | null,
  regularWDneroPerBlock: number,
): { wdneroRewardsApr: number | null; lpRewardsApr: number } => {
  const yearlyWDneroRewardAllocation = poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularWDneroPerBlock)
    : new BigNumber(NaN)
  const wdneroRewardsApr = yearlyWDneroRewardAllocation
    .times(wdneroPriceUsd || BIG_NUMBER_NAN)
    .div(poolLiquidityUsd || BIG_NUMBER_NAN)
    .times(100)
  let wdneroRewardsAprAsNumber: number | null = null
  if (!wdneroRewardsApr.isNaN() && wdneroRewardsApr.isFinite()) {
    wdneroRewardsAprAsNumber = wdneroRewardsApr.toNumber()
  }
  const lpRewardsApr = farmAddress
    ? (getLpApr(chainId)[farmAddress?.toLowerCase()] || getLpApr(chainId)[farmAddress]) ?? 0
    : 0 // can get both checksummed or lowercase
  return { wdneroRewardsApr: wdneroRewardsAprAsNumber, lpRewardsApr }
}

export default null
