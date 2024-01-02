import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseDTOKEN = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedDTOKEN: betResponse.claimedDTOKEN ? parseFloat(betResponse.claimedDTOKEN) : 0,
    claimedNetDTOKEN: betResponse.claimedNetDTOKEN ? parseFloat(betResponse.claimedNetDTOKEN) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseDTOKEN(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseDTOKEN)
  }

  return bet
}

export const transformUserResponseDTOKEN = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalDTOKEN, totalDTOKENBull, totalDTOKENBear, totalDTOKENClaimed, averageDTOKEN, netDTOKEN } = userResponse || {}

  return {
    ...baseUserResponse,
    totalDTOKEN: totalDTOKEN ? parseFloat(totalDTOKEN) : 0,
    totalDTOKENBull: totalDTOKENBull ? parseFloat(totalDTOKENBull) : 0,
    totalDTOKENBear: totalDTOKENBear ? parseFloat(totalDTOKENBear) : 0,
    totalDTOKENClaimed: totalDTOKENClaimed ? parseFloat(totalDTOKENClaimed) : 0,
    averageDTOKEN: averageDTOKEN ? parseFloat(averageDTOKEN) : 0,
    netDTOKEN: netDTOKEN ? parseFloat(netDTOKEN) : 0,
  }
}
