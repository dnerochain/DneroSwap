import { ChainId } from '@dneroswap/chains'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import contracts from 'config/constants/contracts'
import { publicClient } from 'utils/wagmi'
import { formatUnits } from 'viem'
import { FAST_INTERVAL } from 'config/constants'
import { useQuery } from '@tanstack/react-query'

// for migration to bignumber.js to avoid breaking changes
export const useDTOKENPrice = ({ enabled = true } = {}) => {
  const { data } = useQuery<BigNumber, Error>({
    queryKey: ['dtokenPrice'],
    queryFn: async () => new BigNumber(await getDTOKENPriceFromOracle()),
    staleTime: FAST_INTERVAL,
    refetchInterval: FAST_INTERVAL,
    enabled,
  })
  return data ?? BIG_ZERO
}

export const getDTOKENPriceFromOracle = async () => {
  const data = await publicClient({ chainId: ChainId.DNERO }).readContract({
    abi: chainlinkOracleABI,
    address: contracts.chainlinkOracleDTOKEN[ChainId.DNERO],
    functionName: 'latestAnswer',
  })

  return formatUnits(data, 8)
}
