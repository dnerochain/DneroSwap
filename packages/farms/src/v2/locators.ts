import { WDTOKEN } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { BUSD } from '@dneroswap/tokens'
import { equalsIgnoreCase } from '@dneroswap/utils/equalsIgnoreCase'
import { FarmData } from '../types'

/**
 * Returns the first farm with a quote token that matches from an array of preferred quote tokens
 * @param farms Array of farms
 * @param tokenAddress LP token address
 * @param preferredQuoteTokensAddress Array of preferred quote tokens
 * @returns A preferred farm, if found - or the first element of the farms array
 */
export const getFarmFromTokenAddress = (
  farms: FarmData[],
  tokenAddress: string,
  preferredQuoteTokensAddress: string[] = [BUSD[ChainId.DNERO].address, WDTOKEN[ChainId.DNERO].address],
): FarmData => {
  const farmsWithToken = farms.filter((farm) => equalsIgnoreCase(farm.token.address, tokenAddress))
  const filteredFarm = farmsWithToken.find((farm) => {
    return preferredQuoteTokensAddress.some((quoteTokenAddress) => {
      return equalsIgnoreCase(farm.quoteToken.address, quoteTokenAddress)
    })
  })
  return filteredFarm || farmsWithToken[0]
}
