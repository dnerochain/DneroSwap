import { dneroTestnetTokens } from '@dneroswap/tokens'
import { getAddress } from 'viem'

import { PoolCategory, SerializedPool } from '../../types'

export const livePools: SerializedPool[] = [
  {
    sousId: 0,
    stakingToken: dneroTestnetTokens.wdnero2,
    earningToken: dneroTestnetTokens.wdnero2,
    contractAddress: '0xf6B427A2Df6E24600e3e3c62634B7c478826619D',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.01',
    isFinished: false,
  },
  {
    sousId: 1,
    stakingToken: dneroTestnetTokens.wdnero2,
    earningToken: dneroTestnetTokens.mockA,
    contractAddress: '0xe7080E3afDfF2322080B5ba85700FE41287D864B',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
  },
  {
    sousId: 2,
    stakingToken: dneroTestnetTokens.mockA,
    earningToken: dneroTestnetTokens.mockB,
    contractAddress: '0x31a069925fB770202b302C7911AF1ACBe0395420',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
  },
  {
    sousId: 3,
    stakingToken: dneroTestnetTokens.wdtoken,
    earningToken: dneroTestnetTokens.wdnero2,
    contractAddress: '0x550d3a43D5CB57E70dD1F53699CEaA0f371ADbBb',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.01',
  },
  {
    sousId: 5,
    stakingToken: dneroTestnetTokens.msix,
    earningToken: dneroTestnetTokens.wdnero2,
    contractAddress: '0xf45c9e61318006Dc31CA4993b8ab75E611fe0792',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.0001',
  },
  {
    sousId: 6,
    stakingToken: dneroTestnetTokens.wdnero2,
    earningToken: dneroTestnetTokens.msix,
    contractAddress: '0xeB019927EB2d79b6A03B728a6f7A9020f3e2E25f',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '1',
  },
  {
    sousId: 7,
    stakingToken: dneroTestnetTokens.wdnero2,
    earningToken: dneroTestnetTokens.msix,
    contractAddress: '0xd41F619f2f2E91F77054877Ed1a47661f290d19e',
    poolCategory: PoolCategory.CORE,
    tokenPerSecond: '0.1',
  },
].map((p) => ({
  ...p,
  contractAddress: getAddress(p.contractAddress, 97),
  stakingToken: p.stakingToken.serialize,
  earningToken: p.earningToken.serialize,
}))

// known finished pools
export const finishedPools: SerializedPool[] = []

export const pools: SerializedPool[] = [...livePools, ...finishedPools]
