import { Currency, CurrencyAmount } from '@dneroswap/swap-sdk-core'
import { getDecimalAmount } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useApproveCallback } from 'hooks/useApproveCallback'
import useTokenAllowance from 'hooks/useTokenAllowance'
import { useMemo } from 'react'
import { getVeWDneroContract } from 'utils/contractHelpers'
import { useAccount, useWalletClient } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { useDNEROWDneroToken } from './useDNEROWDneroToken'

export const useLockAllowance = () => {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const wdneroToken = useDNEROWDneroToken()
  const veWDneroContract = getVeWDneroContract(walletClient ?? undefined, chainId)
  const { address: account } = useAccount()

  return useTokenAllowance(wdneroToken, account, veWDneroContract.address)
}

export const useShouldGrantAllowance = (targetAmount: bigint) => {
  const { allowance } = useLockAllowance()
  return allowance && allowance.greaterThan(targetAmount)
}

export const useLockApproveCallback = (amount: string) => {
  const { data: walletClient } = useWalletClient()
  const { chainId } = useActiveChainId()
  const wdneroToken = useDNEROWDneroToken()
  const veWDneroContract = getVeWDneroContract(walletClient ?? undefined, chainId)
  const rawAmount = useMemo(
    () => getDecimalAmount(new BN(amount || 0), wdneroToken?.decimals),
    [amount, wdneroToken?.decimals],
  )

  const currencyAmount = useMemo(
    () => (wdneroToken ? CurrencyAmount.fromRawAmount<Currency>(wdneroToken, rawAmount.toString()) : undefined),
    [wdneroToken, rawAmount],
  )

  const { approvalState, approveCallback, currentAllowance } = useApproveCallback(
    currencyAmount,
    veWDneroContract.address,
  )

  return { approvalState, approveCallback, currentAllowance }
}
