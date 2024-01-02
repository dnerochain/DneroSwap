import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'

interface UseRewardInUSDProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  canClaim: string
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInUSD = ({
  timeRemaining,
  totalEstimateRewardUSD,
  canClaim,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInUSDProps) => {
  const rewardWDneroUSDPriceAsBg = getBalanceAmount(new BigNumber(rewardPrice), rewardTokenDecimal)
  const rewardWDneroAmount = getBalanceAmount(new BigNumber(canClaim), rewardTokenDecimal)

  return timeRemaining > 0
    ? totalEstimateRewardUSD || 0
    : rewardWDneroAmount.times(rewardWDneroUSDPriceAsBg).toNumber() || 0
}

export default useRewardInUSD
