import { useQuery } from '@tanstack/react-query'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useVeWDneroContract } from 'hooks/useContract'
import { Address, isAddressEqual, zeroAddress } from 'viem'
import { useVeWDneroUserInfo } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { useNextEpochStart } from './useEpochTime'

export const useEpochVotePower = () => {
  const nextEpoch = useNextEpochStart()
  const contract = useVeWDneroContract()
  const { account } = useAccountActiveChain()
  const { data: userInfo } = useVeWDneroUserInfo()

  const { data } = useQuery(
    ['epochVotePower', nextEpoch, contract.address, contract.chain?.id],
    async () => {
      if (!contract || !nextEpoch) return 0n
      const votePower = await contract.read.balanceOfAtTime([account!, BigInt(nextEpoch)])
      const proxyVotePower =
        !userInfo?.wdneroPoolProxy ||
        userInfo?.wdneroPoolProxy === '0x' ||
        isAddressEqual(userInfo?.wdneroPoolProxy, zeroAddress)
          ? 0n
          : await contract.read.balanceOfAtTime([userInfo?.wdneroPoolProxy as Address, BigInt(nextEpoch)])
      // const proxyVotePower = await contract.read.balanceOfAtForProxy([account!, BigInt(nextEpoch)])
      return votePower + proxyVotePower
    },
    {
      enabled: !!nextEpoch && !!contract.address && !!account,
    },
  )

  return data ?? 0n
}
