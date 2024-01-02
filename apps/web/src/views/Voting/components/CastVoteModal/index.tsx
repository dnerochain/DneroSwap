import { useTranslation } from '@dneroswap/localization'
import { Box, Modal, useToast } from '@dneroswap/uikit'
import snapshot from '@snapshot-labs/snapshot.js'
import useTheme from 'hooks/useTheme'
import { useState } from 'react'
import { DNEROSWAP_SPACE } from 'views/Voting/config'
import { VEWDNERO_VOTING_POWER_BLOCK } from 'views/Voting/helpers'
import { useAccount, useWalletClient } from 'wagmi'
import useGetVotingPower from '../../hooks/useGetVotingPower'
import DetailsView from './DetailsView'
import MainView, { VeMainView } from './MainView'
import { CastVoteModalProps, ConfirmVoteView } from './types'

const hub = 'https://hub.snapshot.org'
const client = new snapshot.Client712(hub)

const CastVoteModal: React.FC<React.PropsWithChildren<CastVoteModalProps>> = ({
  onSuccess,
  proposalId,
  vote,
  block,
  onDismiss,
}) => {
  const [view, setView] = useState<ConfirmVoteView>(ConfirmVoteView.MAIN)
  const [isPending, setIsPending] = useState(false)
  const { address: account } = useAccount()
  const { data: signer } = useWalletClient()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const { theme } = useTheme()
  const {
    isLoading,
    isError,
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

  const isStartView = view === ConfirmVoteView.MAIN
  const handleBack = isStartView ? undefined : () => setView(ConfirmVoteView.MAIN)
  const handleViewDetails = () => setView(ConfirmVoteView.DETAILS)

  const title = {
    [ConfirmVoteView.MAIN]: t('Confirm Vote'),
    [ConfirmVoteView.DETAILS]: t('Voting Power'),
  }

  const handleDismiss = () => {
    onDismiss?.()
  }

  const handleConfirmVote = async () => {
    try {
      setIsPending(true)
      const web3 = {
        getSigner: () => {
          return {
            _signTypedData: (domain, types, message) =>
              signer?.signTypedData({
                account,
                domain,
                types,
                message,
                primaryType: 'Vote',
              }),
          }
        },
      }

      if (!account) {
        return
      }

      await client.vote(web3 as any, account, {
        space: DNEROSWAP_SPACE,
        choice: vote.value,
        reason: '',
        type: 'single-choice',
        proposal: proposalId,
        app: 'snapshot',
      })

      await onSuccess()

      handleDismiss()
    } catch (error) {
      toastError(t('Error'), (error as Error)?.message ?? t('Error occurred, please try again'))
      console.error(error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Modal
      title={title[view]}
      onBack={handleBack}
      onDismiss={onDismiss}
      hideCloseButton={!isStartView}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Box mb="24px">
        {view === ConfirmVoteView.MAIN &&
          (!block || BigInt(block) >= VEWDNERO_VOTING_POWER_BLOCK ? (
            <VeMainView
              block={block}
              vote={vote}
              total={total}
              isPending={isPending}
              isLoading={isLoading}
              isError={isError}
              veWDneroBalance={veWDneroBalance}
              onConfirm={handleConfirmVote}
              onDismiss={handleDismiss}
            />
          ) : (
            <MainView
              vote={vote}
              isError={isError}
              isLoading={isLoading}
              isPending={isPending}
              total={total}
              lockedWDneroBalance={lockedWDneroBalance}
              lockedEndTime={lockedEndTime}
              onConfirm={handleConfirmVote}
              onViewDetails={handleViewDetails}
              onDismiss={handleDismiss}
            />
          ))}
        {view === ConfirmVoteView.DETAILS && (
          <DetailsView
            total={total}
            wdneroBalance={wdneroBalance}
            ifoPoolBalance={ifoPoolBalance}
            wdneroVaultBalance={wdneroVaultBalance}
            wdneroPoolBalance={wdneroPoolBalance}
            poolsBalance={poolsBalance}
            wdneroDTokenLpBalance={wdneroDTokenLpBalance}
            block={block}
            lockedWDneroBalance={lockedWDneroBalance}
            lockedEndTime={lockedEndTime}
          />
        )}
      </Box>
    </Modal>
  )
}

export default CastVoteModal
