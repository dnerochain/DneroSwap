import { ChainId } from '@dneroswap/chains'
import { Address } from 'viem'
import { FarmV3SupportedChainId } from '../../src'
import { ComputedFarmConfigV3 } from '../../src/types'
import { farmsV3 as arbFarms } from '../arb'
import { farmsV3 as baseFarms } from '../base'
import { farmsV3 as dneroFarms } from '../dnero'
import { farmsV3 as dneroTestnetFarms } from '../dneroTestnet'
import { farmsV3 as ethFarms } from '../eth'
import { farmsV3 as goerliFarms } from '../goerli'
import { farmsV3 as lineaFarms } from '../linea'
import { farmsV3 as opDNEROFarms } from '../opDNERO'
import { farmsV3 as opDneroTestnetFarms } from '../opDneroTestnet'
import { farmsV3 as polygonZkEVMFarms } from '../polygonZkEVM'
import { farmsV3 as polygonZkEVMTestnetFarms } from '../polygonZkEVMTestnet'
import { farmsV3 as zkSyncFarms } from '../zkSync'
import { farmsV3 as zkSyncTestnetFarms } from '../zkSyncTestnet'

export const farmsV3ConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: ethFarms,
  [ChainId.GOERLI]: goerliFarms,
  [ChainId.DNERO]: dneroFarms,
  [ChainId.DNERO_TESTNET]: dneroTestnetFarms,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetFarms,
  [ChainId.POLYGON_ZKEVM]: polygonZkEVMFarms,
  [ChainId.POLYGON_ZKEVM_TESTNET]: polygonZkEVMTestnetFarms,
  [ChainId.ZKSYNC]: zkSyncFarms,
  [ChainId.ARBITRUM_ONE]: arbFarms,
  [ChainId.LINEA]: lineaFarms,
  [ChainId.BASE]: baseFarms,
  [ChainId.OPDNERO_TESTNET]: opDneroTestnetFarms,
  [ChainId.OPDNERO]: opDNEROFarms,
}

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const bWDneroFarmBoosterV3Address: Addresses = {
  [ChainId.DNERO]: '0x695170faE243147b3bEB4C43AA8DE5DcD9202752',
  [ChainId.DNERO_TESTNET]: '0x56666300A1E25624489b661f3C6c456c159a109a',
}
export const bWDneroFarmBoosterVeWDneroAddress: Addresses = {
  [ChainId.DNERO]: '0x625F45234D6335859a8b940960067E89476300c6',
  [ChainId.DNERO_TESTNET]: '0x1F32591CC45f00BaE3A742Bf2bCAdAe59DbAd228',
}
