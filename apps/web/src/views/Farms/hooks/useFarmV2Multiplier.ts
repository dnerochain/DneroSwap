import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import BigNumber from 'bignumber.js'
import { DNERO_BLOCK_TIME } from 'config'
import { useCallback, useMemo } from 'react'
import { useFarms } from 'state/farms/hooks'

export function useFarmV2Multiplier() {
  const { regularWDneroPerBlock, totalRegularAllocPoint } = useFarms()

  const totalMultipliers = useMemo(
    () => (Number.isFinite(+totalRegularAllocPoint) ? (+totalRegularAllocPoint / 10).toString() : '-'),
    [totalRegularAllocPoint],
  )

  return {
    totalMultipliers,
    getFarmWDneroPerSecond: useCallback(
      (poolWeight: BigNumber) => {
        const farmWDneroPerSecondNum =
          poolWeight && regularWDneroPerBlock ? poolWeight.times(regularWDneroPerBlock).dividedBy(DNERO_BLOCK_TIME) : BIG_ZERO

        const farmWDneroPerSecond = farmWDneroPerSecondNum.isZero()
          ? '0'
          : farmWDneroPerSecondNum.lt(0.000001)
          ? '<0.000001'
          : `~${farmWDneroPerSecondNum.toFixed(6)}`
        return farmWDneroPerSecond
      },
      [regularWDneroPerBlock],
    ),
  }
}
