import { atom } from 'jotai'

export enum ApproveAndLockStatus {
  // no modal
  IDLE,
  // approve token, send tx
  APPROVING_TOKEN,
  // send lock tx
  LOCK_WDNERO,
  // lock pending, wait for lock confirmation
  LOCK_WDNERO_PENDING,
  // lock confirmed, wait for migrate confirmation
  INCREASE_AMOUNT,
  INCREASE_AMOUNT_PENDING,
  INCREASE_WEEKS,
  INCREASE_WEEKS_PENDING,
  UNLOCK_WDNERO,
  UNLOCK_WDNERO_PENDING,
  MIGRATE,
  MIGRATE_PENDING,
  CONFIRMED,
  // any user rejection
  REJECT,
}

export const approveAndLockStatusAtom = atom<ApproveAndLockStatus>(ApproveAndLockStatus.IDLE)
export const wdneroLockAmountAtom = atom<string>('0')
export const wdneroLockWeeksAtom = atom<string>('26')
export const wdneroLockTxHashAtom = atom<`0x${string}` | ''>('')
export const wdneroLockApprovedAtom = atom<boolean>(false)
