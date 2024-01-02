import { useTranslation } from '@dneroswap/localization'
import { Box, Flex, HelpIcon, Link, RocketIcon, ScanLink, Text, useTooltip } from '@dneroswap/uikit'
import { formatNumber } from '@dneroswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCurrentBlockTimestamp from 'hooks/useCurrentBlockTimestamp'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { ModalInner, VotingBoxBorder, VotingBoxCardInner } from './styles'

export const StyledScanLink = styled(ScanLink)`
  display: inline-flex;
  font-size: 14px;
  > svg {
    width: 14px;
  }
`

const FixedTermWrapper = styled(Box)<{ expired?: boolean }>`
  width: 100%;
  margin: 16px 0;
  padding: 1px 1px 3px 1px;
  background: ${({ theme, expired }) => (expired ? theme.colors.warning : 'linear-gradient(180deg, #53dee9, #7645d9)')};
  border-radius: ${({ theme }) => theme.radii.default};
`

const FixedTermCardInner = styled(Box)<{ expired?: boolean }>`
  position: relative;
  z-index: 1;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.radii.default};

  &:before {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border-radius: ${({ theme }) => theme.radii.default};
    background: ${({ theme, expired }) => (expired ? 'rgba(255, 178, 55, 0.098)' : theme.colors.gradientBubblegum)};
  }
`

interface DetailsViewProps {
  total: number
  wdneroBalance?: number
  wdneroVaultBalance?: number
  wdneroPoolBalance?: number
  poolsBalance?: number
  wdneroDTokenLpBalance?: number
  ifoPoolBalance?: number
  lockedWDneroBalance?: number
  lockedEndTime?: number
  block: number
}

const DetailsView: React.FC<React.PropsWithChildren<DetailsViewProps>> = ({
  total,
  wdneroBalance,
  wdneroVaultBalance,
  wdneroPoolBalance,
  poolsBalance,
  wdneroDTokenLpBalance,
  ifoPoolBalance,
  lockedWDneroBalance,
  lockedEndTime,
  block,
}) => {
  const { t } = useTranslation()
  const blockTimestamp = useCurrentBlockTimestamp()

  const { chainId } = useActiveChainId()

  const isBoostingExpired = useMemo(() => {
    return lockedEndTime !== 0 && new BigNumber(blockTimestamp?.toString()).gte(lockedEndTime)
  }, [blockTimestamp, lockedEndTime])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      {Number.isFinite(lockedWDneroBalance) && (
        <Box>
          <Text>
            {isBoostingExpired
              ? t(
                  'Your vWDNERO boosting was expired at the snapshot block. Renew your fixed-term staking position to activate the boost for future voting proposals.',
                )
              : t(
                  'Voting power is calculated using the staking amount and remaining staking duration of the fixed-term WDNERO staking position at the block.',
                )}
          </Text>
          <Text bold m="10px 0">
            {`${t('WDNERO locked:')} ${formatNumber(lockedWDneroBalance, 0, 2)}`}
          </Text>
          <Link external href="/pools">
            {t('Go to Pools')}
          </Link>
        </Box>
      )}
    </>,
    {
      placement: 'bottom',
    },
  )

  return (
    <ModalInner mb="0">
      <Text as="p" mb="24px" fontSize="14px" color="textSubtle">
        {t(
          'Your voting power is determined by the amount of WDNERO you held and the remaining duration on the fixed-term staking position (if you have one) at the block detailed below. WDNERO held in other places does not contribute to your voting power.',
        )}
      </Text>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Overview')}
      </Text>
      <VotingBoxBorder>
        <VotingBoxCardInner>
          <Text color="secondary">{t('Your Voting Power')}</Text>
          <Text bold fontSize="20px">
            {formatNumber(total, 0, 3)}
          </Text>
        </VotingBoxCardInner>
      </VotingBoxBorder>
      <Text color="secondary" textTransform="uppercase" mb="4px" bold fontSize="14px">
        {t('Your voting power at block')}
        <StyledScanLink useDneroCoinFallback href={getBlockExploreLink(block, 'block', chainId)} ml="8px">
          {block}
        </StyledScanLink>
      </Text>
      {Number.isFinite(wdneroBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Wallet')}
          </Text>
          <Text textAlign="right">{formatNumber(wdneroBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(wdneroVaultBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Flexible WDNERO Staking')}
          </Text>
          <Text textAlign="right">{formatNumber(wdneroVaultBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(wdneroPoolBalance) && (
        <>
          {lockedWDneroBalance === 0 ? (
            <Flex alignItems="center" justifyContent="space-between" mb="4px">
              <Flex>
                <Text color="textSubtle" fontSize="16px">
                  {t('Fixed Term WDNERO Staking')}
                </Text>
                {tooltipVisible && tooltip}
                <Flex ref={targetRef}>
                  <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                </Flex>
              </Flex>
              <Text color="failure" textAlign="right">
                {formatNumber(wdneroPoolBalance, 0, 3)}
              </Text>
            </Flex>
          ) : (
            <FixedTermWrapper expired={isBoostingExpired}>
              <FixedTermCardInner expired={isBoostingExpired}>
                <Flex>
                  <Text color="textSubtle" fontSize="16px" mr="auto">
                    {t('Fixed Term WDNERO Staking')}
                  </Text>
                  {tooltipVisible && tooltip}
                  <Flex ref={targetRef}>
                    <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
                  </Flex>
                </Flex>
                <Flex mt="10px" flexDirection="column" alignItems="flex-end">
                  <Text bold color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="16px">
                    {formatNumber(wdneroPoolBalance, 0, 3)}
                  </Text>
                  <Flex>
                    <RocketIcon color={isBoostingExpired ? 'warning' : 'secondary'} width="15px" height="15px" />
                    <Text ml="4px" color={isBoostingExpired ? 'warning' : 'secondary'} fontSize="12px">
                      {isBoostingExpired ? t('Boosting Expired') : t('Boosted by vWDNERO')}
                    </Text>
                  </Flex>
                </Flex>
              </FixedTermCardInner>
            </FixedTermWrapper>
          )}
        </>
      )}
      {Number.isFinite(ifoPoolBalance) && Number(ifoPoolBalance) > 0 && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('IFO Pool')}
          </Text>
          <Text textAlign="right">{formatNumber(ifoPoolBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(poolsBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('Other Syrup Pools')}
          </Text>
          <Text textAlign="right">{formatNumber(poolsBalance, 0, 3)}</Text>
        </Flex>
      )}
      {Number.isFinite(wdneroDTokenLpBalance) && (
        <Flex alignItems="center" justifyContent="space-between" mb="4px">
          <Text color="textSubtle" fontSize="16px">
            {t('WDNERO DTOKEN LP')}
          </Text>
          <Text textAlign="right">{formatNumber(wdneroDTokenLpBalance, 0, 3)}</Text>
        </Flex>
      )}
    </ModalInner>
  )
}

export default DetailsView
