import { Bet, PredictionUser } from 'state/types'
import { transformRoundResponseToken, transformUserResponseToken, transformBetResponseToken } from './tokenTransformers'

export const transformBetResponseWDNERO = (betResponse): Bet => {
  const baseBet = transformBetResponseToken(betResponse)
  const bet = {
    ...baseBet,
    claimedDTOKEN: betResponse.claimedWDNERO ? parseFloat(betResponse.claimedWDNERO) : 0,
    claimedNetDTOKEN: betResponse.claimedNetWDNERO ? parseFloat(betResponse.claimedNetWDNERO) : 0,
  } as Bet

  if (betResponse.user) {
    bet.user = transformUserResponseWDNERO(betResponse.user)
  }

  if (betResponse.round) {
    bet.round = transformRoundResponseToken(betResponse.round, transformBetResponseWDNERO)
  }

  return bet
}

export const transformUserResponseWDNERO = (userResponse): PredictionUser => {
  const baseUserResponse = transformUserResponseToken(userResponse)
  const { totalWDNERO, totalWDNEROBull, totalWDNEROBear, totalWDNEROClaimed, averageWDNERO, netWDNERO } = userResponse || {}

  return {
    ...baseUserResponse,
    totalDTOKEN: totalWDNERO ? parseFloat(totalWDNERO) : 0,
    totalDTOKENBull: totalWDNEROBull ? parseFloat(totalWDNEROBull) : 0,
    totalDTOKENBear: totalWDNEROBear ? parseFloat(totalWDNEROBear) : 0,
    totalDTOKENClaimed: totalWDNEROClaimed ? parseFloat(totalWDNEROClaimed) : 0,
    averageDTOKEN: averageWDNERO ? parseFloat(averageWDNERO) : 0,
    netDTOKEN: netWDNERO ? parseFloat(netWDNERO) : 0,
  }
}
