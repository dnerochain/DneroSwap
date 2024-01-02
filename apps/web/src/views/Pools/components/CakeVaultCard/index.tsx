import { Box, Button, CardBody, CardProps, Flex, FlexGap, Skeleton, TokenPairImage, useModal } from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'

import { useTranslation } from '@dneroswap/localization'
import { Token } from '@dneroswap/sdk'
import { vaultPoolConfig } from 'config/constants/pools'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedWDneroVault, DeserializedLockedWDneroVault, VaultKey } from 'state/types'
import { styled } from 'styled-components'
import { VaultPosition, getVaultPosition } from 'utils/wdneroPool'
import BenefitsModal from 'views/Pools/components/RevenueSharing/BenefitsModal'
import useVWDnero from 'views/Pools/hooks/useVWDnero'
import { useAccount } from 'wagmi'

import { VeWDneroCard, VeWDneroUpdateCard } from 'views/WDneroStaking/components/SyrupPool'
import { useIsUserDelegated } from 'views/WDneroStaking/hooks/useIsUserDelegated'
import LockedStakingApy from '../LockedPool/LockedStakingApy'
import CardFooter from '../PoolCard/CardFooter'
import { VaultPositionTagWithLabel } from '../Vault/VaultPositionTag'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import VaultCardActions from './VaultCardActions'

const StyledCardBody = styled(CardBody)<{ isLoading: boolean }>`
  min-height: ${({ isLoading }) => (isLoading ? '0' : '254px')};
`

interface WDneroVaultProps extends CardProps {
  pool?: Pool.DeserializedPool<Token>
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
  showIWDnero?: boolean
  showSkeleton?: boolean
}

interface WDneroVaultDetailProps {
  isLoading?: boolean
  account?: string
  pool: Pool.DeserializedPool<Token>
  vaultPool: DeserializedWDneroVault
  accountHasSharesStaked?: boolean
  defaultFooterExpanded?: boolean
  showIWDnero?: boolean
  performanceFeeAsDecimal?: number
}

export const WDneroVaultDetail: React.FC<React.PropsWithChildren<WDneroVaultDetailProps>> = ({
  isLoading = false,
  account,
  pool,
  vaultPool,
  accountHasSharesStaked,
  showIWDnero,
  performanceFeeAsDecimal,
  defaultFooterExpanded,
}) => {
  const { t } = useTranslation()
  const { isInitialization } = useVWDnero()
  const [onPresentViewBenefitsModal] = useModal(
    <BenefitsModal pool={pool} userData={(vaultPool as DeserializedLockedWDneroVault)?.userData} />,
    true,
    false,
    'revenueModal',
  )

  const vaultPosition = getVaultPosition(vaultPool.userData)
  const isLocked = (vaultPool as DeserializedLockedWDneroVault)?.userData?.locked
  const isUserDelegated = useIsUserDelegated()

  if (!pool) {
    return null
  }

  return (
    <>
      <StyledCardBody isLoading={isLoading}>
        {vaultPosition >= VaultPosition.LockedEnd && <VeWDneroUpdateCard isLockEndOrAfterLock />}

        {account && pool.vaultKey === VaultKey.WDneroVault && !isUserDelegated && (
          <VaultPositionTagWithLabel userData={(vaultPool as DeserializedLockedWDneroVault)?.userData} />
        )}
        {account && pool.vaultKey === VaultKey.WDneroVault && isLocked && !isUserDelegated ? (
          <>
            <LockedStakingApy
              userData={(vaultPool as DeserializedLockedWDneroVault).userData}
              showIWDnero={showIWDnero}
              pool={pool}
              account={account}
            />
            {vaultPosition === VaultPosition.Locked && isInitialization && !showIWDnero && (
              <Button mt="16px" width="100%" variant="secondary" onClick={onPresentViewBenefitsModal}>
                {t('View Benefits')}
              </Button>
            )}
          </>
        ) : (
          <>
            {account && vaultPosition === VaultPosition.Flexible && !isUserDelegated ? (
              <VeWDneroUpdateCard isFlexibleStake />
            ) : (
              <VeWDneroCard />
            )}
            {/* {<StakingApy pool={pool} />} */}
            {vaultPosition !== VaultPosition.None && !isUserDelegated && (
              <FlexGap mt="16px" gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
                <Box>
                  {account && (
                    <Box mb="8px">
                      <UnstakingFeeCountdownRow vaultKey={pool.vaultKey ?? VaultKey.WDneroVaultV1} />
                    </Box>
                  )}
                  {/* <RecentWDneroProfitRow pool={pool} /> */}
                </Box>
                <Flex flexDirection="column">
                  {account && (
                    <VaultCardActions
                      pool={pool}
                      accountHasSharesStaked={accountHasSharesStaked}
                      isLoading={isLoading}
                      performanceFee={performanceFeeAsDecimal}
                    />
                  )}
                </Flex>
              </FlexGap>
            )}
          </>
        )}
      </StyledCardBody>
      {account && !isUserDelegated && (
        <CardFooter isLocked={isLocked} defaultExpanded={defaultFooterExpanded} pool={pool} account={account} />
      )}
    </>
  )
}

const WDneroVaultCard: React.FC<React.PropsWithChildren<WDneroVaultProps>> = ({
  pool,
  showStakedOnly,
  defaultFooterExpanded,
  showIWDnero = false,
  showSkeleton = true,
  ...props
}) => {
  const { address: account } = useAccount()

  const vaultPool = useVaultPoolByKey(pool?.vaultKey || VaultKey.WDneroVault)
  const totalStaked = pool?.totalStaked

  const userShares = vaultPool?.userData?.userShares
  const isVaultUserDataLoading = vaultPool?.userData?.isLoading
  const performanceFeeAsDecimal = vaultPool?.fees?.performanceFeeAsDecimal

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool?.userData || isVaultUserDataLoading

  if (!pool || (showStakedOnly && !accountHasSharesStaked)) {
    return null
  }

  return (
    <Pool.StyledCard isActive {...props}>
      <Pool.PoolCardHeader isStaking={accountHasSharesStaked}>
        {!showSkeleton || (totalStaked && totalStaked.gte(0)) ? (
          <>
            <Pool.PoolCardHeaderTitle
              title={vaultPoolConfig?.[pool.vaultKey ?? '']?.name ?? ''}
              subTitle={vaultPoolConfig?.[pool.vaultKey ?? ''].description ?? ''}
            />
            <TokenPairImage {...vaultPoolConfig?.[pool.vaultKey ?? ''].tokenImage} width={64} height={64} />
          </>
        ) : (
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="column">
              <Skeleton width={100} height={26} mb="4px" />
              <Skeleton width={65} height={20} />
            </Flex>
            <Skeleton width={58} height={58} variant="circle" />
          </Flex>
        )}
      </Pool.PoolCardHeader>
      <WDneroVaultDetail
        isLoading={isLoading}
        account={account}
        pool={pool}
        vaultPool={vaultPool}
        accountHasSharesStaked={accountHasSharesStaked}
        showIWDnero={showIWDnero}
        performanceFeeAsDecimal={performanceFeeAsDecimal}
        defaultFooterExpanded={defaultFooterExpanded}
      />
    </Pool.StyledCard>
  )
}

export default WDneroVaultCard
