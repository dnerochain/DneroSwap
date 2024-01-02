import { useTranslation } from '@dneroswap/localization'
import {
  AddIcon,
  Balance,
  Flex,
  IconButton,
  Message,
  MessageText,
  MinusIcon,
  Skeleton,
  Text,
  useModal,
} from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'
import { LearnMoreLink } from 'views/WDneroStaking/components/SyrupPool'
import { useIsMigratedToVeWDnero } from 'views/WDneroStaking/hooks/useIsMigratedToVeWDnero'

import { Token } from '@dneroswap/sdk'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { LightGreyCard } from 'components/Card'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getVaultPosition, VaultPosition } from 'utils/wdneroPool'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'
import VaultStakeModal from '../VaultStakeModal'

interface HasStakeActionProps {
  pool: Pool.DeserializedPool<Token>
  stakingTokenBalance: BigNumber
  performanceFee?: number
}

const HasSharesActions: React.FC<React.PropsWithChildren<HasStakeActionProps>> = ({
  pool,
  stakingTokenBalance,
  performanceFee,
}) => {
  const { userData } = useVaultPoolByKey(pool.vaultKey ?? VaultKey.WDneroVaultV1)

  const wdneroAsBigNumber = userData?.balance?.wdneroAsBigNumber
  const wdneroAsNumberBalance = userData?.balance?.wdneroAsNumberBalance
  const isMigratedToVeWDnero = useIsMigratedToVeWDnero()

  const lockPosition = getVaultPosition(userData)

  const { stakingToken } = pool
  const { t } = useTranslation()
  const wdneroPriceBusd = useWDneroPrice()
  const stakedDollarValue = wdneroPriceBusd.gt(0)
    ? getBalanceNumber(wdneroAsBigNumber?.multipliedBy(wdneroPriceBusd), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(
    <VaultStakeModal stakingMax={wdneroAsBigNumber ?? new BigNumber(0)} pool={pool} isRemovingStake />,
    true,
    true,
    `withdraw-vault-${pool.sousId}-${pool.vaultKey}`,
  )
  return (
    <LightGreyCard>
      <Flex mb="16px" justifyContent="space-between" alignItems="center">
        <Flex flexDirection="column">
          <Balance fontSize="20px" bold value={wdneroAsNumberBalance ?? 0} decimals={5} />
          <Text as={Flex} fontSize="12px" color="textSubtle" flexWrap="wrap">
            {wdneroPriceBusd.gt(0) ? (
              <Balance
                value={stakedDollarValue}
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                unit=" USD"
              />
            ) : (
              <Skeleton mt="1px" height={16} width={64} />
            )}
          </Text>
        </Flex>
        <Flex>
          <IconButton
            variant="secondary"
            onClick={() => {
              onPresentUnstake()
            }}
            mr="6px"
          >
            <MinusIcon color="primary" width="24px" />
          </IconButton>
          <IconButton
            disabled
            variant="secondary"
            onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
          >
            <AddIcon color="primary" width="24px" height="24px" />
          </IconButton>
        </Flex>
      </Flex>
      <Message variant="warning" mb="16px">
        <MessageText>
          {lockPosition === VaultPosition.Flexible ? (
            <>
              {t('Flexible WDNERO pool is discontinued and no longer distributing rewards.')}
              <LearnMoreLink withArrow />
            </>
          ) : isMigratedToVeWDnero ? (
            t(
              'Extending or adding WDNERO is not available for migrated positions. To get more veWDNERO, withdraw from the unlocked WDNERO pool position, and add WDNERO to veWDNERO.',
            )
          ) : (
            t(
              'The lock period has ended. To get more veWDNERO, withdraw from the unlocked WDNERO pool position, and add WDNERO to veWDNERO.',
            )
          )}
        </MessageText>
      </Message>
    </LightGreyCard>
  )
}

export default HasSharesActions
