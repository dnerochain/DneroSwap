import { useMemo } from 'react'
import { useTranslation } from '@dneroswap/localization'
import { Text, Flex, LogoRoundIcon, Box, Balance } from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'

import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { useVaultPoolByKey, usePoolsWithVault } from 'state/pools/hooks'
import { VaultKey, DeserializedLockedWDneroVault } from 'state/types'
import { Token } from '@dneroswap/sdk'

const SharingPoolNameCell = () => {
  const { t } = useTranslation()
  const { userData } = useVaultPoolByKey(VaultKey.WDneroVault) as DeserializedLockedWDneroVault
  const { pools } = usePoolsWithVault()

  const wdneroPool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>
  const stakingToken = wdneroPool?.stakingToken
  const stakingTokenPrice = wdneroPool?.stakingTokenPrice

  const currentLockedAmountNumber = useMemo(
    () => userData?.balance?.wdneroAsNumberBalance,
    [userData?.balance?.wdneroAsNumberBalance],
  )

  const usdValueStaked = useMemo(
    () =>
      stakingToken && stakingTokenPrice
        ? getBalanceNumber(userData?.balance?.wdneroAsBigNumber.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
        : null,
    [userData?.balance?.wdneroAsBigNumber, stakingTokenPrice, stakingToken],
  )

  return (
    <Flex mb="16px">
      <LogoRoundIcon mr="8px" width={43} height={43} style={{ minWidth: 43 }} />
      <Box>
        <Text fontSize={12} color="secondary" bold lineHeight="110%" textTransform="uppercase">
          {t('WDNERO locked')}
        </Text>
        <Balance bold decimals={2} fontSize={20} lineHeight="110%" value={currentLockedAmountNumber} />
        <Balance
          bold
          prefix="~ "
          unit=" USD"
          decimals={2}
          fontSize={12}
          fontWeight={400}
          lineHeight="110%"
          color="textSubtle"
          value={usdValueStaked}
        />
      </Box>
    </Flex>
  )
}

export default SharingPoolNameCell
