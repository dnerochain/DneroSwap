import { useQuery } from '@tanstack/react-query'
import { useRevenueSharingWDneroPoolContract, useRevenueSharingVeWDneroContract } from './useContract'

const INITIAL_INCENTIVE = 0n

export const useWDneroDistributed = (): bigint => {
  const wdneroPool = useRevenueSharingWDneroPoolContract()
  const veWDnero = useRevenueSharingVeWDneroContract()

  const { data: fromWDneroPool = 0n } = useQuery(
    ['wdneroDistributed/wdneroPool', wdneroPool.address, wdneroPool.chain?.id],
    async () => {
      try {
        const amount = (await wdneroPool.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },
    {
      keepPreviousData: true,
    },
  )
  const { data: fromVeWDnero = 0n } = useQuery(
    ['wdneroDistributed/veWDnero', veWDnero.address, veWDnero.chain?.id],
    async () => {
      try {
        const amount = (await veWDnero.read.totalDistributed()) ?? 0n
        return amount
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },
    {
      keepPreviousData: true,
    },
  )

  return INITIAL_INCENTIVE + fromWDneroPool + fromVeWDnero
}
