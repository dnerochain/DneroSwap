import { useTranslation } from '@dneroswap/localization'
import { Box, Flex, Text } from '@dneroswap/uikit'
import { memo } from 'react'
import { WDneroStakingPageLink, LearnMoreLink } from './LearnMoreLink'
import { VeWDneroButton } from './VeWDneroButton'
import { ShineStyledBox } from './VeWDneroCard'

export const VeWDneroUpdateCard: React.FC<{
  isFlexibleStake?: boolean
  isTableView?: boolean
  isLockEndOrAfterLock?: boolean
}> = memo(({ isFlexibleStake, isTableView, isLockEndOrAfterLock }) => {
  const { t } = useTranslation()
  return (
    <ShineStyledBox
      mb={isTableView ? undefined : '15px'}
      p="10px"
      style={{ alignItems: 'center', gap: 10, flexDirection: 'column', flexBasis: isTableView ? '50%' : undefined }}
    >
      <Flex alignItems="center" style={{ gap: 10 }}>
        <img src="/images/wdnero-staking/token-vewdnero.png" alt="token-vewdnero" width="38px" />
        <Box>
          <Text color="white" bold fontSize={14} pr="20px">
            {isFlexibleStake ? (
              <>
                {t('This product has been upgraded to')}
                <WDneroStakingPageLink />
              </>
            ) : (
              <>
                {t('This product have been upgraded. Check out the brand new veWDNERO for more WDNERO staking benefits.')}
                <LearnMoreLink />
              </>
            )}
          </Text>
        </Box>
      </Flex>
      {!isFlexibleStake && <VeWDneroButton type={isLockEndOrAfterLock ? 'check' : 'get'} />}
    </ShineStyledBox>
  )
})

export const VeWDneroUpdateCardTableView: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <ShineStyledBox mb="15px" p="10px" style={{ alignItems: 'center', gap: 10, flexDirection: 'column' }}>
      <Flex alignItems="center" style={{ gap: 10 }}>
        <img src="/images/wdnero-staking/token-vewdnero.png" alt="token-vewdnero" width="38px" />
        <Box>
          <Text color="white" bold fontSize={14} pr="20px">
            {t('This product have been upgraded. Check out the brand new veWDNERO for more WDNERO staking benefits.')}
            <LearnMoreLink />
          </Text>
        </Box>
      </Flex>
    </ShineStyledBox>
  )
})
