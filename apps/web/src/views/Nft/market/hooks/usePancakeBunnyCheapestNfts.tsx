import { useAccount } from 'wagmi'
import { NftToken, ApiResponseCollectionTokens } from 'state/nftMarket/types'
import useSWR from 'swr'
import {
  getNftsMarketData,
  getMetadataWithFallback,
  getDneroswapBunniesAttributesField,
  combineApiAndSgResponseToNftToken,
} from 'state/nftMarket/helpers'
import { FAST_INTERVAL } from 'config/constants'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { formatBigInt } from '@dneroswap/utils/formatBalance'
import { dneroswapBunniesAddress } from '../constants'
import { getLowestUpdatedToken } from './useGetLowestPrice'

type WhereClause = Record<string, string | number | boolean | string[]>

const fetchCheapestBunny = async (
  whereClause: WhereClause = {},
  nftMetadata: ApiResponseCollectionTokens,
): Promise<NftToken> => {
  const nftsMarket = await getNftsMarketData(whereClause, 100, 'currentAskPrice', 'asc')

  if (!nftsMarket.length) return null

  const nftsMarketTokenIds = nftsMarket.map((marketData) => marketData.tokenId)
  const lowestPriceUpdatedBunny = await getLowestUpdatedToken(dneroswapBunniesAddress, nftsMarketTokenIds)

  const cheapestBunnyOfAccount = nftsMarket
    .filter((marketData) => marketData.tokenId === lowestPriceUpdatedBunny?.tokenId)
    .map((marketData) => {
      const apiMetadata = getMetadataWithFallback(nftMetadata.data, marketData.otherId)
      const attributes = getDneroswapBunniesAttributesField(marketData.otherId)
      const bunnyToken = combineApiAndSgResponseToNftToken(apiMetadata, marketData, attributes)
      const updatedPrice = formatBigInt(lowestPriceUpdatedBunny.currentAskPrice)
      return {
        ...bunnyToken,
        marketData: { ...bunnyToken.marketData, ...lowestPriceUpdatedBunny, currentAskPrice: updatedPrice },
      }
    })
  return cheapestBunnyOfAccount.length > 0 ? cheapestBunnyOfAccount[0] : null
}

export const useDneroswapBunnyCheapestNft = (bunnyId: string, nftMetadata: ApiResponseCollectionTokens) => {
  const { address: account } = useAccount()
  const { data, status, mutate } = useSWR(
    nftMetadata && bunnyId ? ['cheapestBunny', bunnyId, account] : null,
    async () => {
      const allCheapestBunnyClause = {
        collection: dneroswapBunniesAddress.toLowerCase(),
        otherId: bunnyId,
        isTradable: true,
      }
      if (!account) {
        return fetchCheapestBunny(allCheapestBunnyClause, nftMetadata)
      }

      const cheapestBunnyOtherSellersClause = {
        collection: dneroswapBunniesAddress.toLowerCase(),
        currentSeller_not: account.toLowerCase(),
        otherId: bunnyId,
        isTradable: true,
      }
      const cheapestBunnyOtherSellers = await fetchCheapestBunny(cheapestBunnyOtherSellersClause, nftMetadata)
      return cheapestBunnyOtherSellers ?? fetchCheapestBunny(allCheapestBunnyClause, nftMetadata)
    },
    { refreshInterval: FAST_INTERVAL },
  )

  return {
    data,
    isFetched: ([FetchStatus.Failed, FetchStatus.Fetched] as TFetchStatus[]).includes(status),
    refresh: mutate,
  }
}
