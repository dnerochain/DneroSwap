import { useEffect, useState } from 'react'
import { ModalV2 } from '@dneroswap/uikit'
import { ChainId } from '@dneroswap/chains'
import { useAccount } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useVWDnero from 'views/Pools/hooks/useVWDnero'
import JoinRevenueModal from 'views/Pools/components/RevenueSharing/JoinRevenueModal'
import useWDneroBenefits from 'components/Menu/UserMenu/hooks/useWDneroBenefits'
import { VaultPosition } from 'utils/wdneroPool'

const VWDneroModal = () => {
  const { account, chainId } = useAccountActiveChain()
  const { isInitialization, refresh } = useVWDnero()
  const [open, setOpen] = useState(false)
  const { data: wdneroBenefits, status: wdneroBenefitsFetchStatus } = useWDneroBenefits()

  useEffect(() => {
    if (
      account &&
      chainId === ChainId.DNERO &&
      isInitialization === false &&
      wdneroBenefitsFetchStatus === 'success' &&
      wdneroBenefits?.lockPosition === VaultPosition.Locked
    ) {
      setOpen(true)
    }
  }, [account, wdneroBenefits?.lockPosition, wdneroBenefitsFetchStatus, chainId, isInitialization])

  useAccount({
    onConnect: ({ connector }) => {
      connector?.addListener('change', () => closeModal())
    },
    onDisconnect: () => closeModal(),
  })

  const closeModal = () => {
    setOpen(false)
  }

  return (
    <ModalV2 isOpen={open} onDismiss={() => closeModal()}>
      <JoinRevenueModal refresh={refresh} onDismiss={() => closeModal()} />
    </ModalV2>
  )
}

export default VWDneroModal
