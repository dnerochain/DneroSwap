import { Box, Button, useModal, Flex } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { Token } from '@dneroswap/sdk'
import { VaultKey } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useVaultApprove, useCheckVaultApprovalStatus } from 'views/Pools/hooks/useApprove'
import ExtendButton from 'views/Pools/components/LockedPool/Buttons/ExtendDurationButton'
import LockedStakedModal from 'views/Pools/components/LockedPool/Modals/LockedStakeModal'

interface ActionsProps {
  lockEndTime: string
  lockStartTime: string
  lockedAmount: BigNumber
  stakingToken: Token
  stakingTokenPrice: number
  currentBalance: BigNumber
  isOnlyNeedExtendLock: boolean
  customLockWeekInSeconds: number
}

const Actions: React.FC<React.PropsWithChildren<ActionsProps>> = ({
  lockEndTime,
  lockStartTime,
  lockedAmount,
  stakingToken,
  stakingTokenPrice,
  currentBalance,
  isOnlyNeedExtendLock,
  customLockWeekInSeconds,
}) => {
  const { t } = useTranslation()
  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(VaultKey.WDneroVault)
  const vaultData = useVaultPoolByKey(VaultKey.WDneroVault)
  const {
    userData: { userShares, balance },
  } = vaultData

  const lockedAmountAsNumber = getBalanceNumber(lockedAmount)

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakedModal
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      stakingTokenPrice={stakingTokenPrice}
      stakingTokenBalance={currentBalance}
      customLockWeekInSeconds={customLockWeekInSeconds}
    />,
  )

  const { handleApprove, pendingTx } = useVaultApprove(VaultKey.WDneroVault, setLastUpdated)

  return (
    <Flex width="228px" flexDirection={['column', 'column', 'column', 'row']} m="16px auto auto auto">
      {!isOnlyNeedExtendLock ? (
        <Box width="100%">
          {!isVaultApproved && !balance.wdneroAsBigNumber.gt(0) && !userShares.gt(0) ? (
            <Button width="100%" variant="secondary" disabled={pendingTx} onClick={handleApprove}>
              {t('Enable')}
            </Button>
          ) : (
            <Box width="100%">
              <Button width="100%" onClick={openPresentLockedStakeModal}>
                {t('Lock WDNERO')}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <ExtendButton
          lockEndTime={lockEndTime}
          lockStartTime={lockStartTime}
          stakingToken={stakingToken}
          stakingTokenPrice={stakingTokenPrice}
          currentBalance={currentBalance}
          currentLockedAmount={lockedAmountAsNumber}
          customLockWeekInSeconds={customLockWeekInSeconds}
        >
          {t('Extend Lock')}
        </ExtendButton>
      )}
    </Flex>
  )
}

export default Actions
