import { useFarmUser } from 'state/farms/hooks'
import { useBWDneroFarmBoosterContract } from 'hooks/useContract'
import isUndefinedOrNull from '@dneroswap/utils/isUndefinedOrNull'
import { useUserBoosterStatus } from 'views/Farms/hooks/useUserBoosterStatus'
import { useBWDneroProxyContractAddress } from 'views/Farms/hooks/useBWDneroProxyContractAddress'
import { useUserLockedWDneroStatus } from 'views/Farms/hooks/useUserLockedWDneroStatus'
import { useCallback } from 'react'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useContractRead } from 'wagmi'

export enum YieldBoosterState {
  UNCONNECTED,
  NO_LOCKED,
  LOCKED_END,
  NO_PROXY_CREATED,
  NO_MIGRATE,
  NO_LP,
  DEACTIVE,
  ACTIVE,
  ACTIVE_AND_NO_LP,
  MAX,
}

function useIsPoolActive(pid: number) {
  const farmBoosterContract = useBWDneroFarmBoosterContract()
  const { account, chainId } = useAccountActiveChain()

  const { data, refetch } = useContractRead({
    abi: farmBoosterContract.abi,
    address: farmBoosterContract.address,
    functionName: 'isBoostedPool',
    args: [account, BigInt(pid)],
    watch: true,
    enabled: !!account,
    chainId,
  })

  return {
    isActivePool: data,
    refreshIsPoolActive: refetch,
  }
}

interface UseYieldBoosterStateArgs {
  farmPid: number
}

export default function useYieldBoosterState(yieldBoosterStateArgs: UseYieldBoosterStateArgs) {
  const { farmPid } = yieldBoosterStateArgs
  const { account, chainId } = useAccountActiveChain()
  const { remainingCounts, refreshActivePools } = useUserBoosterStatus(account)
  const { locked, lockedEnd } = useUserLockedWDneroStatus()
  const { stakedBalance, proxy } = useFarmUser(farmPid)
  const { isActivePool, refreshIsPoolActive } = useIsPoolActive(farmPid)
  const { proxyCreated, refreshProxyAddress, proxyAddress } = useBWDneroProxyContractAddress(account, chainId)

  const refreshActivePool = useCallback(() => {
    refreshActivePools()
    refreshIsPoolActive()
  }, [refreshActivePools, refreshIsPoolActive])

  let state = null

  if (!account || isUndefinedOrNull(locked)) {
    state = YieldBoosterState.UNCONNECTED
  } else if (!locked && stakedBalance.eq(0)) {
    // NOTE: depend on useWDneroVaultUserData in Farm Component to check state
    state = YieldBoosterState.NO_LOCKED
  } else if (!proxyCreated) {
    state = YieldBoosterState.NO_PROXY_CREATED
  } else if (stakedBalance.gt(0)) {
    state = YieldBoosterState.NO_MIGRATE
  } else if (lockedEnd === '0' || new Date() > new Date(parseInt(lockedEnd) * 1000)) {
    // NOTE: duplicate logic in BWDneroBoosterCard
    state = YieldBoosterState.LOCKED_END
  } else if (!isActivePool && proxy?.stakedBalance.eq(0)) {
    state = YieldBoosterState.NO_LP
  } else if (!isActivePool && remainingCounts === 0) {
    state = YieldBoosterState.MAX
  } else if (isActivePool && proxy?.stakedBalance.eq(0)) {
    state = YieldBoosterState.ACTIVE_AND_NO_LP
  } else if (isActivePool) {
    state = YieldBoosterState.ACTIVE
  } else {
    state = YieldBoosterState.DEACTIVE
  }

  return {
    state,
    shouldUseProxyFarm: proxyCreated && stakedBalance.eq(0),
    refreshActivePool,
    refreshProxyAddress,
    proxyAddress,
  }
}
