import { Token } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'

// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>
