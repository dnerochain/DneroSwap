import { useTranslation } from '@dneroswap/localization'
import { Box, Flex, RowBetween, Text } from '@dneroswap/uikit'
import { memo, useMemo } from 'react'
import { AprResult } from '../hooks'
import { AprButton } from './AprButton'
import { AutoCompoundTag } from './Tags'

interface Props {
  id: number | string
  apr: AprResult
  isAprLoading: boolean
  withWDneroReward?: boolean
  lpSymbol: string
  autoCompound?: boolean
  totalStakedInUsd: number
  totalAssetsInUsd: number
  onAprClick?: () => void
  userLpAmounts?: bigint
  totalSupplyAmounts?: bigint
  precision?: bigint
  lpTokenDecimals?: number
  aprTimeWindow?: number
}

export const YieldInfo = memo(function YieldInfo({
  id,
  apr,
  isAprLoading,
  withWDneroReward,
  autoCompound,
  totalAssetsInUsd,
  lpSymbol,
  userLpAmounts,
  totalSupplyAmounts,
  totalStakedInUsd,
  precision,
  lpTokenDecimals,
  aprTimeWindow,
}: Props) {
  const { t } = useTranslation()

  const earning = useMemo(
    () => (withWDneroReward && apr.isInWDneroRewardDateRange ? ['WDNERO', t('Fees')].join(' + ') : t('Fees')),
    [withWDneroReward, t, apr.isInWDneroRewardDateRange],
  )

  return (
    <Box>
      <RowBetween>
        <Text>{t('APR')}:</Text>
        <AprButton
          id={id}
          apr={apr}
          isAprLoading={isAprLoading}
          lpSymbol={lpSymbol}
          totalAssetsInUsd={totalAssetsInUsd}
          totalSupplyAmounts={totalSupplyAmounts}
          totalStakedInUsd={totalStakedInUsd}
          userLpAmounts={userLpAmounts}
          precision={precision}
          lpTokenDecimals={lpTokenDecimals}
          aprTimeWindow={aprTimeWindow}
        />
      </RowBetween>
      <RowBetween>
        <Text>{t('Earn')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text color="text">{earning}</Text>
          {autoCompound && <AutoCompoundTag ml="0.5em" />}
        </Flex>
      </RowBetween>
    </Box>
  )
})
