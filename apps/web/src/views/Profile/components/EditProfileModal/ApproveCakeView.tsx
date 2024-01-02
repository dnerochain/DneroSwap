import { useTranslation } from '@dneroswap/localization'
import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@dneroswap/uikit'
import { formatBigInt } from '@dneroswap/utils/formatBalance'
import { useWeb3React } from '@dneroswap/wagmi'
import useCatchTxError from 'hooks/useCatchTxError'
import { useWDnero } from 'hooks/useContract'
import { useProfile } from 'state/profile/hooks'
import { getDneroswapProfileAddress } from 'utils/addressHelpers'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveWDneroPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveWDneroPage: React.FC<React.PropsWithChildren<ApproveWDneroPageProps>> = ({ goToChange, onDismiss }) => {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const {
    costs: { numberWDneroToUpdate, numberWDneroToReactivate },
  } = useGetProfileCosts()
  const wdneroContract = useWDnero()

  if (!profile) {
    return null
  }

  const cost = profile.isActive ? numberWDneroToUpdate : numberWDneroToReactivate

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return wdneroContract.write.approve([getDneroswapProfileAddress(), cost * 2n], {
        account,
        chain,
      })
    })
    if (receipt?.status) {
      goToChange()
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigInt(cost)} WDNERO</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}
      >
        {t('Enable')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveWDneroPage
