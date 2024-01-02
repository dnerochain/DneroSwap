import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { ChainId } from '@dneroswap/chains'
import { WDNERO } from '@dneroswap/tokens'
import { Address } from 'viem'

import { wdneroVaultV2ABI } from '../abis/IWDneroVaultV2'
import { OnChainProvider } from '../types'
import { getWDneroFlexibleSideVaultAddress, getWDneroVaultAddress } from './getAddresses'

interface Params {
  wdneroVaultAddress?: Address
  chainId: ChainId
  provider: OnChainProvider
}

const balanceOfAbi = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export const fetchPublicVaultData = async ({
  chainId,
  wdneroVaultAddress = getWDneroVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [sharePrice, shares, totalLockedAmount, totalWDneroInVault] = await client.multicall({
      contracts: [
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'getPricePerFullShare',
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'totalShares',
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'totalLockedAmount',
        },
        {
          abi: balanceOfAbi,
          address: WDNERO[ChainId.DNERO].address,
          functionName: 'balanceOf',
          args: [wdneroVaultAddress],
        },
      ],
      allowFailure: true,
    })

    const totalSharesAsBigNumber =
      shares.status === 'success' && shares.result ? new BigNumber(shares.result.toString()) : BIG_ZERO
    const totalLockedAmountAsBigNumber =
      totalLockedAmount.status === 'success' && totalLockedAmount.result
        ? new BigNumber(totalLockedAmount.result.toString())
        : BIG_ZERO
    const sharePriceAsBigNumber =
      sharePrice.status === 'success' && sharePrice.result ? new BigNumber(sharePrice.result.toString()) : BIG_ZERO

    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      totalLockedAmount: totalLockedAmountAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalWDneroInVault: totalWDneroInVault.result ? new BigNumber(totalWDneroInVault.result.toString()).toJSON() : '0',
    }
  } catch (error) {
    return {
      totalShares: null,
      totalLockedAmount: null,
      pricePerFullShare: null,
      totalWDneroInVault: null,
    }
  }
}

export const fetchPublicFlexibleSideVaultData = async ({
  chainId,
  wdneroVaultAddress = getWDneroFlexibleSideVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [sharePrice, shares, totalWDneroInVault] = await client.multicall({
      contracts: [
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'getPricePerFullShare',
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'totalShares',
        },
        {
          abi: balanceOfAbi,
          address: WDNERO[ChainId.DNERO].address,
          functionName: 'balanceOf',
          args: [wdneroVaultAddress],
        },
      ],
      allowFailure: true,
    })

    const totalSharesAsBigNumber = shares.status === 'success' ? new BigNumber(shares.result.toString()) : BIG_ZERO
    const sharePriceAsBigNumber =
      sharePrice.status === 'success' ? new BigNumber(sharePrice.result.toString()) : BIG_ZERO
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalWDneroInVault: new BigNumber((totalWDneroInVault.result || '0').toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalWDneroInVault: null,
    }
  }
}

export const fetchVaultFees = async ({
  chainId,
  wdneroVaultAddress = getWDneroVaultAddress(chainId),
  provider,
}: Params) => {
  try {
    const client = provider({ chainId })

    const [performanceFee, withdrawalFee, withdrawalFeePeriod] = await client.multicall({
      contracts: [
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'performanceFee',
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'withdrawFee',
        },
        {
          abi: wdneroVaultV2ABI,
          address: wdneroVaultAddress,
          functionName: 'withdrawFeePeriod',
        },
      ],
      allowFailure: false,
    })

    return {
      performanceFee: Number(performanceFee),
      withdrawalFee: Number(withdrawalFee),
      withdrawalFeePeriod: Number(withdrawalFeePeriod),
    }
  } catch (error) {
    return {
      performanceFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}
