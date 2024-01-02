import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { getFullDecimalMultiplier } from '@dneroswap/utils/getFullDecimalMultiplier'
import { useSousChef } from 'hooks/useContract'

const options = {}

const sousStake = async (sousChefContract, amount, decimals = 18) => {
  return sousChefContract.write.deposit([new BigNumber(amount).times(getFullDecimalMultiplier(decimals)).toString()], {
    ...options,
  })
}

const sousStakeDToken = async (sousChefContract, amount) => {
  return sousChefContract.write.deposit([new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()], {
    ...options,
  })
}

const useStakePool = (sousId: number, isUsingDToken = false) => {
  const sousChefContract = useSousChef(sousId)

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (isUsingDToken) {
        return sousStakeDToken(sousChefContract, amount)
      }
      return sousStake(sousChefContract, amount, decimals)
    },
    [isUsingDToken, sousChefContract],
  )

  return { onStake: handleStake }
}

export default useStakePool
