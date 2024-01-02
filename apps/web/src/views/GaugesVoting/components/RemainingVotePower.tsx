import { useTranslation } from '@dneroswap/localization'
import { Balance, Box, ErrorIcon, Flex, FlexGap, Text } from '@dneroswap/uikit'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeWDneroBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/WDneroStaking/components/Tooltips'
import { useWDneroLockStatus } from 'views/WDneroStaking/hooks/useVeWDneroUserInfo'
import { useEpochVotePower } from '../hooks/useEpochVotePower'

const StyledBox = styled(Box)`
  border-radius: 16px;
  background: linear-gradient(229deg, #1fc7d4 -13.69%, #7645d9 91.33%);
  padding: 18px;
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 460px;
  }
`

export const RemainingVotePower: React.FC<{
  votedPercent: number
}> = ({ votedPercent }) => {
  const { t } = useTranslation()

  const { wdneroLockedAmount } = useWDneroLockStatus()
  const locked = useMemo(() => wdneroLockedAmount > 0n, [wdneroLockedAmount])
  const { balance: veWDneroBalance } = useVeWDneroBalance()
  const epochPower = useEpochVotePower()

  // @note: real power is EpochEndPower * (10000 - PercentVoted)
  // use veWDneroBalance as cardinal number for better UX understanding
  const votePower = useMemo(() => {
    return veWDneroBalance.times(10000 - votedPercent * 100).dividedBy(10000)
  }, [veWDneroBalance, votedPercent])

  const realPower = useMemo(() => {
    return new BN(epochPower.toString()).times(10000 - votedPercent * 100).dividedBy(10000)
  }, [epochPower, votedPercent])

  return (
    <StyledBox>
      <img src="/images/wdnero-staking/token-vewdnero.png" alt="token-vewdnero" width="58px" />
      <Flex
        flexDirection={['column', 'column', 'row']}
        justifyContent="space-between"
        width="100%"
        ml="4px"
        alignItems={['flex-start', 'flex-start', 'center']}
      >
        <Text fontSize="20px" bold color="white" lineHeight="2">
          {t('Remaining veWDNERO')}
        </Text>
        {epochPower === 0n && realPower.gt(0) ? (
          <FlexGap gap="4px" alignItems="center">
            <Text textTransform="uppercase" color="warning" bold fontSize={24}>
              {t('unlocking')}
            </Text>
            <Tooltips
              content={
                <>
                  {t(
                    'Your positions are unlocking soon. Therefore, you have no veWDNERO balance at the end of the current voting epoch while votes are being tallied. ',
                  )}
                  <br />
                  <br />
                  {t('Extend your lock to cast votes.')}
                </>
              }
            >
              <ErrorIcon color="warning" style={{ marginBottom: '-2.5px' }} />
            </Tooltips>
          </FlexGap>
        ) : (
          <Tooltips
            disabled={locked}
            content={
              <>
                {t('You have no locked WDNERO.')} {t('To cast your vote, lock your WDNERO for 3 weeks or more.')}
              </>
            }
          >
            <FlexGap gap="4px" alignItems="center">
              <Balance
                fontSize="24px"
                bold
                color={locked ? 'white' : 'warning'}
                lineHeight="110%"
                value={getBalanceNumber(votePower) || 0}
                decimals={2}
              />
              {!locked ? <ErrorIcon color="warning" style={{ marginBottom: '-2.5px' }} /> : null}
            </FlexGap>
          </Tooltips>
        )}
      </Flex>
    </StyledBox>
  )
}
