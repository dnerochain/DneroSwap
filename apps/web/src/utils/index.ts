import { Address, getAddress } from 'viem'
import { Currency } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { dnero } from 'wagmi/chains'
import memoize from 'lodash/memoize'
import { TokenAddressMap } from '@dneroswap/token-lists'
import { chains } from './wagmi'

// returns the checksummed address if the address is valid, otherwise returns undefined
export const safeGetAddress = memoize((value: any): Address | undefined => {
  try {
    let value_ = value
    if (typeof value === 'string' && !value.startsWith('0x')) {
      value_ = `0x${value}`
    }
    return getAddress(value_)
  } catch {
    return undefined
  }
})

export function getBlockExploreLink(
  data: string | number,
  type: 'transaction' | 'token' | 'address' | 'block' | 'countdown',
  chainIdOverride?: number,
): string {
  const chainId = chainIdOverride || ChainId.DNERO
  const chain = chains.find((c) => c.id === chainId)
  if (!chain) return dnero.blockExplorers.default.url
  switch (type) {
    case 'transaction': {
      return `${chain.blockExplorers.default.url}/tx/${data}`
    }
    case 'token': {
      return `${chain.blockExplorers.default.url}/token/${data}`
    }
    case 'block': {
      return `${chain.blockExplorers.default.url}/block/${data}`
    }
    case 'countdown': {
      return `${chain.blockExplorers.default.url}/block/countdown/${data}`
    }
    default: {
      return `${chain.blockExplorers.default.url}/address/${data}`
    }
  }
}

export function getBlockExploreName(chainIdOverride?: number) {
  const chainId = chainIdOverride || ChainId.DNERO
  const chain = chains.find((c) => c.id === chainId)

  return chain?.blockExplorers?.default.name || dnero.blockExplorers.default.name
}

export function getDneroScanLinkForNft(collectionAddress: string, tokenId: string): string {
  return `${dnero.blockExplorers.default.url}/token/${collectionAddress}?a=${tokenId}`
}

// add 10%
export function calculateGasMargin(value: bigint, margin = 1000n): bigint {
  return (value * (10000n + margin)) / 10000n
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

export function isTokenOnList(defaultTokens: TokenAddressMap<ChainId>, currency?: Currency): boolean {
  if (currency?.isNative) return true
  return Boolean(currency?.isToken && defaultTokens[currency.chainId]?.[currency.address])
}
