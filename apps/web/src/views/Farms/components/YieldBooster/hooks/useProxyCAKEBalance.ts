import { getWDneroContract } from 'utils/contractHelpers'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { useBWDneroProxyContractAddress } from 'views/Farms/hooks/useBWDneroProxyContractAddress'
import BigNumber from 'bignumber.js'
import { useContractRead } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

const useProxyWDNEROBalance = () => {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBWDneroProxyContractAddress(account, chainId)
  const wdneroContract = getWDneroContract()

  const { data, refetch } = useContractRead({
    chainId,
    ...wdneroContract,
    enabled: Boolean(account && proxyAddress),
    functionName: 'balanceOf',
    args: [proxyAddress],
  })

  return {
    refreshProxyWDneroBalance: refetch,
    proxyWDneroBalance: data ? getBalanceNumber(new BigNumber(data.toString())) : 0,
  }
}

export default useProxyWDNEROBalance
