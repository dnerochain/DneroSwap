import { useCallback } from 'react'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { useSousChef } from 'hooks/useContract'

const options = {}

const harvestPool = async (sousChefContract) => {
  return sousChefContract.write.deposit(['0'], { ...options })
}

const harvestPoolDToken = async (sousChefContract) => {
  return sousChefContract.write.deposit({
    ...options,
    value: BIG_ZERO.toString(),
  })
}

const useHarvestPool = (sousId, isUsingDToken = false) => {
  const sousChefContract = useSousChef(sousId)

  const handleHarvest = useCallback(async () => {
    if (isUsingDToken) {
      return harvestPoolDToken(sousChefContract)
    }

    return harvestPool(sousChefContract)
  }, [isUsingDToken, sousChefContract])

  return { onReward: handleHarvest }
}

export default useHarvestPool
