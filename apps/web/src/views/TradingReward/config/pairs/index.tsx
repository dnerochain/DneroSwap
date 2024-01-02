import { ChainId } from '@dneroswap/chains'
import { farmsV3 as arbitrumFarm } from '@dneroswap/farms/constants/arb'
import { farmsV3 as baseFarm } from '@dneroswap/farms/constants/base'
import { farmsV3 as dneroFarm } from '@dneroswap/farms/constants/dnero'
import { farmsV3 as farm97 } from '@dneroswap/farms/constants/dneroTestnet'
import { farmsV3 as ethFarm } from '@dneroswap/farms/constants/eth'
import { farmsV3 as farm5 } from '@dneroswap/farms/constants/goerli'
import { farmsV3 as lineaFarm } from '@dneroswap/farms/constants/linea'
import { farmsV3 as opDNEROFarms } from '@dneroswap/farms/constants/opDNERO'
import { farmsV3 as opDNEROTestnetFarms } from '@dneroswap/farms/constants/opDneroTestnet'
import { farmsV3 as zkEvmFarm } from '@dneroswap/farms/constants/polygonZkEVM'
import { farmsV3 as zkSyncFarm } from '@dneroswap/farms/constants/zkSync'
import { ComputedFarmConfigV3, FarmV3SupportedChainId } from '@dneroswap/farms/src'
import { tradingRewardV3Pair as tradingRewardV3Pair56 } from './56'

export const tradingRewardPairConfigChainMap: Record<FarmV3SupportedChainId, ComputedFarmConfigV3[]> = {
  [ChainId.ETHEREUM]: ethFarm,
  [ChainId.GOERLI]: farm5,
  [ChainId.DNERO]: [...dneroFarm, ...tradingRewardV3Pair56],
  [ChainId.DNERO_TESTNET]: farm97,
  [ChainId.POLYGON_ZKEVM]: zkEvmFarm,
  [ChainId.POLYGON_ZKEVM_TESTNET]: [],
  [ChainId.ZKSYNC]: zkSyncFarm,
  [ChainId.ZKSYNC_TESTNET]: [],
  [ChainId.ARBITRUM_ONE]: arbitrumFarm,
  [ChainId.LINEA]: lineaFarm,
  [ChainId.BASE]: baseFarm,
  [ChainId.OPDNERO_TESTNET]: opDNEROTestnetFarms,
  [ChainId.OPDNERO]: opDNEROFarms,
}
