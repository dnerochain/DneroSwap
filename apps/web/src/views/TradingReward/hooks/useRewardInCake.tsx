import BigNumber from 'bignumber.js'
import { getBalanceAmount } from '@dneroswap/utils/formatBalance'

interface UseRewardInWDneroProps {
  timeRemaining: number
  totalEstimateRewardUSD: number
  totalReward: string
  wdneroPriceBusd: BigNumber
  rewardPrice: string
  rewardTokenDecimal: number
}

const useRewardInWDnero = ({
  timeRemaining,
  totalEstimateRewardUSD,
  totalReward,
  wdneroPriceBusd,
  rewardPrice,
  rewardTokenDecimal = 18,
}: UseRewardInWDneroProps) => {
  const estimateRewardUSD = new BigNumber(totalEstimateRewardUSD)
  const reward = getBalanceAmount(new BigNumber(totalReward))
  const rewardWDneroPrice = getBalanceAmount(new BigNumber(rewardPrice ?? '0'), rewardTokenDecimal ?? 0)
  const totalWDneroReward = reward.div(rewardWDneroPrice).isNaN() ? 0 : reward.div(rewardWDneroPrice).toNumber()

  return timeRemaining > 0 ? estimateRewardUSD.div(wdneroPriceBusd).toNumber() : totalWDneroReward
}

export default useRewardInWDnero
