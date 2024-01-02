import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { easterPrizes, PrizesConfig } from 'config/constants/trading-competition/prizes'
import BigNumber from 'bignumber.js'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { dneroTokens } from '@dneroswap/tokens'
import { multiplyPriceByAmount } from 'utils/prices'
import { useWDneroPrice } from 'hooks/useWDneroPrice'

export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const useCompetitionWDneroRewards = (userWDneroReward: string | number) => {
  const wdneroAsBigNumber = new BigNumber(userWDneroReward as string)
  const wdneroBalance = getBalanceNumber(wdneroAsBigNumber)
  const wdneroPriceBusd = useWDneroPrice()
  return {
    wdneroReward: wdneroBalance,
    dollarValueOfWDneroReward: wdneroPriceBusd.multipliedBy(wdneroBalance).toNumber(),
  }
}

export const useFanTokenCompetitionRewards = ({
  userWDneroRewards,
  userLazioRewards,
  userPortoRewards,
  userSantosRewards,
}: {
  userWDneroRewards: string | number
  userLazioRewards: string | number
  userPortoRewards: string | number
  userSantosRewards: string | number
}) => {
  const lazioPriceBUSD = useStablecoinPrice(dneroTokens.lazio)
  const portoPriceBUSD = useStablecoinPrice(dneroTokens.porto)
  const santosPriceBUSD = useStablecoinPrice(dneroTokens.santos)
  const wdneroAsBigNumber = new BigNumber(userWDneroRewards as string)
  const lazioAsBigNumber = new BigNumber(userLazioRewards as string)
  const portoAsBigNumber = new BigNumber(userPortoRewards as string)
  const santosAsBigNumber = new BigNumber(userSantosRewards as string)
  const wdneroBalance = getBalanceNumber(wdneroAsBigNumber)
  const lazioBalance = getBalanceNumber(lazioAsBigNumber, 8)
  const portoBalance = getBalanceNumber(portoAsBigNumber, 8)
  const santosBalance = getBalanceNumber(santosAsBigNumber, 8)
  const wdneroPriceBusd = useWDneroPrice()

  const dollarValueOfTokensReward =
    wdneroPriceBusd && lazioPriceBUSD && portoPriceBUSD && santosPriceBUSD
      ? wdneroPriceBusd.multipliedBy(wdneroBalance).toNumber() +
        multiplyPriceByAmount(lazioPriceBUSD, lazioBalance, 8) +
        multiplyPriceByAmount(portoPriceBUSD, portoBalance, 8) +
        multiplyPriceByAmount(santosPriceBUSD, santosBalance, 8)
      : null

  return {
    wdneroReward: wdneroBalance,
    lazioReward: lazioBalance,
    portoReward: portoBalance,
    santosReward: santosBalance,
    dollarValueOfTokensReward,
  }
}

export const useMoboxCompetitionRewards = ({
  userWDneroRewards,
  userMoboxRewards,
}: {
  userWDneroRewards: string | number
  userMoboxRewards: string | number
}) => {
  const moboxPriceBUSD = useStablecoinPrice(dneroTokens.mbox)
  const wdneroAsBigNumber = new BigNumber(userWDneroRewards as string)
  const moboxAsBigNumber = new BigNumber(userMoboxRewards as string)
  const wdneroBalance = getBalanceNumber(wdneroAsBigNumber)
  const moboxBalance = getBalanceNumber(moboxAsBigNumber)
  const wdneroPriceBusd = useWDneroPrice()

  const dollarValueOfTokensReward =
    wdneroPriceBusd && moboxPriceBUSD
      ? wdneroPriceBusd.multipliedBy(wdneroBalance).toNumber() + multiplyPriceByAmount(moboxPriceBUSD, moboxBalance, 8)
      : null

  return {
    wdneroReward: wdneroBalance,
    moboxReward: moboxBalance,
    dollarValueOfTokensReward,
  }
}

export const useModCompetitionRewards = ({
  userWDneroRewards,
  userDarRewards,
}: {
  userWDneroRewards: string | number
  userDarRewards: string | number
}) => {
  const darPriceBUSD = useStablecoinPrice(dneroTokens.dar)
  const wdneroAsBigNumber = new BigNumber(userWDneroRewards as string)
  const darAsBigNumber = new BigNumber(userDarRewards as string)
  const wdneroBalance = getBalanceNumber(wdneroAsBigNumber)
  const darBalance = getBalanceNumber(darAsBigNumber, dneroTokens.dar.decimals)
  const wdneroPriceBusd = useWDneroPrice()

  const dollarValueOfTokensReward =
    wdneroPriceBusd && darPriceBUSD
      ? wdneroPriceBusd.multipliedBy(wdneroBalance).toNumber() +
        multiplyPriceByAmount(darPriceBUSD, darBalance, dneroTokens.dar.decimals)
      : null

  return {
    wdneroReward: wdneroBalance,
    darReward: darBalance,
    dollarValueOfTokensReward,
  }
}

// 1 is a reasonable teamRank default: accessing the first team in the config.
// We use the smart contract userPointReward to get a users' points
// Achievement keys are consistent across different teams regardless of team team rank
// If a teamRank value isn't passed, this helper can be used to return achievement keys for a given userRewardGroup
export const getEasterRewardGroupAchievements = (userRewardGroup: string, teamRank = 1) => {
  const userGroup = easterPrizes[teamRank].filter((prizeGroup) => {
    return prizeGroup.group === userRewardGroup
  })[0]
  return userGroup?.achievements || {}
}

// given we have userPointReward and userRewardGroup, we can find the specific reward because no Rank has same two values.
export const getRewardGroupAchievements = (prizes: PrizesConfig, userRewardGroup: string, userPointReward: string) => {
  const prize = Object.values(prizes)
    .flat()
    .find((rank) => rank.achievements.points === Number(userPointReward) && rank.group === userRewardGroup)
  return prize && prize.achievements
}

export default localiseTradingVolume
