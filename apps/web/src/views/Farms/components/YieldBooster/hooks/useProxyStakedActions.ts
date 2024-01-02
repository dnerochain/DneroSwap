import { useBWDneroProxyContract } from 'hooks/useContract'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useGasPrice } from 'state/user/hooks'
import { harvestFarm, stakeFarm, unstakeFarm } from 'utils/calls/farms'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useBWDneroProxyContractAddress } from 'views/Farms/hooks/useBWDneroProxyContractAddress'
import { BOOSTED_FARM_GAS_LIMIT } from 'config'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useApproveBoostProxyFarm } from '../../../hooks/useApproveFarm'
import useProxyWDNEROBalance from './useProxyWDNEROBalance'

export default function useProxyStakedActions(pid, lpContract) {
  const { account, chainId } = useAccountActiveChain()
  const { proxyAddress } = useBWDneroProxyContractAddress(account, chainId)
  const bWDneroProxy = useBWDneroProxyContract(proxyAddress)
  const dispatch = useAppDispatch()
  const gasPrice = useGasPrice()
  const { proxyWDneroBalance, refreshProxyWDneroBalance } = useProxyWDNEROBalance()

  const onDone = useCallback(() => {
    refreshProxyWDneroBalance()
    dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId, proxyAddress }))
  }, [account, proxyAddress, chainId, pid, dispatch, refreshProxyWDneroBalance])

  const { onApprove } = useApproveBoostProxyFarm(lpContract, proxyAddress)

  const onStake = useCallback(
    // TODO: wagmi
    // @ts-ignore
    (value) => stakeFarm(bWDneroProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bWDneroProxy, pid, gasPrice],
  )

  const onUnstake = useCallback(
    // TODO: wagmi
    // @ts-ignore
    (value) => unstakeFarm(bWDneroProxy, pid, value, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bWDneroProxy, pid, gasPrice],
  )

  const onReward = useCallback(
    // TODO: wagmi
    // @ts-ignore
    () => harvestFarm(bWDneroProxy, pid, gasPrice, BOOSTED_FARM_GAS_LIMIT),
    [bWDneroProxy, pid, gasPrice],
  )

  return {
    onStake,
    onUnstake,
    onReward,
    onApprove,
    onDone,
    proxyWDneroBalance,
  }
}
