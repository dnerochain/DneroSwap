import { useExpertMode } from '@dneroswap/utils/user'

import { useIsWrapping } from './useIsWrapping'

export function useAllowRecipient() {
  const [isExpertMode] = useExpertMode()
  const isWrapping = useIsWrapping()
  return isExpertMode && !isWrapping
}
