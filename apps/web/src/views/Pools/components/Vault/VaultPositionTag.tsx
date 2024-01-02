import { useTranslation } from '@dneroswap/localization'
import {
  Box,
  CheckmarkCircleIcon,
  FlexGap,
  FlexGapProps,
  HotIcon,
  LockIcon,
  PauseCircleIcon,
  SplitIcon,
  Tag,
  TagProps,
  Text,
  UnlockIcon,
} from '@dneroswap/uikit'
import Trans from 'components/Trans'
import { ReactNode, useMemo } from 'react'
import { DeserializedLockedVaultUser } from 'state/types'
import { VaultPosition, getVaultPosition } from 'utils/wdneroPool'
import { useIsMigratedToVeWDnero } from 'views/WDneroStaking/hooks/useIsMigratedToVeWDnero'

const tagConfig: Record<VaultPosition, TagProps> = {
  [VaultPosition.None]: {},
  [VaultPosition.Flexible]: {
    variant: 'success',
  },
  [VaultPosition.Locked]: {
    variant: 'secondary',
  },
  [VaultPosition.LockedEnd]: {
    variant: 'secondary',
    outline: true,
  },
  [VaultPosition.AfterBurning]: {
    variant: 'failure',
    outline: true,
  },
}
const iconConfig: Record<VaultPosition, any> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: SplitIcon,
  [VaultPosition.Locked]: LockIcon,
  [VaultPosition.LockedEnd]: UnlockIcon,
  [VaultPosition.AfterBurning]: HotIcon,
}

const iconColorConfig: Record<VaultPosition, any> = {
  [VaultPosition.None]: null,
  [VaultPosition.Flexible]: 'white',
  [VaultPosition.Locked]: 'white',
  [VaultPosition.LockedEnd]: 'secondary',
  [VaultPosition.AfterBurning]: 'failure',
}

const positionLabel: Record<VaultPosition, ReactNode> = {
  [VaultPosition.None]: '',
  [VaultPosition.Flexible]: <Trans>Flexible</Trans>,
  [VaultPosition.Locked]: <Trans>Locked</Trans>,
  [VaultPosition.LockedEnd]: <Trans>Locked End</Trans>,
  [VaultPosition.AfterBurning]: <Trans>After Burning</Trans>,
}

const VaultPositionTag: React.FC<React.PropsWithChildren<{ position: VaultPosition }>> = ({ position }) => {
  return (
    <Tag {...tagConfig[position]}>
      <Box as={iconConfig[position]} mr="4px" color={iconColorConfig[position]} />
      {positionLabel[position]}
    </Tag>
  )
}

const VeWDneroVaultPositionTag: React.FC = () => {
  const isMigratedToVeWDnero = useIsMigratedToVeWDnero()
  const { t } = useTranslation()
  return (
    <Tag variant={isMigratedToVeWDnero ? 'success' : 'failure'}>
      <Box as={isMigratedToVeWDnero ? CheckmarkCircleIcon : PauseCircleIcon} mr="4px" color="white" />
      {isMigratedToVeWDnero ? t('Migrated') : t('Reward pause')}
    </Tag>
  )
}

export const VaultPositionTagWithLabel: React.FC<
  React.PropsWithChildren<{ userData?: DeserializedLockedVaultUser } & FlexGapProps>
> = ({ userData, ...props }) => {
  const { t } = useTranslation()

  const position = useMemo(() => getVaultPosition(userData), [userData])

  if (position) {
    return (
      <FlexGap alignItems="center" justifyContent="space-between" marginX="8px" mb="8px" gap="12px" {...props}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('My Position')}
        </Text>
        {position < VaultPosition.LockedEnd ? <VeWDneroVaultPositionTag /> : <VaultPositionTag position={position} />}
      </FlexGap>
    )
  }

  return null
}
