import { ViewMode } from '@dneroswap/uikit'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { updateQuery } from '@dneroswap/utils/clientRouter'

export function useViewMode() {
  const router = useRouter()
  const mode = useMemo(
    () => (router.query.view === String(ViewMode.CARD).toLocaleLowerCase() ? ViewMode.CARD : ViewMode.TABLE),
    [router.query],
  )
  const setViewMode = useCallback(
    (viewMode: ViewMode) => {
      if (mode === viewMode) {
        return
      }
      router.push(
        updateQuery(router.asPath, {
          view: viewMode.toLocaleLowerCase(),
        }),
        '',
        { scroll: false },
      )
    },
    [router, mode],
  )

  return {
    mode,
    setViewMode,
  }
}
