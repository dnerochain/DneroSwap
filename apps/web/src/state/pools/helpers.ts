import BigNumber from 'bignumber.js'
import {
  SerializedPool,
  SerializedWDneroVault,
  DeserializedWDneroVault,
  SerializedLockedWDneroVault,
  VaultKey,
} from 'state/types'
import { deserializeToken } from '@dneroswap/token-lists'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { DeserializedPool } from '@dneroswap/pools'
import { safeGetAddress } from 'utils'
import { convertSharesToWDnero } from 'views/Pools/helpers'
import { Token } from '@dneroswap/sdk'

type UserData =
  | DeserializedPool<Token>['userData']
  | {
      allowance: number | string
      stakingTokenBalance: number | string
      stakedBalance: number | string
      pendingReward: number | string
    }

export const transformUserData = (userData: UserData) => {
  return {
    allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
    stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
    stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
    pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
  }
}

const transformProfileRequirement = (profileRequirement?: { required: boolean; thresholdPoints: string }) => {
  return profileRequirement
    ? {
        required: profileRequirement.required,
        thresholdPoints: profileRequirement.thresholdPoints
          ? new BigNumber(profileRequirement.thresholdPoints)
          : BIG_ZERO,
      }
    : undefined
}

export const transformPool = (pool: SerializedPool): DeserializedPool<Token> => {
  const {
    totalStaked,
    stakingLimit,
    numberSecondsForUserLimit,
    userData,
    stakingToken,
    earningToken,
    profileRequirement,
    startTimestamp,
    ...rest
  } = pool

  return {
    ...rest,
    startTimestamp,
    profileRequirement: transformProfileRequirement(profileRequirement),
    stakingToken: deserializeToken(stakingToken),
    earningToken: deserializeToken(earningToken),
    userData: transformUserData(userData),
    totalStaked: new BigNumber(totalStaked),
    stakingLimit: new BigNumber(stakingLimit),
    stakingLimitEndTimestamp: numberSecondsForUserLimit + startTimestamp,
  }
}

export const transformVault = (vaultKey: VaultKey, vault: SerializedWDneroVault): DeserializedWDneroVault => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      wdneroAtLastUserAction: wdneroAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = vault

  const totalShares = totalSharesAsString ? new BigNumber(totalSharesAsString) : BIG_ZERO
  const pricePerFullShare = pricePerFullShareAsString ? new BigNumber(pricePerFullShareAsString) : BIG_ZERO
  const userShares = new BigNumber(userSharesAsString)
  const wdneroAtLastUserAction = new BigNumber(wdneroAtLastUserActionAsString)
  let userDataExtra
  let publicDataExtra
  if (vaultKey === VaultKey.WDneroVault) {
    const {
      totalWDneroInVault: totalWDneroInVaultAsString,
      totalLockedAmount: totalLockedAmountAsString,
      userData: {
        userBoostedShare: userBoostedShareAsString,
        lockEndTime,
        lockStartTime,
        locked,
        lockedAmount: lockedAmountAsString,
        currentOverdueFee: currentOverdueFeeAsString,
        currentPerformanceFee: currentPerformanceFeeAsString,
      },
    } = vault as SerializedLockedWDneroVault

    const totalWDneroInVault = new BigNumber(totalWDneroInVaultAsString)
    const totalLockedAmount = new BigNumber(totalLockedAmountAsString)
    const lockedAmount = new BigNumber(lockedAmountAsString)
    const userBoostedShare = new BigNumber(userBoostedShareAsString)
    const currentOverdueFee = currentOverdueFeeAsString ? new BigNumber(currentOverdueFeeAsString) : BIG_ZERO
    const currentPerformanceFee = currentPerformanceFeeAsString
      ? new BigNumber(currentPerformanceFeeAsString)
      : BIG_ZERO

    const balance = convertSharesToWDnero(
      userShares,
      pricePerFullShare,
      undefined,
      undefined,
      currentOverdueFee.plus(currentPerformanceFee).plus(userBoostedShare),
    )
    userDataExtra = {
      lockEndTime,
      lockStartTime,
      locked,
      lockedAmount,
      userBoostedShare,
      currentOverdueFee,
      currentPerformanceFee,
      balance,
    }
    publicDataExtra = { totalLockedAmount, totalWDneroInVault }
  } else {
    const balance = convertSharesToWDnero(userShares, pricePerFullShare)
    const { wdneroAsBigNumber } = convertSharesToWDnero(totalShares, pricePerFullShare)
    userDataExtra = { balance }
    publicDataExtra = { totalWDneroInVault: wdneroAsBigNumber }
  }

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return {
    totalShares,
    pricePerFullShare,
    ...publicDataExtra,
    fees: { performanceFee, withdrawalFee, withdrawalFeePeriod, performanceFeeAsDecimal },
    userData: {
      isLoading,
      userShares,
      wdneroAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
      ...userDataExtra,
    },
  }
}

export const getTokenPricesFromFarm = (
  farms: {
    quoteToken: { address: string }
    token: { address: string }
    quoteTokenPriceBusd: string
    tokenPriceBusd: string
  }[],
) => {
  return farms.reduce((prices, farm) => {
    const quoteTokenAddress = safeGetAddress(farm.quoteToken.address)
    const tokenAddress = safeGetAddress(farm.token.address)
    /* eslint-disable no-param-reassign */
    if (quoteTokenAddress && !prices[quoteTokenAddress]) {
      prices[quoteTokenAddress] = new BigNumber(farm.quoteTokenPriceBusd).toNumber()
    }
    if (tokenAddress && !prices[tokenAddress]) {
      prices[tokenAddress] = new BigNumber(farm.tokenPriceBusd).toNumber()
    }
    /* eslint-enable no-param-reassign */
    return prices
  }, {})
}
