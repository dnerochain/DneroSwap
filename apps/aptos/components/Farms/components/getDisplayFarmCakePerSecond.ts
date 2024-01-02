export const getDisplayFarmWDneroPerSecond = (poolWeight?: number, wdneroPerBlock?: string) => {
  if (!poolWeight || !wdneroPerBlock) return '0'

  const farmWDneroPerSecond = (poolWeight * Number(wdneroPerBlock)) / 1e8

  return farmWDneroPerSecond < 0.000001 ? '<0.000001' : `~${farmWDneroPerSecond.toFixed(6)}`
}
