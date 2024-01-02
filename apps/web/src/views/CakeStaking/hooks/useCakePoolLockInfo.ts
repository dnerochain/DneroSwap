import { ChainId } from '@dneroswap/chains'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useWDneroVaultContract } from 'hooks/useContract'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

export type WDneroPoolInfo = {
  shares: bigint
  lastDepositedTime: bigint
  wdneroAtLastUserAction: bigint
  lastUserActionTime: bigint
  lockStartTime: bigint
  lockEndTime: bigint
  userBoostedShare: bigint
  locked: boolean
  lockedAmount: bigint
}

export const useWDneroPoolLockInfo = () => {
  const { chainId, account } = useAccountActiveChain()
  const wdneroVaultContract = useWDneroVaultContract()
  const currentTimestamp = useCurrentBlockTimestamp()

  const { data: info } = useQuery(
    ['wdneroPoolLockInfo', wdneroVaultContract.address, chainId, account],
    async (): Promise<WDneroPoolInfo> => {
      if (!account) return {} as WDneroPoolInfo
      const [
        shares,
        lastDepositedTime,
        wdneroAtLastUserAction,
        lastUserActionTime,
        lockStartTime,
        lockEndTime,
        userBoostedShare,
        _locked,
        lockedAmount,
      ] = await wdneroVaultContract.read.userInfo([account])
      const lockEndTimeStr = lockEndTime.toString()
      return {
        shares,
        lastDepositedTime,
        wdneroAtLastUserAction,
        lastUserActionTime,
        lockStartTime,
        lockEndTime,
        userBoostedShare,
        locked:
          _locked &&
          lockEndTimeStr !== '0' &&
          dayjs.unix(parseInt(lockEndTimeStr, 10)).isAfter(dayjs.unix(currentTimestamp)),
        lockedAmount,
      }
    },
    {
      enabled: Boolean(account) && (chainId === ChainId.DNERO || chainId === ChainId.DNERO_TESTNET),
    },
  )
  return info || ({} as WDneroPoolInfo)
}
