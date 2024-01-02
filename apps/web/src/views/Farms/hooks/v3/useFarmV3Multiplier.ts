import { useCallback, useMemo } from 'react'
import { useFarmsV3Public } from 'state/farmsV3/hooks'

export function useFarmV3Multiplier() {
  const { data: farmV3 } = useFarmsV3Public()
  const { totalAllocPoint, wdneroPerSecond } = farmV3
  const totalMultipliers = useMemo(
    () => (Number.isFinite(+totalAllocPoint) ? (+totalAllocPoint / 10).toString() : '-'),
    [totalAllocPoint],
  )

  return {
    totalMultipliers,
    getFarmWDneroPerSecond: useCallback(
      (poolWeight?: string) => {
        const farmWDneroPerSecondNum = poolWeight && wdneroPerSecond ? Number(poolWeight) * Number(wdneroPerSecond) : 0
        return farmWDneroPerSecondNum === 0
          ? '0'
          : farmWDneroPerSecondNum < 0.000001
          ? '<0.000001'
          : `~${farmWDneroPerSecondNum.toFixed(6)}`
      },
      [wdneroPerSecond],
    ),
  }
}
