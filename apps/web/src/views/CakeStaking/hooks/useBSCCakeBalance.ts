import { ChainId } from '@dneroswap/chains'
import { WDNERO, dneroTestnetTokens } from '@dneroswap/tokens'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTokenBalance from 'hooks/useTokenBalance'
import { useMemo } from 'react'

// @notice: return only bsc or dnero-testnet cake token balance
export const useDNEROWDneroBalance = () => {
  const { chainId } = useActiveChainId()
  const wdneroAddress = useMemo(() => {
    if (ChainId.DNERO === chainId) return WDNERO[chainId as ChainId].address
    if (ChainId.DNERO_TESTNET === chainId) return dneroTestnetTokens.wdnero2.address
    return undefined
  }, [chainId])
  const { balance } = useTokenBalance(wdneroAddress)

  return balance
}
