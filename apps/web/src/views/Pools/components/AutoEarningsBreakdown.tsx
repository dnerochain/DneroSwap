import { Text, Box } from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'

import { useTranslation } from '@dneroswap/localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { Token } from '@dneroswap/sdk'
import dayjs from 'dayjs'
import { getWDneroVaultEarnings } from '../helpers'

interface AutoEarningsBreakdownProps {
  pool: Pool.DeserializedPool<Token>
  account: string
}

const AutoEarningsBreakdown: React.FC<React.PropsWithChildren<AutoEarningsBreakdownProps>> = ({ pool, account }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { earningTokenPrice } = pool
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const { autoWDneroToDisplay, autoUsdToDisplay } = getWDneroVaultEarnings(
    account,
    userData.wdneroAtLastUserAction,
    userData.userShares,
    pricePerFullShare,
    earningTokenPrice,
    pool.vaultKey === VaultKey.WDneroVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee
          .plus((userData as DeserializedLockedVaultUser).currentOverdueFee)
          .plus((userData as DeserializedLockedVaultUser).userBoostedShare)
      : null,
  )

  const lastActionInMs = userData.lastUserActionTime ? parseInt(userData.lastUserActionTime) * 1000 : 0
  const hourDiffSinceLastAction = dayjs().diff(dayjs(lastActionInMs), 'hours')
  const earnedWDneroPerHour = hourDiffSinceLastAction ? autoWDneroToDisplay / hourDiffSinceLastAction : 0
  const earnedUsdPerHour = hourDiffSinceLastAction ? autoUsdToDisplay / hourDiffSinceLastAction : 0

  return (
    <>
      <Text>{t('Earned since your last action')}:</Text>
      <Text bold>
        {new Date(lastActionInMs).toLocaleString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </Text>
      {hourDiffSinceLastAction ? (
        <Box mt="12px">
          <Text>{t('Hourly Average')}:</Text>
          <Text bold>
            {earnedWDneroPerHour < 0.01 ? '<0.01' : earnedWDneroPerHour.toFixed(2)} WDNERO
            <Text display="inline-block" ml="5px">
              ({earnedUsdPerHour < 0.01 ? '<0.01' : `~${earnedUsdPerHour.toFixed(2)}`} USD)
            </Text>
          </Text>
        </Box>
      ) : null}
      <Box mt="12px">
        <Text>
          {t(
            '*Please note that any deposit, withdraw, extend or convert action will combine earned rewards with the original staked amount. Resetting this number to 0.',
          )}
        </Text>
      </Box>
    </>
  )
}

export default AutoEarningsBreakdown
