import { ChainId } from '@dneroswap/chains'

import {
  SupportedChainId,
  SUPPORTED_CHAIN_IDS,
  WDneroVaultSupportedChainId,
  WDNERO_VAULT_SUPPORTED_CHAINS,
} from '../constants/supportedChains'

export function isPoolsSupported(chainId: number): chainId is SupportedChainId {
  return SUPPORTED_CHAIN_IDS.includes(chainId)
}

export function isWDneroVaultSupported(chainId?: ChainId): chainId is WDneroVaultSupportedChainId {
  return !!chainId && (WDNERO_VAULT_SUPPORTED_CHAINS as readonly ChainId[]).includes(chainId)
}
