import { FetchStatus } from 'config/constants/types'
import { getNftsMarketData, getNftsUpdatedMarketData } from 'state/nftMarket/helpers'
import { formatBigInt } from '@dneroswap/utils/formatBalance'
import { NftToken } from 'state/nftMarket/types'
import { Address } from 'wagmi'
import useSWR from 'swr'
import { safeGetAddress } from 'utils'
import { dneroswapBunniesAddress } from '../constants'

export interface LowestNftPrice {
  isFetching: boolean
  lowestPrice: number
}

const getBunnyIdFromNft = (nft: NftToken): string => {
  const bunnyId = nft.attributes?.find((attr) => attr.traitType === 'bunnyId')?.value
  return bunnyId ? bunnyId.toString() : null
}

export const getLowestUpdatedToken = async (collectionAddress: Address, nftsMarketTokenIds: string[]) => {
  const updatedMarketData = await getNftsUpdatedMarketData(collectionAddress, nftsMarketTokenIds)

  if (!updatedMarketData) return null

  return updatedMarketData
    .filter((tokenUpdatedPrice) => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice > 0 && tokenUpdatedPrice.isTradable
    })
    .sort((askInfoA, askInfoB) => {
      return askInfoA.currentAskPrice > askInfoB.currentAskPrice
        ? 1
        : askInfoA.currentAskPrice > askInfoB.currentAskPrice
        ? 0
        : -1
    })[0]
}

export const useGetLowestPriceFromBunnyId = (bunnyId?: string): LowestNftPrice => {
  const { data, status } = useSWR(bunnyId ? ['bunnyLowestPrice', bunnyId] : null, async () => {
    const response = await getNftsMarketData({ otherId: bunnyId, isTradable: true }, 100, 'currentAskPrice', 'asc')

    if (!response.length) return null

    const nftsMarketTokenIds = response.map((marketData) => marketData.tokenId)
    const lowestPriceUpdatedBunny = await getLowestUpdatedToken(dneroswapBunniesAddress, nftsMarketTokenIds)

    if (lowestPriceUpdatedBunny) {
      return parseFloat(formatBigInt(lowestPriceUpdatedBunny.currentAskPrice))
    }
    return null
  })

  return { isFetching: status !== FetchStatus.Fetched, lowestPrice: data }
}

export const useGetLowestPriceFromNft = (nft: NftToken): LowestNftPrice => {
  const isDneroswapBunny = safeGetAddress(nft.collectionAddress) === safeGetAddress(dneroswapBunniesAddress)

  const bunnyIdAttr = isDneroswapBunny && getBunnyIdFromNft(nft)

  return useGetLowestPriceFromBunnyId(bunnyIdAttr)
}
