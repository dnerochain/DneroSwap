import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedWDneroVault, VaultKey } from 'state/types'

export const useUserLockedWDneroStatus = () => {
  const vaultPool = useVaultPoolByKey(VaultKey.WDneroVault) as DeserializedLockedWDneroVault

  return {
    totalWDneroInVault: vaultPool?.totalWDneroInVault,
    totalLockedAmount: vaultPool?.totalLockedAmount,
    isLoading: vaultPool?.userData?.isLoading,
    locked: Boolean(vaultPool?.userData?.locked),
    lockedEnd: vaultPool?.userData?.lockEndTime,
    lockedAmount: vaultPool?.userData?.lockedAmount,
    lockBalance: vaultPool?.userData?.balance,
    lockedStart: vaultPool?.userData?.lockStartTime,
  }
}
