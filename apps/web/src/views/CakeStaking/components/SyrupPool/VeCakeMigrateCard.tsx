import { useTranslation } from '@dneroswap/localization'
import { Box, Flex, Text } from '@dneroswap/uikit'
import { memo } from 'react'
import { useCheckIsUserAllowMigrate } from '../../hooks/useCheckIsUserAllowMigrate'
import { useIsMigratedToVeWDnero } from '../../hooks/useIsMigratedToVeWDnero'
import { LearnMoreLink } from './LearnMoreLink'
import { VeWDneroButton } from './VeWDneroButton'
import { ShineStyledBox } from './VeWDneroCard'

export const VeWDneroMigrateCard: React.FC<{ isTableView?: boolean; lockEndTime?: string }> = memo(
  ({ isTableView, lockEndTime }) => {
    const { t } = useTranslation()
    const isMigratedToVeWDnero = useIsMigratedToVeWDnero()
    const isUserAllowMigrate = useCheckIsUserAllowMigrate(lockEndTime)
    if (!isUserAllowMigrate) return null
    return (
      <ShineStyledBox
        p="10px"
        style={{ alignItems: 'center', gap: 10, flexDirection: 'column', flexBasis: isTableView ? '50%' : undefined }}
      >
        <Flex alignItems="center" style={{ gap: 10 }}>
          <img src="/images/wdnero-staking/token-vewdnero.png" alt="token-vewdnero" width="38px" />
          <Box>
            <Text color="white" bold fontSize={14} pr="20px">
              {isMigratedToVeWDnero ? (
                t('Your WDNERO pool position has been migrated to veWDNERO.')
              ) : (
                <>
                  {t('All fixed term staking positions must migrate to veWDNERO to continue receiving rewards.')}
                  <LearnMoreLink />
                </>
              )}
            </Text>
            {isMigratedToVeWDnero && (
              <Text mt="10px" color="white" bold fontSize={14} pr="20px">
                {t(
                  'Extending or adding WDNERO is not available for migrated positions. You will be able to withdraw WDNERO when the lock ends.',
                )}
                <LearnMoreLink />
              </Text>
            )}
          </Box>
        </Flex>
        {!isTableView && !isMigratedToVeWDnero && <VeWDneroButton type="migrate" />}
      </ShineStyledBox>
    )
  },
)
