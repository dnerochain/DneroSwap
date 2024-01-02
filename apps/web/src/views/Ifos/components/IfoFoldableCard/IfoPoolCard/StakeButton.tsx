import { useTranslation } from '@dneroswap/localization'
import { isWDneroVaultSupported, WDNERO_VAULT_SUPPORTED_CHAINS } from '@dneroswap/pools'
import { SpaceProps } from 'styled-system'
import { useMemo } from 'react'
import { Button, useModalV2, Flex, Text } from '@dneroswap/uikit'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { NetworkSwitcherModal } from './NetworkSwitcherModal'
import { useChainNames } from '../../../hooks/useChainNames'
import { IWDneroLogo } from '../../Icons'

type Props = SpaceProps

export function StakeButton(props: Props) {
  const { chainId } = useActiveChainId()
  const wdneroVaultSupported = useMemo(() => isWDneroVaultSupported(chainId), [chainId])
  const { t } = useTranslation()
  const { onOpen, onDismiss, isOpen } = useModalV2()
  const chainNames = useChainNames(WDNERO_VAULT_SUPPORTED_CHAINS)

  const tips = (
    <Flex flexDirection="column" justifyContent="flex-start">
      <IWDneroLogo />
      <Text mt="0.625rem">{t('Stake WDNERO to obtain iWDNERO - in order to be eligible in this public sale.')}</Text>
    </Flex>
  )

  return !wdneroVaultSupported ? (
    <>
      <NetworkSwitcherModal
        isOpen={isOpen}
        supportedChains={WDNERO_VAULT_SUPPORTED_CHAINS}
        title={t('Stake WDNERO')}
        description={t('Lock WDNERO on %chain% to obtain iWDNERO', {
          chain: chainNames,
        })}
        buttonText={t('Switch chain to stake WDNERO')}
        onDismiss={onDismiss}
        tips={tips}
      />
      <Button width="100%" onClick={onOpen} {...props}>
        {t('Stake WDNERO')}
      </Button>
    </>
  ) : null
}
