import { ChainId } from '@dneroswap/chains'
import { dneroTokens } from '@dneroswap/tokens'
import { useQuery } from '@tanstack/react-query'
import { getActivePools } from 'utils/calls'
import { publicClient } from 'utils/wagmi'
import { Address, useAccount } from 'wagmi'
import { VEWDNERO_VOTING_POWER_BLOCK, getVeVotingPower, getVotingPower } from '../helpers'

interface State {
  wdneroBalance?: number
  wdneroVaultBalance?: number
  wdneroPoolBalance?: number
  poolsBalance?: number
  wdneroDTokenLpBalance?: number
  ifoPoolBalance?: number
  total: number
  lockedWDneroBalance?: number
  lockedEndTime?: number
  veWDneroBalance?: number
}

const useGetVotingPower = (block?: number): State & { isLoading: boolean; isError: boolean } => {
  const { address: account } = useAccount()
  const { data, status, error } = useQuery(
    [account, block, 'votingPower'],
    async () => {
      if (!account) {
        throw new Error('No account')
      }
      const blockNumber = block ? BigInt(block) : await publicClient({ chainId: ChainId.DNERO }).getBlockNumber()
      if (blockNumber >= VEWDNERO_VOTING_POWER_BLOCK) {
        return getVeVotingPower(account, blockNumber)
      }
      const eligiblePools = await getActivePools(ChainId.DNERO, Number(blockNumber))
      const poolAddresses: Address[] = eligiblePools
        .filter((pair) => pair.stakingToken.address.toLowerCase() === dneroTokens.wdnero.address.toLowerCase())
        .map(({ contractAddress }) => contractAddress)

      const {
        wdneroBalance,
        wdneroDTokenLpBalance,
        wdneroPoolBalance,
        total,
        poolsBalance,
        wdneroVaultBalance,
        ifoPoolBalance,
        lockedWDneroBalance,
        lockedEndTime,
      } = await getVotingPower(account, poolAddresses, blockNumber)
      return {
        wdneroBalance,
        wdneroDTokenLpBalance,
        wdneroPoolBalance,
        poolsBalance,
        wdneroVaultBalance,
        ifoPoolBalance,
        total,
        lockedWDneroBalance,
        lockedEndTime,
      }
    },
    {
      enabled: Boolean(account),
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  )
  if (error) console.error(error)

  return { total: 0, ...data, isLoading: status !== 'success', isError: status === 'error' }
}

export default useGetVotingPower
