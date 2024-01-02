import { ChainId } from '@dneroswap/chains'
import { bWDneroFarmBoosterV3Address, bWDneroFarmBoosterVeWDneroAddress } from '@dneroswap/farms/constants/v3'
import addresses from 'config/constants/contracts'
import { VaultKey } from 'state/types'
import { Address } from 'viem'

export type Addresses = {
  [chainId in ChainId]?: Address
}

export const getAddressFromMap = (address: Addresses, chainId?: number): `0x${string}` => {
  return chainId && address[chainId] ? address[chainId] : address[ChainId.DNERO]
}

export const getAddressFromMapNoFallback = (address: Addresses, chainId?: number): `0x${string}` | null => {
  return chainId ? address[chainId] : null
}

export const getMasterChefV2Address = (chainId?: number) => {
  return getAddressFromMap(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall, chainId)
}
export const getLotteryV2Address = () => {
  return getAddressFromMap(addresses.lotteryV2)
}
export const getDneroswapProfileAddress = () => {
  return getAddressFromMap(addresses.dneroswapProfile)
}
export const getDneroswapBunniesAddress = () => {
  return getAddressFromMap(addresses.dneroswapBunnies)
}
export const getBunnyFactoryAddress = () => {
  return getAddressFromMap(addresses.bunnyFactory)
}
export const getPredictionsV1Address = () => {
  return getAddressFromMap(addresses.predictionsV1)
}
export const getPointCenterIfoAddress = () => {
  return getAddressFromMap(addresses.pointCenterIfo)
}
export const getTradingCompetitionAddressEaster = () => {
  return getAddressFromMap(addresses.tradingCompetitionEaster)
}
export const getTradingCompetitionAddressFanToken = () => {
  return getAddressFromMap(addresses.tradingCompetitionFanToken)
}

export const getTradingCompetitionAddressMobox = () => {
  return getAddressFromMap(addresses.tradingCompetitionMobox)
}

export const getTradingCompetitionAddressMoD = () => {
  return getAddressFromMap(addresses.tradingCompetitionMoD)
}

export const getVaultPoolAddress = (vaultKey: VaultKey, chainId?: ChainId) => {
  if (!vaultKey) {
    return null
  }
  return getAddressFromMap(addresses[vaultKey], chainId)
}

export const getWDneroVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.wdneroVault, chainId)
}

export const getWDneroFlexibleSideVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.wdneroFlexibleSideVault, chainId)
}

export const getFarmAuctionAddress = () => {
  return getAddressFromMap(addresses.farmAuction)
}

export const getNftMarketAddress = () => {
  return getAddressFromMap(addresses.nftMarket)
}
export const getNftSaleAddress = () => {
  return getAddressFromMap(addresses.nftSale)
}
export const getDneroswapSquadAddress = () => {
  return getAddressFromMap(addresses.dneroswapSquad)
}
export const getPotteryDrawAddress = () => {
  return getAddressFromMap(addresses.potteryDraw)
}

export const getZapAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.zap, chainId)
}

export const getBWDneroFarmBoosterAddress = () => {
  return getAddressFromMap(addresses.bWDneroFarmBooster)
}

export const getBWDneroFarmBoosterV3Address = (chainId?: number) => {
  return getAddressFromMap(bWDneroFarmBoosterV3Address, chainId)
}

export const getBWDneroFarmBoosterVeWDneroAddress = (chainId?: number) => {
  return getAddressFromMap(bWDneroFarmBoosterVeWDneroAddress, chainId)
}

export const getBWDneroFarmBoosterProxyFactoryAddress = () => {
  return getAddressFromMap(addresses.bWDneroFarmBoosterProxyFactory)
}

export const getNonDneroVaultAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.nonDneroVault, chainId)
}

export const getCrossFarmingSenderAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingSender, chainId)
}

export const getCrossFarmingReceiverAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.crossFarmingReceiver, chainId)
}

export const getStableSwapNativeHelperAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.stableSwapNativeHelper, chainId)
}

export const getMasterChefV3Address = (chainId?: number) => {
  return getAddressFromMapNoFallback(addresses.masterChefV3, chainId)
}

export const getV3MigratorAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Migrator, chainId)
}

export const getTradingRewardAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingReward, chainId)
}

export const getV3AirdropAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.v3Airdrop, chainId)
}

export const getAffiliateProgramAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.affiliateProgram, chainId)
}

export const getTradingRewardTopTradesAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.tradingRewardTopTrades, chainId)
}

export const getVWDneroAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.vWDnero, chainId)
}

export const getRevenueSharingPoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPool, chainId)
}

export const getAnniversaryAchievementAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.anniversaryAchievement, chainId)
}

export const getFixedStakingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.fixedStaking, chainId)
}

export const getVeWDneroAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.veWDnero, chainId)
}

export const getGaugesVotingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gaugesVoting, chainId)
}

export const getCalcGaugesVotingAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.gaugesVotingCalc, chainId)
}

export const getRevenueSharingWDneroPoolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingWDneroPool, chainId)
}

export const getRevenueSharingVeWDneroAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingVeWDnero, chainId)
}

export const getRevenueSharingPoolGatewayAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.revenueSharingPoolGateway, chainId)
}
