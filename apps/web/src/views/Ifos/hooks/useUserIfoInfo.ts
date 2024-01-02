import { ChainId, CurrencyAmount } from '@dneroswap/sdk'
import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { getUserIfoInfo, getCurrentIfoRatio } from '@dneroswap/ifos'
import { WDNERO } from '@dneroswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { getViemClients } from 'utils/viem'

type IWDneroRatioParams = {
  chainId?: ChainId
}

export function useIWDneroRatio({ chainId }: IWDneroRatioParams) {
  const { data } = useQuery(
    [chainId, 'current-ifo-ratio'],
    () =>
      getCurrentIfoRatio({
        chainId,
        provider: getViemClients,
      }),
    {
      enabled: Boolean(chainId),
    },
  )

  return data
}

type Params = {
  chainId?: ChainId
  ifoAddress?: Address
}

export function useUserIfoInfo({ chainId, ifoAddress }: Params) {
  const { address: account } = useAccount()
  const ratio = useIWDneroRatio({ chainId })
  const { data } = useQuery(
    [account, chainId, ifoAddress, 'user-ifo-info'],
    () =>
      getUserIfoInfo({
        account,
        chainId,
        ifo: ifoAddress,
        provider: getViemClients,
      }),
    {
      enabled: Boolean(account && chainId),
    },
  )

  const snapshotTime = useMemo(() => {
    const now = Math.floor(Date.now() / 1000)
    return data?.endTimestamp && data.endTimestamp > now ? data.endTimestamp : undefined
  }, [data?.endTimestamp])

  const credit = useMemo(
    () =>
      chainId && WDNERO[chainId] && data?.credit !== undefined
        ? CurrencyAmount.fromRawAmount(WDNERO[chainId], data?.credit)
        : undefined,
    [data?.credit, chainId],
  )
  const veWDnero = useMemo(
    () =>
      credit && ratio
        ? new BigNumber(credit.numerator.toString()).div(credit.decimalScale.toString()).div(ratio)
        : undefined,
    [credit, ratio],
  )

  return {
    snapshotTime,
    credit,
    veWDnero,
  }
}
