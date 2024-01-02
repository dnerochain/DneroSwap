import BigNumber from 'bignumber.js'

import { Box, Flex, Text } from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'
import { styled } from 'styled-components'

import { useTranslation } from '@dneroswap/localization'
import { Token } from '@dneroswap/sdk'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'

import { VaultKey } from 'state/types'
import { useCheckVaultApprovalStatus } from '../../../hooks/useApprove'
import VaultApprovalAction from './VaultApprovalAction'
import VaultStakeActions from './VaultStakeActions'

const InlineText = styled(Text)`
  display: inline;
`

const WDneroVaultCardActions: React.FC<
  React.PropsWithChildren<{
    pool: Pool.DeserializedPool<Token>
    accountHasSharesStaked?: boolean
    isLoading: boolean
    performanceFee?: number
  }>
> = ({ pool, accountHasSharesStaked, isLoading, performanceFee }) => {
  const { stakingToken, userData } = pool
  const { t } = useTranslation()
  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(pool.vaultKey ?? VaultKey.WDneroVaultV1)

  return (
    <Flex flexDirection="column">
      <Flex flexDirection="column">
        <Box display="inline">
          <InlineText
            color={accountHasSharesStaked ? 'secondary' : 'textSubtle'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? stakingToken.symbol : t('Stake')}{' '}
          </InlineText>
          <InlineText
            color={accountHasSharesStaked ? 'textSubtle' : 'secondary'}
            textTransform="uppercase"
            bold
            fontSize="12px"
          >
            {accountHasSharesStaked ? t('Staked') : `${stakingToken.symbol}`}
          </InlineText>
        </Box>
        {!isVaultApproved && !accountHasSharesStaked ? (
          <VaultApprovalAction
            vaultKey={pool.vaultKey ?? VaultKey.WDneroVaultV1}
            isLoading={isLoading}
            setLastUpdated={setLastUpdated}
          />
        ) : (
          <VaultStakeActions
            pool={pool}
            stakingTokenBalance={stakingTokenBalance}
            accountHasSharesStaked={accountHasSharesStaked}
            performanceFee={performanceFee}
          />
        )}
      </Flex>
    </Flex>
  )
}

export default WDneroVaultCardActions
