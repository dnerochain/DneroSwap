import { Flex, Text } from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'

import { useTranslation } from '@dneroswap/localization'
import { Token } from '@dneroswap/sdk'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedVaultUser, VaultKey } from 'state/types'
import { getWDneroVaultEarnings } from 'views/Pools/helpers'
import { useAccount } from 'wagmi'
import RecentWDneroProfitBalance from './RecentWDneroProfitBalance'

const RecentWDneroProfitCountdownRow = ({ pool }: { pool: Pool.DeserializedPool<Token> }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const wdneroPriceBusd = useWDneroPrice()
  const { hasAutoEarnings, autoWDneroToDisplay } = getWDneroVaultEarnings(
    account,
    userData.wdneroAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    wdneroPriceBusd.toNumber(),
    pool.vaultKey === VaultKey.WDneroVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : null,
  )

  if (!(userData.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent WDNERO profit')}:`}</Text>
      {hasAutoEarnings && <RecentWDneroProfitBalance wdneroToDisplay={autoWDneroToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentWDneroProfitCountdownRow
