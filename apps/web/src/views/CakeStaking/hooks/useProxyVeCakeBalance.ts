import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { getVeWDneroAddress } from 'utils/addressHelpers'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { erc20ABI, useContractRead } from 'wagmi'
import { useVeWDneroUserInfo } from './useVeWDneroUserInfo'

export const useProxyVeWDneroBalance = () => {
  const { chainId } = useActiveChainId()
  const { data: userInfo } = useVeWDneroUserInfo()
  const hasProxy = useMemo(() => {
    return userInfo && userInfo?.wdneroPoolProxy && !isAddressEqual(userInfo!.wdneroPoolProxy, zeroAddress)
  }, [userInfo])
  const { status, refetch, data } = useContractRead({
    chainId,
    address: getVeWDneroAddress(chainId),
    functionName: 'balanceOf',
    abi: erc20ABI,
    args: [userInfo?.wdneroPoolProxy as Address],
    watch: true,
    enabled: hasProxy,
  })

  return {
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
    fetchStatus: status,
    refresh: refetch,
  }
}
