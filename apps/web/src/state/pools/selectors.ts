import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
import { transformPool, transformVault } from './helpers'
import { initialPoolVaultState } from './index'
import { getVaultPosition, VaultPosition } from '../../utils/wdneroPool'

const selectPoolsData = (state: State) => state.pools.data
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key ? state.pools[key] : initialPoolVaultState
const selectIfo = (state: State) => state.pools.ifo
const selectIfoUserCredit = (state: State) => state.pools.ifo.credit ?? BIG_ZERO

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool: transformPool(pool), userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools: pools.map(transformPool), userDataLoaded }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.WDneroVault),
    makeVaultPoolByKey(VaultKey.WDneroFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedWDneroVault, deserializedFlexibleSideWDneroVault) => {
    const { pools, userDataLoaded } = poolsWithUserDataLoading
    const wdneroPool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    const withoutWDneroPool = pools.filter((pool) => pool.sousId !== 0)

    const wdneroAutoVault = wdneroPool && {
      ...wdneroPool,
      ...deserializedLockedWDneroVault,
      vaultKey: VaultKey.WDneroVault,
      userData: { ...wdneroPool.userData, ...deserializedLockedWDneroVault.userData },
    }

    const lockedVaultPosition = getVaultPosition(deserializedLockedWDneroVault.userData)
    const hasFlexibleSideSharesStaked = deserializedFlexibleSideWDneroVault.userData.userShares.gt(0)

    const wdneroAutoFlexibleSideVault =
      wdneroPool && (lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked)
        ? [
            {
              ...wdneroPool,
              ...deserializedFlexibleSideWDneroVault,
              vaultKey: VaultKey.WDneroFlexibleSideVault,
              userData: { ...wdneroPool.userData, ...deserializedFlexibleSideWDneroVault.userData },
            },
          ]
        : []

    const allPools = [...wdneroAutoFlexibleSideVault, ...withoutWDneroPool]
    if (wdneroAutoVault) {
      allPools.unshift(wdneroAutoVault)
    }
    return { pools: allPools, userDataLoaded }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})
