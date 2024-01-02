import { ChainId } from '@dneroswap/chains'

import { WDNERO_FLEXIBLE_SIDE_VAULT, WDNERO_VAULT } from '../constants/contracts'
import { getContractAddress } from '../utils'

export function getWDneroFlexibleSideVaultAddress(chainId: ChainId) {
  return getContractAddress(WDNERO_FLEXIBLE_SIDE_VAULT, chainId)
}

export function getWDneroVaultAddress(chainId: ChainId) {
  return getContractAddress(WDNERO_VAULT, chainId)
}
