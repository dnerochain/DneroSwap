import { useMemo, useState } from 'react'
import { useSignMessage } from '@dneroswap/wagmi'
import { useToast, Box } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { encodePacked, keccak256 } from 'viem'
import { ChainId } from '@dneroswap/chains'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import SingleLatestReward from 'views/AffiliatesProgram/components/Dashboard/Reward/SingleLatestReward'
import { UserClaimListResponse } from 'views/AffiliatesProgram/hooks/useUserClaimList'
import { useAffiliateProgramContract } from 'hooks/useContract'
import useUserExist from 'views/AffiliatesProgram/hooks/useUserExist'
import WrongNetworkWarning from 'views/AffiliatesProgram/components/Dashboard/Reward/WrongNetworkWarning'

interface LatestRewardProps {
  isAffiliate: boolean
  userRewardFeeUSD: string
  affiliateRewardFeeUSD: string
  userClaimData: UserClaimListResponse
  affiliateClaimData: UserClaimListResponse
  refreshAffiliateClaimData: () => void
  refreshUserClaimData: () => void
  refreshAuthAffiliate: () => void
}

const MIN_CLAIM_AMOUNT = 1

const LatestReward: React.FC<React.PropsWithChildren<LatestRewardProps>> = ({
  isAffiliate,
  userRewardFeeUSD,
  affiliateRewardFeeUSD,
  userClaimData,
  affiliateClaimData,
  refreshAffiliateClaimData,
  refreshUserClaimData,
  refreshAuthAffiliate,
}) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const { chainId } = useActiveChainId()
  const { isUserExist } = useUserExist()
  const { toastSuccess, toastError } = useToast()
  const { signMessageAsync } = useSignMessage()
  const wdneroPriceBusd = useWDneroPrice()

  const [isAffiliateClaimLoading, setIsAffiliateClaimLoading] = useState(false)
  const [isUserClaimLoading, setIsUserClaimLoading] = useState(false)
  const contract = useAffiliateProgramContract({ chainId: ChainId.DNERO })

  const affiliateTotalWDneroEarned = useMemo(
    () => new BigNumber(affiliateRewardFeeUSD).div(wdneroPriceBusd).toNumber(),
    [wdneroPriceBusd, affiliateRewardFeeUSD],
  )
  const userTotalWDneroEarned = useMemo(
    () => new BigNumber(userRewardFeeUSD).div(wdneroPriceBusd).toNumber(),
    [wdneroPriceBusd, userRewardFeeUSD],
  )

  const handleClaim = async (isAffiliateClaim: boolean) => {
    try {
      if (isAffiliateClaim) {
        setIsAffiliateClaimLoading(true)
      } else {
        setIsUserClaimLoading(true)
      }

      const method = isAffiliateClaim ? contract.read.getAffiliateInfo([address]) : contract.read.getUserInfo([address])
      const userInfo = await method
      const nonce = new BigNumber(userInfo?.nonce?.toString()).toNumber()
      const timestamp = Math.floor(new Date().getTime() / 1000)
      const message = keccak256(encodePacked(['uint256', 'uint256'], [BigInt(nonce), BigInt(timestamp)]))
      const signature = await signMessageAsync({ message })

      const url = isAffiliateClaim ? 'affiliate-claim-fee' : 'user-claim-fee'
      const response = await fetch(`/api/affiliates-program/${url}`, {
        method: 'POST',
        body: JSON.stringify({
          claimRequest: {
            address,
            nonce,
            timestamp,
            signature,
          },
        }),
      })

      const result = await response.json()
      if (result.status === 'success') {
        toastSuccess(t('Success!'))
        if (isAffiliateClaim) {
          await Promise.all([refreshAffiliateClaimData(), refreshAuthAffiliate()])
        } else {
          await refreshUserClaimData()
        }
      } else {
        toastError(result?.error || '')
      }
    } catch (error) {
      console.error(`Submit Claim Reward Error: ${error}`)
    } finally {
      if (isAffiliateClaim) {
        setIsAffiliateClaimLoading(false)
      } else {
        setIsUserClaimLoading(false)
      }
    }
  }

  const isAffiliateClaimDisabled = useMemo(() => {
    const hasPendingOrUnClaimed = affiliateClaimData?.claimRequests?.filter(
      (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && !i.process),
    )
    return (
      new BigNumber(affiliateRewardFeeUSD).lt(MIN_CLAIM_AMOUNT) ||
      hasPendingOrUnClaimed?.length > 0 ||
      isAffiliateClaimLoading
    )
  }, [affiliateClaimData, affiliateRewardFeeUSD, isAffiliateClaimLoading])

  const isUserClaimDisabled = useMemo(() => {
    const hasPendingOrUnClaimed = userClaimData?.claimRequests?.filter(
      (i) => i.approveStatus === 'PENDING' || (i.approveStatus === 'APPROVED' && !i.process),
    )
    return (
      new BigNumber(userRewardFeeUSD).lt(MIN_CLAIM_AMOUNT) ||
      hasPendingOrUnClaimed?.length > 0 ||
      isUserClaimLoading ||
      !isUserExist
    )
  }, [userClaimData, userRewardFeeUSD, isUserClaimLoading, isUserExist])

  return (
    <Box width="100%">
      {chainId !== ChainId.DNERO && <WrongNetworkWarning />}
      {isAffiliate && (
        <Box mb="20px">
          <SingleLatestReward
            usdAmountTitle={t('Affiliate Reward')}
            usdAmount={Number(affiliateRewardFeeUSD)}
            wdneroAmountTitle={t('Affiliate WDNERO Earned')}
            wdneroAmount={affiliateTotalWDneroEarned}
            disabled={isAffiliateClaimDisabled}
            clickClaim={() => handleClaim(true)}
          />
        </Box>
      )}
      <SingleLatestReward
        usdAmountTitle={t('User Reward')}
        usdAmount={Number(userRewardFeeUSD)}
        wdneroAmountTitle={t('User WDNERO Earned')}
        wdneroAmount={userTotalWDneroEarned}
        disabled={isUserClaimDisabled}
        clickClaim={() => handleClaim(false)}
      />
    </Box>
  )
}

export default LatestReward
