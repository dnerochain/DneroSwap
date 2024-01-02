import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { useQuery } from '@tanstack/react-query'
import { useIfoCreditAddressContract } from 'hooks/useContract'
import { ChainId } from '@dneroswap/chains'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { useTranslation } from '@dneroswap/localization'
import { useChainCurrentBlock } from 'state/block/hooks'
import { getVaultPosition, VaultPosition } from 'utils/wdneroPool'
import { getWDneroVaultAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls'
import { wdneroVaultV2ABI } from '@dneroswap/pools'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { convertSharesToWDnero } from 'views/Pools/helpers'
import { getScores } from 'views/Voting/getScores'
import { DNEROSWAP_SPACE } from 'views/Voting/config'
import { wdneroPoolBalanceStrategy, createTotalStrategy } from 'views/Voting/strategies'
import { publicClient } from 'utils/wagmi'

const dneroClient = publicClient({ chainId: ChainId.DNERO })

const useWDneroBenefits = () => {
  const { address: account } = useAccount()
  const {
    currentLanguage: { locale },
  } = useTranslation()
  const ifoCreditAddressContract = useIfoCreditAddressContract()
  const wdneroVaultAddress = getWDneroVaultAddress()
  const currentDneroBlock = useChainCurrentBlock(ChainId.DNERO)

  const { data, status } = useQuery(
    ['wdneroBenefits', account],
    async () => {
      if (!account) return undefined
      const [userInfo, currentPerformanceFee, currentOverdueFee, sharePrice] = await dneroClient.multicall({
        contracts: [
          {
            address: wdneroVaultAddress,
            abi: wdneroVaultV2ABI,
            functionName: 'userInfo',
            args: [account],
          },
          {
            address: wdneroVaultAddress,
            abi: wdneroVaultV2ABI,
            functionName: 'calculatePerformanceFee',
            args: [account],
          },
          {
            address: wdneroVaultAddress,
            abi: wdneroVaultV2ABI,
            functionName: 'calculateOverdueFee',
            args: [account],
          },
          {
            address: wdneroVaultAddress,
            abi: wdneroVaultV2ABI,
            functionName: 'getPricePerFullShare',
          },
        ],
        allowFailure: false,
      })
      const userContractResponse = {
        shares: userInfo[0],
        lastDepositedTime: userInfo[1],
        wdneroAtLastUserAction: userInfo[2],
        lastUserActionTime: userInfo[3],
        lockStartTime: userInfo[4],
        lockEndTime: userInfo[5],
        userBoostedShare: userInfo[6],
        locked: userInfo[7],
        lockedAmount: userInfo[8],
      }

      const currentPerformanceFeeAsBigNumber = new BigNumber(currentPerformanceFee.toString())
      const currentOverdueFeeAsBigNumber = new BigNumber(currentOverdueFee.toString())
      const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
      const userBoostedSharesAsBignumber = new BigNumber(userContractResponse.userBoostedShare.toString())
      const userSharesAsBignumber = new BigNumber(userContractResponse.shares.toString())
      const lockPosition = getVaultPosition({
        userShares: userSharesAsBignumber,
        locked: userContractResponse.locked,
        lockEndTime: userContractResponse.lockEndTime.toString(),
      })
      const lockedWDnero = [VaultPosition.None, VaultPosition.Flexible].includes(lockPosition)
        ? '0.00'
        : convertSharesToWDnero(
            userSharesAsBignumber,
            sharePriceAsBigNumber,
            undefined,
            undefined,
            currentOverdueFeeAsBigNumber.plus(currentPerformanceFeeAsBigNumber).plus(userBoostedSharesAsBignumber),
          ).wdneroAsNumberBalance.toLocaleString('en', { maximumFractionDigits: 3 })

      let iWDnero = ''
      let vWDnero = { vaultScore: '0', totalScore: '0' }
      if (lockPosition === VaultPosition.Locked) {
        // @ts-ignore
        // TODO: Fix viem
        const credit = await ifoCreditAddressContract.read.getUserCredit([account])
        iWDnero = getBalanceNumber(new BigNumber(credit.toString())).toLocaleString('en', { maximumFractionDigits: 3 })

        const eligiblePools: any = await getActivePools(ChainId.DNERO, currentDneroBlock)
        const poolAddresses = eligiblePools.map(({ contractAddress }) => contractAddress)

        const [wdneroVaultBalance, total] = await getScores(
          DNEROSWAP_SPACE,
          [wdneroPoolBalanceStrategy('v1'), createTotalStrategy(poolAddresses, 'v1')],
          ChainId.DNERO.toString(),
          [account],
          Number(currentDneroBlock),
        )
        vWDnero = {
          vaultScore: wdneroVaultBalance[account]
            ? wdneroVaultBalance[account].toLocaleString('en', { maximumFractionDigits: 3 })
            : '0',
          totalScore: total[account] ? total[account].toLocaleString('en', { maximumFractionDigits: 3 }) : '0',
        }
      }

      return {
        lockedWDnero,
        lockPosition,
        lockedEndTime: new Date(parseInt(userContractResponse.lockEndTime.toString()) * 1000).toLocaleString(locale, {
          month: 'short',
          year: 'numeric',
          day: 'numeric',
        }),
        iWDnero,
        vWDnero,
      }
    },
    {
      enabled: Boolean(account && currentDneroBlock),
    },
  )

  return { data, status }
}

export default useWDneroBenefits
