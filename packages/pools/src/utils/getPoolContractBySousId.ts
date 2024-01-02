import { ChainId } from '@dneroswap/chains'
import { WalletClient, getContract, PublicClient, Address, GetContractReturnType, Account, Chain } from 'viem'

import { getPoolsConfig } from '../constants'
import { isLegacyPool } from './isLegacyPool'
import { smartChefABI } from '../abis/ISmartChef'
import { PoolCategory } from '../types'
import { sousChefV2ABI } from '../abis/ISousChefV2'
import { sousChefDTokenABI } from '../abis/ISousChefDTOKEN'

interface Params {
  chainId?: ChainId
  sousId: number
  signer?: any
  publicClient?: any
}

type GetContractReturnType_<TAbi extends readonly unknown[]> = GetContractReturnType<TAbi, any, any> & {
  abi: TAbi
  address: Address
  account?: Account
  chain?: Chain
}

export function getSousChefDTOKENContract({
  address,
  signer,
  publicClient,
}: {
  address: Address
  signer?: WalletClient
  publicClient?: PublicClient
}): GetContractReturnType_<typeof sousChefDTokenABI> {
  return {
    ...getContract({
      abi: sousChefDTokenABI,
      address,
      walletClient: signer,
      publicClient,
    }),
    abi: sousChefDTokenABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export function getSousChefV2Contract({
  address,
  signer,
  publicClient,
}: {
  address: Address
  signer?: WalletClient
  publicClient?: PublicClient
}): GetContractReturnType_<typeof sousChefV2ABI> {
  return {
    ...getContract({
      abi: sousChefV2ABI,
      address,
      walletClient: signer,
      publicClient,
    }),
    abi: sousChefV2ABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export function getSmartChefChefV2Contract({
  address,
  signer,
  publicClient,
}: {
  address: Address
  signer?: WalletClient
  publicClient?: PublicClient
}): GetContractReturnType_<typeof smartChefABI> {
  return {
    ...getContract({
      abi: smartChefABI,
      address,
      walletClient: signer,
      publicClient,
    }),
    abi: smartChefABI,
    address,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export function getPoolContractBySousId({ chainId, sousId, signer, publicClient }: Params): any | null {
  if (!chainId) {
    return null
  }
  const pools = getPoolsConfig(chainId)
  const pool = pools?.find((p) => p.sousId === Number(sousId))
  if (!pool) {
    return null
  }
  const { contractAddress } = pool
  if (isLegacyPool(pool)) {
    if (pool.poolCategory === PoolCategory.DNEROCHAIN) {
      return getSousChefDTOKENContract({ address: contractAddress, signer, publicClient })
    }
    return getSousChefV2Contract({ address: contractAddress, signer, publicClient })
  }
  return getSmartChefChefV2Contract({ address: contractAddress, signer, publicClient })
}
