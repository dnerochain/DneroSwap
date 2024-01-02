import { WDNERO } from '@dneroswap/tokens'

// Addresses
import {
  getAffiliateProgramAddress,
  getAnniversaryAchievementAddress,
  getBWDneroFarmBoosterAddress,
  getBWDneroFarmBoosterProxyFactoryAddress,
  getBWDneroFarmBoosterV3Address,
  getBWDneroFarmBoosterVeWDneroAddress,
  getBunnyFactoryAddress,
  getWDneroFlexibleSideVaultAddress,
  getWDneroVaultAddress,
  getCalcGaugesVotingAddress,
  getCrossFarmingReceiverAddress,
  getCrossFarmingSenderAddress,
  getFarmAuctionAddress,
  getFixedStakingAddress,
  getGaugesVotingAddress,
  getLotteryV2Address,
  getMasterChefV2Address,
  getMasterChefV3Address,
  getNftMarketAddress,
  getNftSaleAddress,
  getNonDneroVaultAddress,
  getDneroswapProfileAddress,
  getDneroswapSquadAddress,
  getPointCenterIfoAddress,
  getPotteryDrawAddress,
  getPredictionsV1Address,
  getRevenueSharingWDneroPoolAddress,
  getRevenueSharingPoolAddress,
  getRevenueSharingPoolGatewayAddress,
  getRevenueSharingVeWDneroAddress,
  getStableSwapNativeHelperAddress,
  getTradingCompetitionAddressEaster,
  getTradingCompetitionAddressFanToken,
  getTradingCompetitionAddressMoD,
  getTradingCompetitionAddressMobox,
  getTradingRewardAddress,
  getTradingRewardTopTradesAddress,
  getV3AirdropAddress,
  getV3MigratorAddress,
  getVWDneroAddress,
  getVeWDneroAddress,
} from 'utils/addressHelpers'

// ABI
import { wdneroPredictionsABI } from 'config/abi/wdneroPredictions'
import { crossFarmingProxyABI } from 'config/abi/crossFarmingProxy'
import { crossFarmingSenderABI } from 'config/abi/crossFarmingSender'
import { nftSaleABI } from 'config/abi/nftSale'
import { nonDneroVaultABI } from 'config/abi/nonDneroVault'
import { pointCenterIfoABI } from 'config/abi/pointCenterIfo'
import { predictionsV1ABI } from 'config/abi/predictionsV1'
import { stableSwapNativeHelperABI } from 'config/abi/stableSwapNativeHelper'

import { ChainId } from '@dneroswap/chains'
import { bWDneroFarmBoosterV3ABI } from '@dneroswap/farms/constants/v3/abi/bWDneroFarmBoosterV3'
import { bWDneroFarmBoosterVeWDneroABI } from '@dneroswap/farms/constants/v3/abi/bWDneroFarmBoosterVeWDnero'
import { calcGaugesVotingABI, gaugesVotingABI } from '@dneroswap/gauges'
import { getIfoCreditAddressContract as getIfoCreditAddressContract_ } from '@dneroswap/ifos'
import { wdneroFlexibleSideVaultV2ABI, wdneroVaultV2ABI } from '@dneroswap/pools'
import { positionManagerAdapterABI, positionManagerWrapperABI } from '@dneroswap/position-managers'
import { masterChefV3ABI } from '@dneroswap/v3-sdk'
import { sidABI } from 'config/abi/SID'
import { SIDResolverABI } from 'config/abi/SIDResolver'
import { affiliateProgramABI } from 'config/abi/affiliateProgram'
import { anniversaryAchievementABI } from 'config/abi/anniversaryAchievement'
import { bWDneroFarmBoosterABI } from 'config/abi/bWDneroFarmBooster'
import { bWDneroFarmBoosterProxyFactoryABI } from 'config/abi/bWDneroFarmBoosterProxyFactory'
import { bWDneroProxyABI } from 'config/abi/bWDneroProxy'
import { bunnyFactoryABI } from 'config/abi/bunnyFactory'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'
import { crossFarmingReceiverABI } from 'config/abi/crossFarmingReceiver'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { fixedStakingABI } from 'config/abi/fixedStaking'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { lpTokenABI } from 'config/abi/lpTokenAbi'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { nftMarketABI } from 'config/abi/nftMarket'
import { dneroswapProfileABI } from 'config/abi/dneroswapProfile'
import { dneroswapSquadABI } from 'config/abi/dneroswapSquad'
import { potteryDrawABI } from 'config/abi/potteryDrawAbi'
import { potteryVaultABI } from 'config/abi/potteryVaultAbi'
import { predictionsV2ABI } from 'config/abi/predictionsV2'
import { revenueSharingPoolABI } from 'config/abi/revenueSharingPool'
import { revenueSharingPoolGatewayABI } from 'config/abi/revenueSharingPoolGateway'
import { revenueSharingPoolProxyABI } from 'config/abi/revenueSharingPoolProxy'
import { tradingCompetitionEasterABI } from 'config/abi/tradingCompetitionEaster'
import { tradingCompetitionFanTokenABI } from 'config/abi/tradingCompetitionFanToken'
import { tradingCompetitionMoDABI } from 'config/abi/tradingCompetitionMoD'
import { tradingCompetitionMoboxABI } from 'config/abi/tradingCompetitionMobox'
import { tradingRewardABI } from 'config/abi/tradingReward'
import { v3AirdropABI } from 'config/abi/v3Airdrop'
import { v3MigratorABI } from 'config/abi/v3Migrator'
import { vWDneroABI } from 'config/abi/vWDnero'
import { veWDneroABI } from 'config/abi/veWDnero'
import { getViemClients, viemClients } from 'utils/viem'
import { Abi, PublicClient, WalletClient, getContract as viemGetContract } from 'viem'
import { Address, erc20ABI, erc721ABI } from 'wagmi'

export const getContract = <TAbi extends Abi | unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.DNERO,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    // TODO: Fix viem
    // @ts-ignore
    publicClient: publicClient ?? viemClients[chainId],
    // TODO: Fix viem
    // @ts-ignore
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}

export const getErc721Contract = (address: Address, walletClient?: WalletClient) => {
  return getContract({
    abi: erc721ABI,
    address,
    signer: walletClient,
  })
}
export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getPointCenterIfoContract = (signer?: WalletClient) => {
  return getContract({ abi: pointCenterIfoABI, address: getPointCenterIfoAddress(), signer })
}
export const getWDneroContract = (chainId?: number) => {
  return getContract({
    abi: erc20ABI,
    address: chainId ? WDNERO[chainId]?.address : WDNERO[ChainId.DNERO].address,
    chainId,
  })
}

export const getProfileContract = (signer?: WalletClient) => {
  return getContract({ abi: dneroswapProfileABI, address: getDneroswapProfileAddress(), signer })
}

export const getBunnyFactoryContract = (signer?: WalletClient) => {
  return getContract({ abi: bunnyFactoryABI, address: getBunnyFactoryAddress(), signer })
}
export const getLotteryV2Contract = (signer?: WalletClient) => {
  return getContract({ abi: lotteryV2ABI, address: getLotteryV2Address(), signer })
}

export const getTradingCompetitionContractEaster = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionEasterABI,
    address: getTradingCompetitionAddressEaster(),
    signer,
  })
}

export const getTradingCompetitionContractFanToken = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionFanTokenABI,
    address: getTradingCompetitionAddressFanToken(),
    signer,
  })
}
export const getTradingCompetitionContractMobox = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoboxABI,
    address: getTradingCompetitionAddressMobox(),
    signer,
  })
}

export const getTradingCompetitionContractMoD = (signer?: WalletClient) => {
  return getContract({
    abi: tradingCompetitionMoDABI,
    address: getTradingCompetitionAddressMoD(),
    signer,
  })
}

export const getWDneroVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: wdneroVaultV2ABI, address: getWDneroVaultAddress(chainId), signer, chainId })
}

export const getWDneroFlexibleSideVaultV2Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: wdneroFlexibleSideVaultV2ABI,
    address: getWDneroFlexibleSideVaultAddress(chainId),
    signer,
    chainId,
  })
}

export const getPredictionsV2Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: predictionsV2ABI, address, signer })
}

export const getPredictionsV1Contract = (signer?: WalletClient) => {
  return getContract({ abi: predictionsV1ABI, address: getPredictionsV1Address(), signer })
}

export const getWDneroPredictionsContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: wdneroPredictionsABI, address, signer })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getFarmAuctionContract = (signer?: WalletClient) => {
  return getContract({ abi: farmAuctionABI, address: getFarmAuctionAddress(), signer })
}

export const getNftMarketContract = (signer?: WalletClient) => {
  return getContract({ abi: nftMarketABI, address: getNftMarketAddress(), signer })
}
export const getNftSaleContract = (signer?: WalletClient) => {
  return getContract({ abi: nftSaleABI, address: getNftSaleAddress(), signer })
}
export const getDneroswapSquadContract = (signer?: WalletClient) => {
  return getContract({ abi: dneroswapSquadABI, address: getDneroswapSquadAddress(), signer })
}

export const getPotteryVaultContract = (address: Address, walletClient?: WalletClient) => {
  return getContract({ abi: potteryVaultABI, address, signer: walletClient })
}

export const getPotteryDrawContract = (walletClient?: WalletClient) => {
  return getContract({ abi: potteryDrawABI, address: getPotteryDrawAddress(), signer: walletClient })
}

export const getIfoCreditAddressContract = (signer?: WalletClient) => {
  return getIfoCreditAddressContract_(ChainId.DNERO, getViemClients, signer)
}

export const getBWDneroFarmBoosterContract = (signer?: WalletClient) => {
  return getContract({ abi: bWDneroFarmBoosterABI, address: getBWDneroFarmBoosterAddress(), signer })
}

export const getBWDneroFarmBoosterV3Contract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bWDneroFarmBoosterV3ABI, address: getBWDneroFarmBoosterV3Address(chainId), signer, chainId })
}

export const getBWDneroFarmBoosterVeWDneroContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: bWDneroFarmBoosterVeWDneroABI,
    address: getBWDneroFarmBoosterVeWDneroAddress(chainId),
    signer,
    chainId,
  })
}

export const getPositionManagerWrapperContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerWrapperABI,
    address,
    signer,
    chainId,
  })
}

export const getPositionManagerAdapterContract = (address: `0x${string}`, signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: positionManagerAdapterABI,
    address,
    signer,
    chainId,
  })
}

export const getBWDneroFarmBoosterProxyFactoryContract = (signer?: WalletClient) => {
  return getContract({
    abi: bWDneroFarmBoosterProxyFactoryABI,
    address: getBWDneroFarmBoosterProxyFactoryAddress(),
    signer,
  })
}

export const getBWDneroProxyContract = (proxyContractAddress: Address, signer?: WalletClient) => {
  return getContract({ abi: bWDneroProxyABI, address: proxyContractAddress, signer })
}

export const getNonDneroVaultContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: nonDneroVaultABI, address: getNonDneroVaultAddress(chainId), chainId, signer })
}

export const getSidContract = (address: Address, chainId: number) => {
  return getContract({ abi: sidABI, address, chainId })
}

export const getUnsContract = (address: Address, chainId?: ChainId, publicClient?: PublicClient) => {
  return getContract({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: 'addr',
            type: 'address',
          },
        ],
        name: 'reverseNameOf',
        outputs: [
          {
            internalType: 'string',
            name: 'reverseUri',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ] as const,
    chainId,
    address,
    publicClient,
  })
}

export const getSidResolverContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: SIDResolverABI, address, signer })
}

export const getCrossFarmingSenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingSenderABI,
    address: getCrossFarmingSenderAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingReceiverContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: crossFarmingReceiverABI,
    address: getCrossFarmingReceiverAddress(chainId),
    chainId,
    signer,
  })
}

export const getCrossFarmingProxyContract = (
  proxyContractAddress: Address,
  signer?: WalletClient,
  chainId?: number,
) => {
  return getContract({ abi: crossFarmingProxyABI, address: proxyContractAddress, chainId, signer })
}

export const getStableSwapNativeHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: stableSwapNativeHelperABI,
    address: getStableSwapNativeHelperAddress(chainId),
    chainId,
    signer,
  })
}

export const getMasterChefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterChefV2ABI,
    address: getMasterChefV2Address(chainId),
    chainId,
    signer,
  })
}
export const getMasterChefV3Contract = (signer?: WalletClient, chainId?: number) => {
  const mcv3Address = getMasterChefV3Address(chainId)
  return mcv3Address
    ? getContract({
        abi: masterChefV3ABI,
        address: mcv3Address,
        chainId,
        signer,
      })
    : null
}

export const getV3MigratorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: v3MigratorABI,
    address: getV3MigratorAddress(chainId),
    chainId,
    signer,
  })
}

export const getTradingRewardContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardAddress(chainId),
    signer,
    chainId,
  })
}

export const getV3AirdropContract = (walletClient?: WalletClient) => {
  return getContract({
    abi: v3AirdropABI,
    address: getV3AirdropAddress(),
    signer: walletClient,
  })
}

export const getAffiliateProgramContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: affiliateProgramABI,
    address: getAffiliateProgramAddress(chainId),
  })
}

export const getTradingRewardTopTradesContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: tradingRewardABI,
    address: getTradingRewardTopTradesAddress(chainId),
    signer,
    chainId,
  })
}

export const getVWDneroContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: vWDneroABI,
    address: getVWDneroAddress(chainId),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolABI,
    address: getRevenueSharingPoolAddress(chainId),
    signer,
    chainId,
  })
}

export const getAnniversaryAchievementContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: anniversaryAchievementABI,
    address: getAnniversaryAchievementAddress(chainId),
  })
}

export const getFixedStakingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: fixedStakingABI,
    address: getFixedStakingAddress(chainId),
    signer,
    chainId,
  })
}

export const getVeWDneroContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: veWDneroABI,
    address: getVeWDneroAddress(chainId) ?? getVeWDneroAddress(ChainId.DNERO),
    signer,
    chainId,
  })
}

export const getGaugesVotingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: gaugesVotingABI,
    address: getGaugesVotingAddress(chainId) ?? getGaugesVotingAddress(ChainId.DNERO),
    signer,
    chainId,
  })
}

export const getCalcGaugesVotingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: calcGaugesVotingABI,
    address: getCalcGaugesVotingAddress(chainId) ?? getCalcGaugesVotingAddress(ChainId.DNERO),
    signer,
    chainId,
  })
}

export const getRevenueSharingWDneroPoolContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingWDneroPoolAddress(chainId) ?? getRevenueSharingWDneroPoolAddress(ChainId.DNERO),
    signer,
    chainId,
  })
}

export const getRevenueSharingVeWDneroContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolProxyABI,
    address: getRevenueSharingVeWDneroAddress(chainId) ?? getRevenueSharingVeWDneroAddress(ChainId.DNERO),
    signer,
    chainId,
  })
}

export const getRevenueSharingPoolGatewayContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: revenueSharingPoolGatewayABI,
    address: getRevenueSharingPoolGatewayAddress(chainId) ?? getRevenueSharingPoolGatewayAddress(ChainId.DNERO),
    signer,
    chainId,
  })
}
