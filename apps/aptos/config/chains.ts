import { defaultChain } from '@dneroswap/awgmi'
import { mainnet, testnet, Chain } from '@dneroswap/awgmi/core'

export { defaultChain }

export const chains = [mainnet, testnet].filter(Boolean) as Chain[]
