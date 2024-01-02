import { useTranslation } from '@dneroswap/localization'
import { Box, Button, Flex, InjectedModalProps, Modal, Spinner } from '@dneroswap/uikit'
import useTheme from 'hooks/useTheme'
import { VEWDNERO_VOTING_POWER_BLOCK } from '../helpers'
import useGetVotingPower from '../hooks/useGetVotingPower'
import DetailsView from './CastVoteModal/DetailsView'
import { VeMainView } from './CastVoteModal/MainView'

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number
}

const VoteDetailsModal: React.FC<React.PropsWithChildren<VoteDetailsModalProps>> = ({ block, onDismiss }) => {
  const { t } = useTranslation()
  const {
    isLoading,
    total,
    wdneroBalance,
    wdneroVaultBalance,
    wdneroPoolBalance,
    poolsBalance,
    wdneroDTokenLpBalance,
    ifoPoolBalance,
    lockedWDneroBalance,
    lockedEndTime,
    veWDneroBalance,
  } = useGetVotingPower(block)
  const { theme } = useTheme()

  const handleDismiss = () => {
    onDismiss?.()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <Box mb="24px" width={['100%', '100%', '100%', '320px']}>
        {isLoading ? (
          <Flex height="450px" alignItems="center" justifyContent="center">
            <Spinner size={80} />
          </Flex>
        ) : (
          <>
            {!block || BigInt(block) >= VEWDNERO_VOTING_POWER_BLOCK ? (
              <VeMainView block={block} total={total} veWDneroBalance={veWDneroBalance} />
            ) : (
              <DetailsView
                total={total}
                wdneroBalance={wdneroBalance}
                wdneroVaultBalance={wdneroVaultBalance}
                wdneroPoolBalance={wdneroPoolBalance}
                poolsBalance={poolsBalance}
                ifoPoolBalance={ifoPoolBalance}
                wdneroDTokenLpBalance={wdneroDTokenLpBalance}
                lockedWDneroBalance={lockedWDneroBalance}
                lockedEndTime={lockedEndTime}
                block={block}
              />
            )}
            <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
              {t('Close')}
            </Button>
          </>
        )}
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
