import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { FAST_INTERVAL } from 'config/constants'
import { getFarmConfig } from '@dneroswap/farms/constants'
import { Pool } from '@dneroswap/widgets-internal'
import { Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { getLivePoolsConfig } from '@dneroswap/pools'
import { isIfoSupported, getSourceChain } from '@dneroswap/ifos'

import { useActiveChainId } from 'hooks/useActiveChainId'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useQuery } from '@tanstack/react-query'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchWDneroVaultPublicData,
  fetchWDneroVaultUserData,
  fetchWDneroVaultFees,
  fetchPoolsStakingLimitsAsync,
  fetchUserIfoCreditDataAsync,
  fetchIfoPublicDataAsync,
  fetchWDneroFlexibleSideVaultPublicData,
  fetchWDneroFlexibleSideVaultUserData,
  fetchWDneroFlexibleSideVaultFees,
  fetchWDneroPoolUserDataAsync,
  fetchWDneroPoolPublicDataAsync,
  setInitialPoolConfig,
} from '.'
import { VaultKey } from '../types'
import { fetchFarmsPublicDataAsync } from '../farms'
import {
  makePoolWithUserDataLoadingSelector,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoCreditSelector,
  ifoCeilingSelector,
  makeVaultPoolWithKeySelector,
} from './selectors'

// Only fetch farms for live pools
const getActiveFarms = async (chainId: number) => {
  const farmsConfig = (await getFarmConfig(chainId)) || []
  const livePools = getLivePoolsConfig(chainId) || []
  const lPoolAddresses = livePools
    .filter(({ sousId }) => sousId !== 0)
    .map(({ earningToken, stakingToken }) => {
      if (earningToken.symbol === 'WDNERO') {
        return stakingToken.address
      }
      return earningToken.address
    })

  return farmsConfig
    .filter(
      ({ token, pid, quoteToken }) =>
        pid !== 0 &&
        ((token.symbol === 'WDNERO' && quoteToken.symbol === 'WDTOKEN') ||
          (token.symbol === 'BUSD' && quoteToken.symbol === 'WDTOKEN') ||
          (token.symbol === 'USDT' && quoteToken.symbol === 'BUSD') ||
          lPoolAddresses.find((poolAddress) => poolAddress === token.address)),
    )
    .map((farm) => farm.pid)
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      if (!chainId) return
      const activeFarms = await getActiveFarms(chainId)
      await dispatch(fetchFarmsPublicDataAsync({ pids: activeFarms, chainId }))

      batch(() => {
        dispatch(fetchPoolsPublicDataAsync(chainId))
        dispatch(fetchPoolsStakingLimitsAsync(chainId))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool: Pool.DeserializedPool<Token>; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const useDeserializedPoolByVaultKey = (vaultKey) => {
  const vaultPoolWithKeySelector = useMemo(() => makeVaultPoolWithKeySelector(vaultKey), [vaultKey])

  return useSelector(vaultPoolWithKeySelector)
}

export const usePoolsConfigInitialize = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useEffect(() => {
    if (chainId) {
      dispatch(setInitialPoolConfig({ chainId }))
    }
  }, [dispatch, chainId])
}

export const usePoolsPageFetch = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  usePoolsConfigInitialize()

  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchWDneroVaultPublicData(chainId))
        dispatch(fetchWDneroFlexibleSideVaultPublicData(chainId))
        dispatch(fetchIfoPublicDataAsync(chainId))
        if (account) {
          dispatch(fetchPoolsUserDataAsync({ account, chainId }))
          dispatch(fetchWDneroVaultUserData({ account, chainId }))
          dispatch(fetchWDneroFlexibleSideVaultUserData({ account, chainId }))
        }
      })
    }
  }, [account, chainId, dispatch])

  useEffect(() => {
    if (chainId) {
      batch(() => {
        dispatch(fetchWDneroVaultFees(chainId))
        dispatch(fetchWDneroFlexibleSideVaultFees(chainId))
      })
    }
  }, [dispatch, chainId])
}

export const useWDneroVaultUserData = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useFastRefreshEffect(() => {
    if (account && chainId) {
      dispatch(fetchWDneroVaultUserData({ account, chainId }))
    }
  }, [account, dispatch, chainId])
}

export const useWDneroVaultPublicData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useFastRefreshEffect(() => {
    if (chainId) {
      dispatch(fetchWDneroVaultPublicData(chainId))
    }
  }, [dispatch, chainId])
}

const useWDneroVaultChain = (chainId?: ChainId) => {
  return useMemo(() => getSourceChain(chainId) || ChainId.DNERO, [chainId])
}

export const useFetchIfo = () => {
  const { account, chainId } = useAccountActiveChain()
  const ifoSupported = useMemo(() => isIfoSupported(chainId), [chainId])
  const wdneroVaultChain = useWDneroVaultChain(chainId)
  const dispatch = useAppDispatch()

  usePoolsConfigInitialize()

  useQuery(
    ['fetchIfoPublicData', chainId],
    async () => {
      if (chainId && wdneroVaultChain) {
        batch(() => {
          dispatch(fetchWDneroPoolPublicDataAsync())
          dispatch(fetchWDneroVaultPublicData(wdneroVaultChain))
          dispatch(fetchIfoPublicDataAsync(chainId))
        })
      }
      return null
    },
    {
      enabled: Boolean(chainId && ifoSupported),
      refetchInterval: FAST_INTERVAL,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  useQuery(
    ['fetchIfoUserData', account, chainId],
    async () => {
      if (chainId && wdneroVaultChain && account) {
        batch(() => {
          dispatch(fetchWDneroPoolUserDataAsync({ account, chainId: wdneroVaultChain }))
          dispatch(fetchWDneroVaultUserData({ account, chainId: wdneroVaultChain }))
          dispatch(fetchUserIfoCreditDataAsync({ account, chainId }))
        })
      }
      return null
    },
    {
      enabled: Boolean(account && chainId && wdneroVaultChain),
      refetchInterval: FAST_INTERVAL,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )

  useQuery(
    ['fetchWDneroVaultFees', wdneroVaultChain],
    async () => {
      if (wdneroVaultChain) {
        dispatch(fetchWDneroVaultFees(wdneroVaultChain))
      }
      return null
    },
    {
      enabled: Boolean(wdneroVaultChain && ifoSupported),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  )
}

export const useWDneroVault = () => {
  return useVaultPoolByKey(VaultKey.WDneroVault)
}

export const useVaultPoolByKey = (key?: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}
