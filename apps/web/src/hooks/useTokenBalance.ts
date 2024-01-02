import { ChainId } from '@dneroswap/chains'
import { WDNERO } from '@dneroswap/tokens'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { getVeWDneroAddress } from 'utils/addressHelpers'
import { Address, erc20ABI, useAccount, useBalance, useContractRead } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

const useTokenBalance = (tokenAddress: Address, forceDNERO?: boolean) => {
  return useTokenBalanceByChain(tokenAddress, forceDNERO ? ChainId.DNERO : undefined)
}

export const useTokenBalanceByChain = (tokenAddress: Address, chainIdOverride?: ChainId) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const { data, status, ...rest } = useContractRead({
    chainId: chainIdOverride || chainId,
    abi: erc20ABI,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: [account || '0x'],
    enabled: !!account,
    watch: true,
  })

  return {
    ...rest,
    fetchStatus: status,
    balance: useMemo(() => (typeof data !== 'undefined' ? new BigNumber(data.toString()) : BIG_ZERO), [data]),
  }
}

export const useGetDTokenBalance = () => {
  const { address: account } = useAccount()
  const { status, refetch, data } = useBalance({
    chainId: ChainId.DNERO,
    address: account,
    watch: true,
    enabled: !!account,
  })

  return { balance: data?.value ? BigInt(data.value) : 0n, fetchStatus: status, refresh: refetch }
}

export const useDNEROWDneroBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(WDNERO[ChainId.DNERO]?.address, true)

  return { balance: BigInt(balance.toString()), fetchStatus }
}

// veWDnero only deploy on bsc/dneroTestnet
export const useVeWDneroBalance = () => {
  const { chainId } = useActiveChainId()
  const { balance, fetchStatus } = useTokenBalance(getVeWDneroAddress(chainId))

  return { balance, fetchStatus }
}

export default useTokenBalance
