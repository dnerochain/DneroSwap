import { useMemo } from 'react'
import { WDneroPoolType } from '../types'
import { useVeWDneroUserInfo } from './useVeWDneroUserInfo'

export const useIsUserDelegated = (): boolean => {
  const { data: userInfo } = useVeWDneroUserInfo()
  const isUserDelegated = useMemo(() => {
    return userInfo?.wdneroPoolType === WDneroPoolType.DELEGATED
  }, [userInfo])
  return isUserDelegated
}
