import { Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import SwapWarningTokens from 'config/constants/swapWarningTokens'

const shouldShowSwapWarning = (chainId: ChainId | undefined, swapCurrency: Token): boolean => {
  if (chainId && SwapWarningTokens[chainId]) {
    const swapWarningTokens = Object.values(SwapWarningTokens[chainId])
    return swapWarningTokens.some((warningToken) => warningToken.equals(swapCurrency))
  }

  return false
}

export default shouldShowSwapWarning
