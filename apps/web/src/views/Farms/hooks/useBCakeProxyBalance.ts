import { WDNERO } from '@dneroswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance, getBalanceAmount } from '@dneroswap/utils/formatBalance'
import { useBWDneroProxyContract, useWDnero } from 'hooks/useContract'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useQuery } from '@tanstack/react-query'
import { useBWDneroProxyContractAddress } from './useBWDneroProxyContractAddress'

const SMALL_AMOUNT_THRESHOLD = new BigNumber(0.001)

const useBWDneroProxyBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress, isLoading: isProxyContractAddressLoading } = useBWDneroProxyContractAddress(account, chainId)
  const bWDneroProxy = useBWDneroProxyContract(proxyAddress)
  const wdneroContract = useWDnero()

  const { data, status } = useQuery(
    ['bWDneroProxyBalance', account],
    async () => {
      const rawBalance = await wdneroContract.read.balanceOf([bWDneroProxy.address])
      return new BigNumber(rawBalance.toString())
    },
    {
      enabled: Boolean(account && bWDneroProxy && !isProxyContractAddressLoading),
    },
  )

  const balanceAmount = useMemo(
    () => (data ? getBalanceAmount(data, WDNERO[chainId].decimals) : new BigNumber(NaN)),
    [data, chainId],
  )

  return useMemo(() => {
    return {
      bWDneroProxyBalance: data ? balanceAmount.toNumber() : 0,
      bWDneroProxyDisplayBalance: data
        ? balanceAmount.isGreaterThan(SMALL_AMOUNT_THRESHOLD)
          ? getFullDisplayBalance(data, WDNERO[chainId].decimals, 3)
          : '< 0.001'
        : null,
      isLoading: status !== 'success',
    }
  }, [data, balanceAmount, status, chainId])
}

export default useBWDneroProxyBalance
