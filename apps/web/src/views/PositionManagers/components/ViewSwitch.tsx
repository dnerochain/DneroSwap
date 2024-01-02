import { memo } from 'react'
import { ToggleView } from '@dneroswap/uikit'

import { useViewMode } from '../hooks'

export const ViewSwitch = memo(function ViewSwitch() {
  const { mode, setViewMode } = useViewMode()

  return <ToggleView idPrefix="positionManagers" viewMode={mode} onToggle={setViewMode} />
})
