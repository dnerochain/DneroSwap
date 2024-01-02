import { dneroTokens } from '@dneroswap/tokens'
import { ERC20Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'

export const WALLCHAIN_ENABLED = true

export const WallchainKeys = {
  bsc: process.env.NEXT_PUBLIC_WALLCHAIN_DNERO_KEY,
} as { [key: string]: string }

export const WallchainTokens = [
  new ERC20Token(ChainId.DNERO, '0xC9882dEF23bc42D53895b8361D0b1EDC7570Bc6A', 18, 'FIST'),
  dneroTokens.raca,
  dneroTokens.rdnt,
  dneroTokens.mbox,
  dneroTokens.link,
  dneroTokens.xrp,
]
