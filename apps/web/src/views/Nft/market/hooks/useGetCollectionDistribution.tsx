import { useEffect, useState } from 'react'
import { getCollectionDistributionApi, getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiCollectionDistribution, ApiResponseCollectionTokens, ApiSingleTokenData } from 'state/nftMarket/types'
import { getDneroswapBunniesAddress } from 'utils/addressHelpers'
import useSWRImmutable from 'swr/immutable'
import { FetchStatus } from 'config/constants/types'
import mapValues from 'lodash/mapValues'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@dneroswap/chains'
import { dneroswapBunniesABI } from 'config/abi/dneroswapBunnies'
import { dneroswapBunniesAddress } from '../constants'

const useGetCollectionDistribution = (collectionAddress: string | undefined) => {
  const { data, status } = useSWRImmutable(
    collectionAddress ? ['distribution', collectionAddress] : null,
    async () => (await getCollectionDistributionApi<ApiCollectionDistribution>(collectionAddress)).data,
  )

  return {
    data,
    isFetching: status !== FetchStatus.Fetched,
  }
}

interface StatePB {
  isFetching: boolean
  data: Record<string, ApiSingleTokenData & { tokenCount: number }>
}

export const useGetCollectionDistributionPB = () => {
  const [state, setState] = useState<StatePB>({ isFetching: false, data: null })

  useEffect(() => {
    const fetchTokens = async () => {
      setState((prevState) => ({ ...prevState, isFetching: true }))
      let apiResponse: ApiResponseCollectionTokens | null | undefined = null
      try {
        apiResponse = await getNftsFromCollectionApi(dneroswapBunniesAddress)
        if (!apiResponse) {
          setState((prevState) => ({ ...prevState, isFetching: false }))
          return
        }
      } catch (error) {
        setState((prevState) => ({ ...prevState, isFetching: false }))
        return
      }
      // Use on chain data to get most updated totalSupply and bunnyCount data. Nft Api Data not updated frequently.
      const tokenIds = Object.keys(apiResponse.attributesDistribution)
      try {
        const response = await publicClient({ chainId: ChainId.DNERO }).multicall({
          contracts: tokenIds.map(
            (tokenId) =>
              ({
                address: getDneroswapBunniesAddress(),
                functionName: 'bunnyCount',
                abi: dneroswapBunniesABI,
                args: [Number(tokenId)],
              } as const),
          ),
          allowFailure: false,
        })
        const tokenListResponse = response.reduce((obj, tokenCount, index) => {
          return {
            ...obj,
            [tokenIds[index]]: { ...apiResponse.data[index], tokenCount: Number(tokenCount) },
          }
        }, {})
        setState({
          isFetching: false,
          data: tokenListResponse,
        })
      } catch (error) {
        // Use nft api data if on chain multicall fails
        const tokenListResponse = mapValues(apiResponse.data, (tokenData, tokenId) => ({
          ...tokenData,
          tokenCount: apiResponse.attributesDistribution[tokenId],
        }))
        setState({ isFetching: false, data: tokenListResponse })
      }
    }

    fetchTokens()
  }, [])

  return state
}

export default useGetCollectionDistribution
