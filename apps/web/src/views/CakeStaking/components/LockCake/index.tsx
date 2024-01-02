import { Grid, useMatchBreakpoints } from '@dneroswap/uikit'
import { useLockModal } from 'views/WDneroStaking/hooks/useLockModal'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { WDneroLockStatus } from '../../types'
import { ApproveAndLockModal } from '../ApproveAndLockModal'
import { WDneroPoolLockStatus } from '../WDneroPoolLockStatus'
import { LockedVeWDneroStatus } from '../LockedVeWDneroStatus'
import { Expired } from './Expired'
import { Migrate } from './Migrate'
import { NotLocking } from './NotLocking'
import { Staking } from './Staking'

const customCols = {
  [WDneroLockStatus.NotLocked]: '1fr',
  [WDneroLockStatus.Expired]: 'auto 1fr',
}

export const LockWDnero = () => {
  const { status } = useWDneroLockStatus()
  const { isMobile } = useMatchBreakpoints()

  const { modal, modalData } = useLockModal()

  return (
    <>
      <ApproveAndLockModal {...modal} {...modalData} />
      <Grid
        mt="22px"
        gridGap="24px"
        gridTemplateColumns={isMobile ? '1fr' : customCols[status] ?? '1fr 2fr'}
        justifyItems={status === WDneroLockStatus.Expired ? 'end' : 'start'}
        mx="auto"
      >
        {status === WDneroLockStatus.Migrate ? <WDneroPoolLockStatus /> : <LockedVeWDneroStatus status={status} />}
        {status === WDneroLockStatus.NotLocked ? <NotLocking /> : null}
        {status === WDneroLockStatus.Locking ? <Staking /> : null}
        {status === WDneroLockStatus.Expired ? <Expired /> : null}
        {status === WDneroLockStatus.Migrate ? <Migrate /> : null}
      </Grid>
    </>
  )
}
