import {
  BalanceWithLoading,
  Box,
  Button,
  Flex,
  Heading,
  HelpIcon,
  Skeleton,
  Text,
  useMatchBreakpoints,
  useModal,
  useTooltip,
} from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'
import { styled } from 'styled-components'

import { useTranslation } from '@dneroswap/localization'
import { Token } from '@dneroswap/sdk'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedWDneroVault, VaultKey } from 'state/types'
import { VaultPosition, getVaultPosition } from 'utils/wdneroPool'
import BenefitsModal from 'views/Pools/components/RevenueSharing/BenefitsModal'
import { getWDneroVaultEarnings } from 'views/Pools/helpers'
import useVWDnero from 'views/Pools/hooks/useVWDnero'
import { useAccount } from 'wagmi'

import AutoEarningsBreakdown from '../../AutoEarningsBreakdown'
import UnstakingFeeCountdownRow from '../../WDneroVaultCard/UnstakingFeeCountdownRow'
import useUserDataInVaultPresenter from '../../LockedPool/hooks/useUserDataInVaultPresenter'
import { ActionContainer, ActionContent, ActionTitles, RowActionContainer } from './styles'

const HelpIconWrapper = styled.div`
  align-self: center;
`

interface AutoHarvestActionProps {
  pool: Pool.DeserializedPool<Token>
}

const AutoHarvestAction: React.FunctionComponent<React.PropsWithChildren<AutoHarvestActionProps>> = ({ pool }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { isInitialization } = useVWDnero()
  const { isMobile } = useMatchBreakpoints()

  const { earningTokenPrice, vaultKey, userDataLoaded } = pool
  const vaultData = useVaultPoolByKey(pool.vaultKey)
  const {
    userData: { userShares, wdneroAtLastUserAction },
    pricePerFullShare,
  } = vaultData
  const { hasAutoEarnings, autoWDneroToDisplay, autoUsdToDisplay } = getWDneroVaultEarnings(
    account,
    wdneroAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
    vaultKey === VaultKey.WDneroVault
      ? (vaultData as DeserializedLockedWDneroVault).userData.currentPerformanceFee
          .plus((vaultData as DeserializedLockedWDneroVault).userData.currentOverdueFee)
          .plus((vaultData as DeserializedLockedWDneroVault).userData.userBoostedShare)
      : null,
  )

  const { secondDuration, weekDuration } = useUserDataInVaultPresenter({
    lockStartTime:
      vaultKey === VaultKey.WDneroVault ? (vaultData as DeserializedLockedWDneroVault).userData?.lockStartTime ?? '0' : '0',
    lockEndTime:
      vaultKey === VaultKey.WDneroVault ? (vaultData as DeserializedLockedWDneroVault).userData?.lockEndTime ?? '0' : '0',
  })

  const { boostFactor } = useVaultApy({ duration: secondDuration })

  const vaultPosition = getVaultPosition(vaultData.userData)

  const {
    targetRef: tagTargetRefOfRecentProfit,
    tooltip: tagTooltipOfRecentProfit,
    tooltipVisible: tagTooltipVisibleOfRecentProfit,
  } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom',
  })

  const [onPresentViewBenefitsModal] = useModal(
    <BenefitsModal pool={pool} userData={(vaultData as DeserializedLockedWDneroVault)?.userData} />,
    true,
    false,
    'revenueModal',
  )

  const actionTitle = (
    <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
      {t('Recent WDNERO profit')}
    </Text>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Heading>0</Heading>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <RowActionContainer style={{ flexDirection: 'column', flex: 1 }}>
      <Flex justifyContent="space-between">
        <Box width="100%">
          <ActionTitles>{actionTitle}</ActionTitles>
          <ActionContent>
            <Flex flex="1" flexDirection="column" alignSelf="flex-start">
              <>
                {hasAutoEarnings ? (
                  <>
                    <Flex>
                      <BalanceWithLoading lineHeight="1" bold fontSize="20px" decimals={5} value={autoWDneroToDisplay} />
                      {tagTooltipVisibleOfRecentProfit && tagTooltipOfRecentProfit}
                      <HelpIconWrapper ref={tagTargetRefOfRecentProfit}>
                        <HelpIcon ml="4px" color="textSubtle" />
                      </HelpIconWrapper>
                    </Flex>
                    {Number.isFinite(earningTokenPrice) && earningTokenPrice > 0 && (
                      <BalanceWithLoading
                        display="inline"
                        fontSize="12px"
                        color="textSubtle"
                        decimals={2}
                        prefix="~"
                        value={autoUsdToDisplay}
                        unit=" USD"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Heading color="textDisabled">0</Heading>
                    <Text fontSize="12px" color="textDisabled">
                      0 USD
                    </Text>
                  </>
                )}
              </>
            </Flex>
            <Flex flex="1.3" flexDirection="column" alignSelf="flex-start" alignItems="flex-start">
              {[VaultPosition.Flexible, VaultPosition.None].includes(vaultPosition) && (
                <UnstakingFeeCountdownRow vaultKey={vaultKey} isTableVariant />
              )}
            </Flex>
          </ActionContent>
        </Box>
        {!isMobile && vaultKey === VaultKey.WDneroVault && (vaultData as DeserializedLockedWDneroVault).userData.locked && (
          <Box minWidth="123px">
            <ActionTitles>
              <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                {t('Yield boost')}
              </Text>
            </ActionTitles>
            <ActionContent>
              <Flex flex="1" flexDirection="column" alignSelf="flex-start">
                <BalanceWithLoading
                  color="text"
                  lineHeight="1"
                  bold
                  fontSize="20px"
                  value={boostFactor ? boostFactor?.toString() : '0'}
                  decimals={2}
                  unit="x"
                />
                <Text fontSize="12px" color="textSubtle">
                  {t('Lock for %duration%', { duration: weekDuration })}
                </Text>
              </Flex>
            </ActionContent>
          </Box>
        )}
      </Flex>
      {vaultKey === VaultKey.WDneroVault &&
        (vaultData as DeserializedLockedWDneroVault).userData.locked &&
        vaultPosition === VaultPosition.Locked &&
        isInitialization && (
          <Button mt="16px" width="100%" variant="secondary" onClick={onPresentViewBenefitsModal}>
            {t('View Benefits')}
          </Button>
        )}
    </RowActionContainer>
  )
}

export default AutoHarvestAction
