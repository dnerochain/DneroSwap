import { gql } from 'graphql-request'
import { useEffect, useState } from 'react'
import { infoClient } from 'utils/graphql'
import { getDeltaTimestamps } from 'utils/getDeltaTimestamps'
import { useBlocksFromTimestamps } from 'views/Info/hooks/useBlocksFromTimestamps'

export interface DTokenPrices {
  current: number
  oneDay: number
  twoDay: number
  week: number
}

const DTOKEN_PRICES = gql`
  query prices($block24: Int!, $block48: Int!, $blockWeek: Int!) {
    current: bundle(id: "1") {
      dtokenPrice
    }
    oneDay: bundle(id: "1", block: { number: $block24 }) {
      dtokenPrice
    }
    twoDay: bundle(id: "1", block: { number: $block48 }) {
      dtokenPrice
    }
    oneWeek: bundle(id: "1", block: { number: $blockWeek }) {
      dtokenPrice
    }
  }
`

interface PricesResponse {
  current: {
    dtokenPrice: string
  }
  oneDay: {
    dtokenPrice: string
  }
  twoDay: {
    dtokenPrice: string
  }
  oneWeek: {
    dtokenPrice: string
  }
}

const fetchDTokenPrices = async (
  block24: number,
  block48: number,
  blockWeek: number,
): Promise<{ dtokenPrices: DTokenPrices | undefined; error: boolean }> => {
  try {
    const data = await infoClient.request<PricesResponse>(DTOKEN_PRICES, {
      block24,
      block48,
      blockWeek,
    })
    return {
      error: false,
      dtokenPrices: {
        current: parseFloat(data.current?.dtokenPrice ?? '0'),
        oneDay: parseFloat(data.oneDay?.dtokenPrice ?? '0'),
        twoDay: parseFloat(data.twoDay?.dtokenPrice ?? '0'),
        week: parseFloat(data.oneWeek?.dtokenPrice ?? '0'),
      },
    }
  } catch (error) {
    console.error('Failed to fetch DTOKEN prices', error)
    return {
      error: true,
      dtokenPrices: undefined,
    }
  }
}

/**
 * Returns DTOKEN prices at current, 24h, 48h, and 7d intervals
 */
export const useDTokenPrices = (): DTokenPrices | undefined => {
  const [prices, setPrices] = useState<DTokenPrices | undefined>()
  const [error, setError] = useState(false)

  const [t24, t48, tWeek] = getDeltaTimestamps()
  const { blocks, error: blockError } = useBlocksFromTimestamps([t24, t48, tWeek])

  useEffect(() => {
    const fetch = async () => {
      const [block24, block48, blockWeek] = blocks
      const { dtokenPrices, error: fetchError } = await fetchDTokenPrices(block24.number, block48.number, blockWeek.number)
      if (fetchError) {
        setError(true)
      } else {
        setPrices(dtokenPrices)
      }
    }
    if (!prices && !error && blocks && !blockError) {
      fetch()
    }
  }, [error, prices, blocks, blockError])

  return prices
}
