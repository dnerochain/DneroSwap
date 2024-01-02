import { useMemo, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button, useModalV2, Flex, Text } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import { isWDneroVaultSupported, WDNERO_VAULT_SUPPORTED_CHAINS } from '@dneroswap/pools'

import { useConfig } from 'views/Ifos/contexts/IfoContext'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { NetworkSwitcherModal } from './IfoPoolCard/NetworkSwitcherModal'
import { useChainNames } from '../../hooks/useChainNames'
import { IWDneroLogo } from '../Icons'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useConfig() as any
  const isFinishedPage = router.pathname.includes('history')
  const wdneroVaultSupported = useMemo(() => isWDneroVaultSupported(chainId), [chainId])
  const chainNames = useChainNames(WDNERO_VAULT_SUPPORTED_CHAINS)
  const { onOpen, onDismiss, isOpen } = useModalV2()

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  const handleClickButton = useCallback(() => {
    if (!wdneroVaultSupported) {
      onOpen()
      return
    }

    // Always expand for mobile
    if (!isExpanded) {
      setIsExpanded(true)
    }

    if (isFinishedPage) {
      router.push('/ifo')
    } else {
      scrollToTop()
    }
  }, [wdneroVaultSupported, onOpen, isExpanded, isFinishedPage, router, scrollToTop, setIsExpanded])

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <IWDneroLogo />
      <Text mt="0.625rem">{t('Stake WDNERO to obtain iWDNERO - in order to be eligible in the next IFO.')}</Text>
    </Flex>
  )

  return (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={WDNERO_VAULT_SUPPORTED_CHAINS}
        title={t('Lock WDNERO')}
        description={t('Lock WDNERO on %chain% to obtain iWDNERO', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to stake WDNERO')}
        onDismiss={onDismiss}
        tips={tips}
      />
      <Button {...props} onClick={handleClickButton}>
        {t('Go to WDNERO pool')}
      </Button>
    </>
  )
}

export default StakeVaultButton
