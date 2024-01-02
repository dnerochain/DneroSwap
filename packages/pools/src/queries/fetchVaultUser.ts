import BigNumber from 'bignumber.js'
import { ChainId } from '@dneroswap/chains'
import { Address } from 'viem'

import { OnChainProvider, SerializedLockedVaultUser, SerializedVaultUser } from '../types'
import { wdneroVaultV2ABI } from '../abis/IWDneroVaultV2'
import { getWDneroFlexibleSideVaultAddress, getWDneroVaultAddress } from './getAddresses'
import { wdneroFlexibleSideVaultV2ABI } from '../abis/IWDneroFlexibleSideVaultV2'

interface Params {
  account: Address
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchVaultUser = async ({ account, chainId, provider }: Params): Promise<SerializedLockedVaultUser> => {
  try {
    const wdneroVaultAddress = getWDneroVaultAddress(chainId)

    const client = provider({ chainId })

    const [userContractResponse, currentPerformanceFee, currentOverdueFee] = await client.multicall({
      contracts: [
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'userInfo',
          args: [account],
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'calculatePerformanceFee',
          args: [account],
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'calculateOverdueFee',
          args: [account],
        },
      ],
      allowFailure: false,
    })

    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse[0].toString()).toJSON(),
      lastDepositedTime: userContractResponse[1].toString(),
      lastUserActionTime: userContractResponse[3].toString(),
      wdneroAtLastUserAction: new BigNumber(userContractResponse[2].toString()).toJSON(),
      userBoostedShare: new BigNumber(userContractResponse[6].toString()).toJSON(),
      locked: userContractResponse[7],
      lockEndTime: userContractResponse[5].toString(),
      lockStartTime: userContractResponse[4].toString(),
      lockedAmount: new BigNumber(userContractResponse[8].toString()).toJSON(),
      currentPerformanceFee: new BigNumber(currentPerformanceFee.toString()).toJSON(),
      currentOverdueFee: new BigNumber(currentOverdueFee.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: '',
      lastDepositedTime: '',
      lastUserActionTime: '',
      wdneroAtLastUserAction: '',
      userBoostedShare: '',
      lockEndTime: '',
      lockStartTime: '',
      locked: false,
      lockedAmount: '',
      currentPerformanceFee: '',
      currentOverdueFee: '',
    }
  }
}

export const fetchFlexibleSideVaultUser = async ({
  account,
  chainId,
  provider,
}: Params): Promise<SerializedVaultUser> => {
  try {
    const userContractResponse = await await provider({ chainId }).readContract({
      abi: wdneroFlexibleSideVaultV2ABI,
      address: getWDneroFlexibleSideVaultAddress(chainId),
      functionName: 'userInfo',
      args: [account],
    })
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse[0].toString()).toJSON(),
      lastDepositedTime: userContractResponse[1].toString(),
      lastUserActionTime: userContractResponse[3].toString(),
      wdneroAtLastUserAction: new BigNumber(userContractResponse[2].toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: '',
      lastDepositedTime: '',
      lastUserActionTime: '',
      wdneroAtLastUserAction: '',
    }
  }
}
