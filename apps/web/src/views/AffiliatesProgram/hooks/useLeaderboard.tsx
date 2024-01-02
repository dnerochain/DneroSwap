import BigNumber from 'bignumber.js'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { MetricDetail } from 'views/AffiliatesProgram/hooks/useAuthAffiliate'
import { useQuery } from '@tanstack/react-query'

export interface ListType {
  address: string
  nickName: string
  metric: MetricDetail
  wdneroBalance?: string
}

interface Leaderboard {
  isFetching: boolean
  list: ListType[]
}

const useLeaderboard = (): Leaderboard => {
  const wdneroPriceBusd = useWDneroPrice()

  const { data, isLoading } = useQuery(
    ['affiliates-program', 'affiliate-program-leaderboard', wdneroPriceBusd],
    async () => {
      const response = await fetch(`/api/affiliates-program/leader-board`)
      const result = await response.json()
      const list: ListType[] = result.affiliates.map((affiliate) => {
        const wdneroBalance = new BigNumber(affiliate.metric.totalEarnFeeUSD).div(wdneroPriceBusd)
        return {
          ...affiliate,
          wdneroBalance: wdneroBalance.isNaN() ? '0' : wdneroBalance.toString(),
        }
      })
      return list
    },
    {
      enabled: wdneroPriceBusd.gt(0),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  return {
    isFetching: isLoading,
    list: data ?? [],
  }
}

export default useLeaderboard
