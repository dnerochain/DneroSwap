import { EventInfos, UserInfos, UserStatusEnum } from 'views/DneroswapSquad/types'
import { Address } from 'wagmi'

export type DneroswapSquadHeaderType = {
  account: Address
  isLoading: boolean
  eventInfos?: EventInfos
  userInfos?: UserInfos
  userStatus: UserStatusEnum
}

export enum ButtonsEnum {
  ACTIVATE,
  BUY,
  MINT,
  END,
  NONE,
}
