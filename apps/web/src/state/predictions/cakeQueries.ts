import { UserResponse, BetResponse, RoundResponse } from './responseType'

export interface UserResponseWDNERO extends UserResponse<BetResponseWDNERO> {
  totalWDNERO: string
  totalWDNEROBull: string
  totalWDNEROBear: string
  averageWDNERO: string
  totalWDNEROClaimed: string
  netWDNERO: string
}

export interface BetResponseWDNERO extends BetResponse {
  claimedWDNERO: string
  claimedNetWDNERO: string
  user?: UserResponseWDNERO
  round?: RoundResponseWDNERO
}

export type RoundResponseWDNERO = RoundResponse<BetResponseWDNERO>

/**
 * Base fields are the all the top-level fields available in the api. Used in multiple queries
 */
export const roundBaseFields = `
  id
  epoch
  position
  failed
  startAt
  startBlock
  startHash
  lockAt
  lockBlock
  lockHash
  lockPrice
  lockRoundId
  closeAt
  closeBlock
  closeHash
  closePrice
  closeRoundId
  totalBets
  totalAmount
  bullBets
  bullAmount
  bearBets
  bearAmount
`

export const betBaseFields = `
 id
 hash  
 amount
 position
 claimed
 claimedAt
 claimedHash
 claimedBlock
 claimedWDNERO
 claimedNetWDNERO
 createdAt
 updatedAt
`

export const userBaseFields = `
  id
  createdAt
  updatedAt
  block
  totalBets
  totalBetsBull
  totalBetsBear
  totalWDNERO
  totalWDNEROBull
  totalWDNEROBear
  totalBetsClaimed
  totalWDNEROClaimed
  winRate
  averageWDNERO
  netWDNERO
`
