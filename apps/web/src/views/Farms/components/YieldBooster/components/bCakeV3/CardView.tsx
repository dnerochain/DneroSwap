import { useTranslation } from '@dneroswap/localization'
import { Box, Button, Flex } from '@dneroswap/uikit'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import { useCallback, useMemo } from 'react'
import {
  useBWDneroBoostLimitAndLockInfo,
  useUserBoostedPoolsTokenId,
  useUserPositionInfo,
  useVeWDneroUserMultiplierBeforeBoosted,
} from '../../hooks/bWDneroV3/useBWDneroV3Info'
import { useBoostStatus } from '../../hooks/bWDneroV3/useBoostStatus'
import { useUpdateLiquidity } from '../../hooks/bWDneroV3/useUpdateLiquidity'

import { StatusView } from './StatusView'

const SHOULD_UPDATE_THRESHOLD = 1.1

export const BWDneroV3CardView: React.FC<{
  tokenId: string
  pid: number
  isFarmStaking?: boolean
}> = ({ tokenId, pid, isFarmStaking }) => {
  const { t } = useTranslation()
  const { status: boostStatus, updateStatus } = useBoostStatus(pid, tokenId)
  const { updateBoostedPoolsTokenId } = useUserBoostedPoolsTokenId()
  const {
    data: { boostMultiplier },
    updateUserPositionInfo,
  } = useUserPositionInfo(tokenId)

  const onDone = useCallback(() => {
    updateStatus()
    updateUserPositionInfo()
    updateBoostedPoolsTokenId()
  }, [updateStatus, updateUserPositionInfo, updateBoostedPoolsTokenId])
  const { locked, isLockEnd } = useBWDneroBoostLimitAndLockInfo()

  const { updateLiquidity, isConfirming } = useUpdateLiquidity(tokenId, onDone)
  const { veWDneroUserMultiplierBeforeBoosted } = useVeWDneroUserMultiplierBeforeBoosted(tokenId)
  const { theme } = useTheme()
  const lockValidated = useMemo(() => {
    return locked && !isLockEnd
  }, [locked, isLockEnd])
  const shouldUpdate = useMemo(() => {
    if (
      boostMultiplier &&
      veWDneroUserMultiplierBeforeBoosted &&
      locked &&
      boostMultiplier * SHOULD_UPDATE_THRESHOLD <= veWDneroUserMultiplierBeforeBoosted
    )
      return true
    return false
  }, [boostMultiplier, veWDneroUserMultiplierBeforeBoosted, locked])

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView
        status={boostStatus}
        boostedMultiplier={boostMultiplier}
        expectMultiplier={veWDneroUserMultiplierBeforeBoosted}
        isFarmStaking={isFarmStaking}
        shouldUpdate={shouldUpdate}
      />
      <Box>
        {!lockValidated && (
          <NextLink href="/wdnero-staking" passHref>
            <Button style={{ whiteSpace: 'nowrap' }}>{t('Go to Lock')}</Button>
          </NextLink>
        )}
        {shouldUpdate && lockValidated && (
          <Button
            onClick={() => {
              updateLiquidity()
            }}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              padding: isConfirming ? '0 10px' : undefined,
            }}
            isLoading={isConfirming}
          >
            {isConfirming ? t('Confirming') : t('Update')}
          </Button>
        )}
      </Box>
    </Flex>
  )
}
