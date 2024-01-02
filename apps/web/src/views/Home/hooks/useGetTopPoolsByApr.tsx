import { useState, useEffect } from 'react'
import { useAppDispatch } from 'state'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { VaultKey } from 'state/types'
import {
  fetchWDneroVaultFees,
  fetchPoolsPublicDataAsync,
  fetchWDneroVaultPublicData,
  setInitialPoolConfig,
} from 'state/pools'
import { usePoolsWithVault } from 'state/pools/hooks'
import { Pool } from '@dneroswap/widgets-internal'
import { Token } from '@dneroswap/sdk'
import { useQuery } from '@tanstack/react-query'

const useGetTopPoolsByApr = (isIntersecting: boolean, chainId: number) => {
  const dispatch = useAppDispatch()
  const [topPools, setTopPools] = useState<(Pool.DeserializedPool<Token> | any)[]>(() => [null, null, null, null, null])
  const { pools } = usePoolsWithVault()

  const { status: fetchStatus, isFetching } = useQuery(
    [chainId, 'fetchTopPoolsByApr'],
    async () => {
      await dispatch(setInitialPoolConfig({ chainId }))
      return Promise.all([
        dispatch(fetchWDneroVaultFees(chainId)),
        dispatch(fetchWDneroVaultPublicData(chainId)),
        dispatch(fetchPoolsPublicDataAsync(chainId)),
      ])
    },
    {
      enabled: Boolean(isIntersecting && chainId),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    const [wdneroPools, otherPools] = partition(pools, (pool) => pool.sousId === 0)
    const masterWDneroPool = wdneroPools.filter((wdneroPool) => wdneroPool.vaultKey === VaultKey.WDneroVault)
    const getTopPoolsByApr = (activePools: (Pool.DeserializedPool<Token> | any)[]) => {
      const sortedByApr = orderBy(activePools, (pool: Pool.DeserializedPool<Token>) => pool.apr || 0, 'desc')
      setTopPools([...masterWDneroPool, ...sortedByApr.slice(0, 4)])
    }
    if (fetchStatus === 'success' && !isFetching) {
      getTopPoolsByApr(otherPools)
    }
  }, [setTopPools, pools, isFetching, fetchStatus])

  return { topPools }
}

export default useGetTopPoolsByApr
