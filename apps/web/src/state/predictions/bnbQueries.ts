import { UserResponse, BetResponse, RoundResponse } from './responseType'

export interface UserResponseDTOKEN extends UserResponse<BetResponseDTOKEN> {
  totalDTOKEN: string
  totalDTOKENBull: string
  totalDTOKENBear: string
  averageDTOKEN: string
  totalDTOKENClaimed: string
  netDTOKEN: string
}

export interface BetResponseDTOKEN extends BetResponse {
  claimedDTOKEN: string
  claimedNetDTOKEN: string
  user?: UserResponseDTOKEN
  round?: RoundResponseDTOKEN
}

export type RoundResponseDTOKEN = RoundResponse<BetResponseDTOKEN>

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
 claimedDTOKEN
 claimedNetDTOKEN
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
  totalDTOKEN
  totalDTOKENBull
  totalDTOKENBear
  totalBetsClaimed
  totalDTOKENClaimed
  winRate
  averageDTOKEN
  netDTOKEN
`
