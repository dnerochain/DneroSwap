import { useQuery } from '@tanstack/react-query'

export const useWDneroPrice = () => {
  return useQuery(
    ['wdnero-usd-price'],
    async () => {
      const wdnero = await (await fetch('https://farms-api.pancakeswap.com/price/wdnero')).json()
      return wdnero.price as string
    },
    {
      refetchInterval: 1_000 * 10,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
}
