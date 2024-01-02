import { dneroTokens } from '@dneroswap/tokens'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'

export const vaultPoolConfig = {
  [VaultKey.WDneroVaultV1]: {
    name: <Trans>Auto WDNERO</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000n,
    tokenImage: {
      primarySrc: `/images/tokens/${dneroTokens.wdnero.address}.png`,
      secondarySrc: '/images/autorenew.svg',
    },
  },
  [VaultKey.WDneroVault]: {
    name: <Trans>Stake WDNERO</Trans>,
    description: <Trans>This product has been upgraded</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1100000n,
    tokenImage: {
      primarySrc: `/images/wdneroGrey.png`,
      secondarySrc: '/images/autorenew-disabled.png',
    },
  },
  [VaultKey.WDneroFlexibleSideVault]: {
    name: <Trans>Flexible WDNERO</Trans>,
    description: <Trans>Reward paused for this position</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000n,
    tokenImage: {
      primarySrc: `/images/wdneroGrey.png`,
      secondarySrc: '/images/autorenew-disabled.png',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO WDNERO',
    description: <Trans>Stake WDNERO to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000n,
    tokenImage: {
      primarySrc: `/images/tokens/${dneroTokens.wdnero.address}.png`,
      secondarySrc: `/images/ifo-pool-icon.svg`,
    },
  },
} as const
