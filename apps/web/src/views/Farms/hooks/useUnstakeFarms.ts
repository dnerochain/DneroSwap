import { useCallback } from 'react'
import { unstakeFarm, nonDneroUnstakeFarm } from 'utils/calls'
import { useMasterchef, useNonDneroVault } from 'hooks/useContract'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

const useUnstakeFarms = (pid: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()
  const oraclePrice = useOraclePrice(chainId)
  const masterChefContract = useMasterchef()
  const nonDneroVaultContract = useNonDneroVault()

  const handleUnstake = useCallback(
    async (amount: string) => {
      return unstakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleUnstakeNonDnero = useCallback(
    async (amount: string) => {
      return nonDneroUnstakeFarm(nonDneroVaultContract, vaultPid, amount, gasPrice, account, oraclePrice, chainId)
    },
    [nonDneroVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId],
  )

  return { onUnstake: vaultPid ? handleUnstakeNonDnero : handleUnstake }
}

export default useUnstakeFarms
