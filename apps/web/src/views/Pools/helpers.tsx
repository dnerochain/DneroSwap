import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { getApy } from '@dneroswap/utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from '@dneroswap/utils/formatBalance'
import memoize from 'lodash/memoize'
import { Token } from '@dneroswap/sdk'
import { Pool } from '@dneroswap/widgets-internal'

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000)

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000)

export const convertSharesToWDnero = (
  shares: BigNumber,
  wdneroPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber,
) => {
  const sharePriceNumber = getBalanceNumber(wdneroPerFullShare, decimals)
  const amountInWDnero = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO)
  const wdneroAsNumberBalance = getBalanceNumber(amountInWDnero, decimals)
  const wdneroAsBigNumber = getDecimalAmount(new BigNumber(wdneroAsNumberBalance), decimals)
  const wdneroAsDisplayBalance = getFullDisplayBalance(amountInWDnero, decimals, decimalsToRound)
  return { wdneroAsNumberBalance, wdneroAsBigNumber, wdneroAsDisplayBalance }
}

export const convertWDneroToShares = (
  wdnero: BigNumber,
  wdneroPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(wdneroPerFullShare, decimals)
  const amountInShares = new BigNumber(wdnero.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0

export const getAprData = (pool: Pool.DeserializedPool<Token>, performanceFee: number) => {
  const { vaultKey, apr } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = vaultKey
    ? vaultPoolConfig[vaultKey].autoCompoundFrequency
    : MANUAL_POOL_AUTO_COMPOUND_FREQUENCY

  if (vaultKey) {
    const autoApr = getApy(apr, autoCompoundFrequency, 365, performanceFee) * 100
    return { apr: autoApr, autoCompoundFrequency }
  }
  return { apr, autoCompoundFrequency }
}

export const getWDneroVaultEarnings = (
  account: string,
  wdneroAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber,
) => {
  const hasAutoEarnings = account && wdneroAtLastUserAction?.gt(0) && userShares?.gt(0)
  const { wdneroAsBigNumber } = convertSharesToWDnero(userShares, pricePerFullShare)
  const autoWDneroProfit = wdneroAsBigNumber.minus(fee || BIG_ZERO).minus(wdneroAtLastUserAction)
  const autoWDneroToDisplay = autoWDneroProfit.gte(0) ? getBalanceNumber(autoWDneroProfit, 18) : 0

  const autoUsdProfit = autoWDneroProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoWDneroToDisplay, autoUsdToDisplay }
}

export const getPoolBlockInfo = memoize(
  (pool: Pool.DeserializedPool<Token>, currentBlock: number) => {
    const { startTimestamp, endTimestamp, isFinished } = pool
    const shouldShowBlockCountdown = Boolean(!isFinished && startTimestamp && endTimestamp)
    const now = Math.floor(Date.now() / 1000)
    const timeUntilStart = Math.max(startTimestamp - now, 0)
    const timeRemaining = Math.max(endTimestamp - now, 0)
    const hasPoolStarted = timeUntilStart <= 0 && timeRemaining > 0
    const timeToDisplay = hasPoolStarted ? timeRemaining : timeUntilStart
    return { shouldShowBlockCountdown, timeUntilStart, timeRemaining, hasPoolStarted, timeToDisplay, currentBlock }
  },
  (pool, currentBlock) => `${pool.startTimestamp}#${pool.endTimestamp}#${pool.isFinished}#${currentBlock}`,
)

export const getIWDneroWeekDisplay = (ceiling: BigNumber) => {
  const weeks = new BigNumber(ceiling).div(60).div(60).div(24).div(7)
  return Math.round(weeks.toNumber())
}
