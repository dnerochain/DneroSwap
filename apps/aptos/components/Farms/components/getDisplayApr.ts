export const getDisplayApr = (wdneroRewardsApr?: number, lpRewardsApr?: number) => {
  if (wdneroRewardsApr && lpRewardsApr) {
    return (wdneroRewardsApr + lpRewardsApr).toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  if (wdneroRewardsApr) {
    return wdneroRewardsApr.toLocaleString('en-US', { maximumFractionDigits: 2 })
  }
  return null
}
