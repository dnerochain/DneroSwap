import { useTranslation } from '@dneroswap/localization'
import { Balance, Box, ErrorIcon, Flex, FlexGap, Text } from '@dneroswap/uikit'
import { getBalanceNumber } from '@dneroswap/utils/formatBalance'
import { useVeWDneroBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/WDneroStaking/components/Tooltips'
import { useEpochVotePower } from '../hooks/useEpochVotePower'

const StyledBox = styled(Box)`
  background: ${({ theme }) => theme.card.cardHeaderBackground.default};
  padding: 18px;
  display: flex;
  align-items: center;
  flex-direction: row;
`

export const MyVeWDneroBalance = () => {
  const { t } = useTranslation()
  const { balance } = useVeWDneroBalance()
  const epochPower = useEpochVotePower()
  const showWillUnlockWarning = useMemo(() => {
    return balance.gt(0) && epochPower === 0n
  }, [balance, epochPower])

  return (
    <StyledBox>
      <img src="/images/wdnero-staking/token-vewdnero.png" alt="token-vewdnero" width="58px" />
      <Flex flexDirection={['column', 'column', 'row']} ml="4px">
        <Text fontSize="20px" bold lineHeight="120%" mr="16px">
          {t('MY veWDNERO')}
        </Text>
        <FlexGap gap="4px" alignItems="center">
          <Balance
            fontSize="24px"
            bold
            color={showWillUnlockWarning ? 'warning' : 'secondary'}
            lineHeight="110%"
            value={getBalanceNumber(balance)}
            decimals={2}
          />
          {showWillUnlockWarning ? (
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
              <ErrorIcon color="warning" style={{ marginBottom: '-3.5px' }} />
            </Tooltips>
          ) : null}
        </FlexGap>
      </Flex>
    </StyledBox>
  )
}
