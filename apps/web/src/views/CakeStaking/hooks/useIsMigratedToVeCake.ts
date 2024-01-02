import { isAddressEqual, zeroAddress } from 'viem'
import { useVeWDneroUserInfo } from './useVeWDneroUserInfo'

export const useIsMigratedToVeWDnero = () => {
  const { data } = useVeWDneroUserInfo()
  if (!data) return false
  if (isAddressEqual(data.wdneroPoolProxy, zeroAddress)) return false
  return true
}
