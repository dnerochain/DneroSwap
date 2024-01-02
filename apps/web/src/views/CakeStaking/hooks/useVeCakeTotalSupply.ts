import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { veWDneroABI } from 'config/abi/veWDnero'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeWDneroAddress } from 'utils/addressHelpers'
import { useContractRead } from 'wagmi'

export const useVeWDneroTotalSupply = () => {
  const { chainId } = useActiveChainId()

  const { status, refetch, data } = useContractRead({
    chainId,
    address: getVeWDneroAddress(chainId),
    functionName: 'totalSupply',
    abi: veWDneroABI,
    enabled: Boolean(getVeWDneroAddress(chainId)),
  })

  return {
    data: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
