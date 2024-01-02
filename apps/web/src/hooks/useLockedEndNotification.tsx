import { useToast, Text, StyledLink } from '@dneroswap/uikit'
import { NextLinkFromReactRouter } from '@dneroswap/widgets-internal'

import { useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { useTranslation } from '@dneroswap/localization'
import isUndefinedOrNull from '@dneroswap/utils/isUndefinedOrNull'
import { useAtom } from 'jotai'
import { useAccount } from 'wagmi'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'
import { useUserWDneroLockStatus } from './useUserWDneroLockStatus'

const lockedNotificationShowAtom = atomWithStorageWithErrorCatch('lockedNotificationShow', true, () => sessionStorage)
function useLockedNotificationShow() {
  return useAtom(lockedNotificationShowAtom)
}

const LockedEndDescription: React.FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <Text>{t('The locked staking duration has ended.')}</Text>
      <NextLinkFromReactRouter to="/pools" prefetch={false}>
        <StyledLink color="primary">{t('Go to Pools')}</StyledLink>
      </NextLinkFromReactRouter>
    </>
  )
}

const useLockedEndNotification = () => {
  const { t } = useTranslation()
  const { toastInfo } = useToast()
  const { mutate } = useSWRConfig()
  const { address: account } = useAccount()
  const isUserLockedEnd = useUserWDneroLockStatus()
  const [lockedNotificationShow, setLockedNotificationShow] = useLockedNotificationShow()

  useEffect(() => {
    if (account) {
      if (!isUndefinedOrNull(isUserLockedEnd)) {
        setLockedNotificationShow(true)
        mutate(['userWDneroLockStatus', account])
      }
    } else {
      setLockedNotificationShow(true)
    }
  }, [setLockedNotificationShow, account, mutate, isUserLockedEnd])

  useEffect(() => {
    if (toastInfo && isUserLockedEnd && lockedNotificationShow) {
      toastInfo(t('WDnero Syrup Pool'), <LockedEndDescription />)
      setLockedNotificationShow(false) // show once
    }
  }, [isUserLockedEnd, toastInfo, lockedNotificationShow, setLockedNotificationShow, t])
}

export default useLockedEndNotification
