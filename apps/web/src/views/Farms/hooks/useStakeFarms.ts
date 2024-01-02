import { useMasterchef, useNonDneroVault } from 'hooks/useContract'
import { useCallback } from 'react'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { nonDneroStakeFarm, stakeFarm } from 'utils/calls'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

const useStakeFarms = (pid: number, vaultPid?: number) => {
  const { account, chainId } = useAccountActiveChain()
  const { gasPrice } = useFeeDataWithGasPrice()

  const oraclePrice = useOraclePrice(chainId)
  const masterChefContract = useMasterchef()
  const nonDneroVaultContract = useNonDneroVault()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  const handleStakeNonDnero = useCallback(
    async (amount: string) => {
      return nonDneroStakeFarm(nonDneroVaultContract, vaultPid, amount, gasPrice, account, oraclePrice, chainId)
    },
    [nonDneroVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId],
  )

  return { onStake: vaultPid ? handleStakeNonDnero : handleStake }
}

export default useStakeFarms
