import { getBWDneroFarmBoosterAddress } from 'utils/addressHelpers'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@dneroswap/chains'
import { bWDneroFarmBoosterABI } from 'config/abi/bWDneroFarmBooster'
import { useQuery } from '@tanstack/react-query'

const useFarmBoosterConstants = () => {
  const bWDneroFarmBoosterAddress = getBWDneroFarmBoosterAddress()

  const { data, status } = useQuery(
    ['farmBoosterConstants'],
    async () => {
      return publicClient({ chainId: ChainId.DNERO }).multicall({
        contracts: [
          {
            address: bWDneroFarmBoosterAddress,
            abi: bWDneroFarmBoosterABI,
            functionName: 'cA',
          },
          {
            address: bWDneroFarmBoosterAddress,
            abi: bWDneroFarmBoosterABI,
            functionName: 'CA_PRECISION',
          },
          {
            address: bWDneroFarmBoosterAddress,
            abi: bWDneroFarmBoosterABI,
            functionName: 'cB',
          },
        ],
        allowFailure: false,
      })
    },
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )
  return useMemo(() => {
    return {
      constants: data && {
        cA: new BigNumber(data[0].toString()).div(new BigNumber(data[1].toString())).toNumber(),
        cB: new BigNumber(data[2].toString()).toNumber(),
      },
      isLoading: status !== 'success',
    }
  }, [data, status])
}

export default useFarmBoosterConstants
