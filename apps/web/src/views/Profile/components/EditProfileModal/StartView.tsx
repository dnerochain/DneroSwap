import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import { Button, Flex, InjectedModalProps, Message, MessageText } from '@dneroswap/uikit'
import { getDneroswapProfileAddress } from 'utils/addressHelpers'
import { useWDnero } from 'hooks/useContract'
import { useDNEROWDneroBalance } from 'hooks/useTokenBalance'
import { useWDneroEnable } from 'hooks/useWDneroEnable'
import { useTranslation } from '@dneroswap/localization'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { FetchStatus } from 'config/constants/types'
import { requiresApproval } from 'utils/requiresApproval'
import { useProfile } from 'state/profile/hooks'
import ProfileAvatarWithTeam from 'components/ProfileAvatarWithTeam'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { UseEditProfileResponse } from './reducer'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const DangerOutline = styled(Button).attrs({ variant: 'secondary' })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const AvatarWrapper = styled.div`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const StartPage: React.FC<React.PropsWithChildren<StartPageProps>> = ({ goToApprove, goToChange, goToRemove }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const wdneroContract = useWDnero()
  const { profile } = useProfile()
  const { balance: wdneroBalance, fetchStatus } = useDNEROWDneroBalance()
  const {
    costs: { numberWDneroToUpdate, numberWDneroToReactivate },
    isLoading: isProfileCostsLoading,
  } = useGetProfileCosts()
  const [needsApproval, setNeedsApproval] = useState(null)
  const minimumWDneroRequired = profile?.isActive ? numberWDneroToUpdate : numberWDneroToReactivate
  const hasMinimumWDneroRequired = fetchStatus === FetchStatus.Fetched && wdneroBalance >= minimumWDneroRequired
  const { handleEnable, pendingEnableTx } = useWDneroEnable(new BigNumber(minimumWDneroRequired.toString()))
  const [showWDneroRequireFlow, setShowWDneroRequireFlow] = useState(false)

  useEffect(() => {
    if (!isProfileCostsLoading && !hasMinimumWDneroRequired && !showWDneroRequireFlow) {
      setShowWDneroRequireFlow(true)
    }
  }, [isProfileCostsLoading, hasMinimumWDneroRequired, showWDneroRequireFlow])

  /**
   * Check if the wallet has the required WDNERO allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const approvalNeeded = await requiresApproval(
        wdneroContract,
        account,
        getDneroswapProfileAddress(),
        minimumWDneroRequired,
      )
      setNeedsApproval(approvalNeeded)
    }

    if (account && !isProfileCostsLoading) {
      checkApprovalStatus()
    }
  }, [account, minimumWDneroRequired, setNeedsApproval, wdneroContract, isProfileCostsLoading])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <AvatarWrapper>
        <ProfileAvatarWithTeam profile={profile} />
      </AvatarWrapper>
      {profile.isActive ? (
        <>
          <Message variant="warning" my="16px">
            <MessageText>
              {t(
                "Before editing your profile, please make sure you've claimed all the unspent WDNERO from previous IFOs!",
              )}
            </MessageText>
          </Message>
          {showWDneroRequireFlow ? (
            <Flex mb="16px" pb="16px">
              <ApproveConfirmButtons
                isApproveDisabled={isProfileCostsLoading || hasMinimumWDneroRequired}
                isApproving={pendingEnableTx}
                isConfirmDisabled={isProfileCostsLoading || !hasMinimumWDneroRequired || needsApproval === null}
                isConfirming={false}
                onApprove={handleEnable}
                onConfirm={needsApproval === true ? goToApprove : goToChange}
                confirmLabel={t('Change Profile Pic')}
              />
            </Flex>
          ) : (
            <Button
              width="100%"
              mb="8px"
              onClick={needsApproval === true ? goToApprove : goToChange}
              disabled={isProfileCostsLoading || !hasMinimumWDneroRequired || needsApproval === null}
            >
              {t('Change Profile Pic')}
            </Button>
          )}
          <DangerOutline width="100%" onClick={goToRemove}>
            {t('Remove Profile Pic')}
          </DangerOutline>
        </>
      ) : showWDneroRequireFlow ? (
        <Flex mb="8px">
          <ApproveConfirmButtons
            isApproveDisabled={isProfileCostsLoading || hasMinimumWDneroRequired}
            isApproving={pendingEnableTx}
            isConfirmDisabled={isProfileCostsLoading || !hasMinimumWDneroRequired || needsApproval === null}
            isConfirming={false}
            onApprove={handleEnable}
            onConfirm={needsApproval === true ? goToApprove : goToChange}
            confirmLabel={t('Reactivate Profile')}
          />
        </Flex>
      ) : (
        <Button
          width="100%"
          mb="8px"
          onClick={needsApproval === true ? goToApprove : goToChange}
          disabled={isProfileCostsLoading || !hasMinimumWDneroRequired || needsApproval === null}
        >
          {t('Reactivate Profile')}
        </Button>
      )}
    </Flex>
  )
}

export default StartPage
