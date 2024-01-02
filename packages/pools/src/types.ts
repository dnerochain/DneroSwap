import { ChainId } from '@dneroswap/chains'
import { PublicClient, Address } from 'viem'
import type { SerializedWrappedToken } from '@dneroswap/token-lists'
import BigNumber from 'bignumber.js'

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => PublicClient

export type SerializedBigNumber = string

export interface Addresses {
  [chainId: number]: string
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'DNEROCHAIN' = 'Binance', // Pools using native DTOKEN behave differently than pools using a token
  'AUTO' = 'Auto',
}

// @deprecated
export interface LegacyPoolConfigBaseProps {
  sousId: number
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerBlock: string
  isFinished?: boolean
  enableEmergencyWithdraw?: boolean
  version?: number
}

export interface PoolConfigBaseProps {
  sousId: number
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerSecond: string
  isFinished?: boolean
  enableEmergencyWithdraw?: boolean
}

interface GenericToken {
  decimals: number
  symbol: string
  address: string
}

export interface LegacySerializedPoolConfig<T> extends LegacyPoolConfigBaseProps {
  earningToken: T & GenericToken
  stakingToken: T & GenericToken
}

export interface SerializedPoolConfig<T> extends PoolConfigBaseProps {
  earningToken: T & GenericToken
  stakingToken: T & GenericToken
}

export type LegacySerializedPool = LegacySerializedPoolConfig<SerializedWrappedToken>

export type UpgradedSerializedPool = SerializedPoolConfig<SerializedWrappedToken>

export type SerializedPool = LegacySerializedPool | UpgradedSerializedPool

export type UpgradedSerializedPoolWithInfo = UpgradedSerializedPool & SerializedPoolInfo

export type LegacySerializedPoolWithInfo = LegacySerializedPool & SerializedPoolInfo

export type SerializedPoolWithInfo = LegacySerializedPoolWithInfo | UpgradedSerializedPoolWithInfo

export interface SerializedVaultUser {
  isLoading: boolean
  userShares: SerializedBigNumber
  wdneroAtLastUserAction: SerializedBigNumber
  lastDepositedTime: string
  lastUserActionTime: string
}

export interface SerializedLockedVaultUser extends SerializedVaultUser {
  lockStartTime: string
  lockEndTime: string
  userBoostedShare: SerializedBigNumber
  locked: boolean
  lockedAmount: SerializedBigNumber
  currentPerformanceFee: SerializedBigNumber
  currentOverdueFee: SerializedBigNumber
}

export interface LegacyDeserializedPoolConfig<T> extends LegacyPoolConfigBaseProps {
  earningToken: T & GenericToken
  stakingToken: T & GenericToken
}

export interface UpgradedDeserializedPoolConfig<T> extends PoolConfigBaseProps {
  earningToken: T & GenericToken
  stakingToken: T & GenericToken
}

export type DeserializedPoolConfig<T> = LegacyDeserializedPoolConfig<T> | UpgradedDeserializedPoolConfig<T>

interface SerializedPoolInfo extends CorePoolProps {
  totalStaked?: string
  stakingLimit?: string
  stakingLimitEndTimestamp?: number
  profileRequirement?: {
    required: boolean
    thresholdPoints: string
  }
  userDataLoaded?: boolean
  userData?: {
    allowance: string
    stakingTokenBalance: string
    stakedBalance: string
    pendingReward: string
  }
}

interface PoolInfo extends CorePoolProps {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  stakingLimitEndTimestamp?: number
  profileRequirement?: {
    required: boolean
    thresholdPoints: BigNumber
  }
  userDataLoaded?: boolean
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export type UpgradedDeserializedPool<T> = UpgradedDeserializedPoolConfig<T> & PoolInfo

export type LegacyDeserializedPool<T> = LegacyDeserializedPoolConfig<T> & PoolInfo

export type DeserializedPool<T> = UpgradedDeserializedPool<T> | LegacyDeserializedPool<T>

export type DeserializedPoolVault<T> = DeserializedPool<T> & DeserializedWDneroVault
export type DeserializedPoolLockedVault<T> = DeserializedPool<T> & DeserializedLockedWDneroVault

export interface DeserializedLockedVaultUser extends DeserializedVaultUser {
  lastDepositedTime: string
  lastUserActionTime: string
  lockStartTime: string
  lockEndTime: string
  burnStartTime: string
  userBoostedShare: BigNumber
  locked: boolean
  lockedAmount: BigNumber
  currentPerformanceFee: BigNumber
  currentOverdueFee: BigNumber
}

export interface DeserializedLockedWDneroVault extends Omit<DeserializedWDneroVault, 'userData'> {
  totalLockedAmount?: BigNumber
  userData?: DeserializedLockedVaultUser
}

export interface SerializedVaultFees {
  performanceFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface DeserializedVaultFees extends SerializedVaultFees {
  performanceFeeAsDecimal: number
}

export interface DeserializedVaultUser {
  isLoading: boolean
  userShares: BigNumber
  wdneroAtLastUserAction: BigNumber
  lastDepositedTime: string
  lastUserActionTime: string
  balance: {
    wdneroAsNumberBalance: number
    wdneroAsBigNumber: BigNumber
    wdneroAsDisplayBalance: string
  }
}

export interface DeserializedWDneroVault {
  totalShares?: BigNumber
  totalLockedAmount?: BigNumber
  pricePerFullShare: BigNumber
  totalWDneroInVault?: BigNumber
  fees?: DeserializedVaultFees
  userData?: DeserializedVaultUser
}

export enum VaultKey {
  WDneroVaultV1 = 'wdneroVaultV1',
  WDneroVault = 'wdneroVault',
  WDneroFlexibleSideVault = 'wdneroFlexibleSideVault',
  IfoPool = 'ifoPool',
}

interface CorePoolProps {
  startTimestamp?: number
  endTimestamp?: number
  apr?: number
  rawApr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  vaultKey?: VaultKey
}
