import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Text, Balance } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { getBalanceNumber, getFullDisplayBalance } from '@dneroswap/utils/formatBalance'

interface RewardBracketDetailProps {
  wdneroAmount: BigNumber
  rewardBracket?: number
  numberWinners?: string
  isBurn?: boolean
  isHistoricRound?: boolean
  isLoading?: boolean
}

const RewardBracketDetail: React.FC<React.PropsWithChildren<RewardBracketDetailProps>> = ({
  rewardBracket,
  wdneroAmount,
  numberWinners,
  isHistoricRound,
  isBurn,
  isLoading,
}) => {
  const { t } = useTranslation()
  const wdneroPriceBusd = useWDneroPrice()

  const getRewardText = () => {
    const numberMatch = rewardBracket + 1
    if (isBurn) {
      return t('Burn')
    }
    if (rewardBracket === 5) {
      return t('Match all %numberMatch%', { numberMatch })
    }
    return t('Match first %numberMatch%', { numberMatch })
  }

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Skeleton mb="4px" mt="8px" height={16} width={80} />
      ) : (
        <Text bold color={isBurn ? 'failure' : 'secondary'}>
          {getRewardText()}
        </Text>
      )}
      <>
        {isLoading || wdneroAmount.isNaN() ? (
          <Skeleton my="4px" mr="10px" height={20} width={110} />
        ) : (
          <Balance fontSize="20px" bold unit=" WDNERO" value={getBalanceNumber(wdneroAmount)} decimals={0} />
        )}
        {isLoading || wdneroAmount.isNaN() ? (
          <>
            <Skeleton mt="4px" mb="16px" height={12} width={70} />
          </>
        ) : (
          <Balance
            fontSize="12px"
            color="textSubtle"
            prefix="~$"
            value={getBalanceNumber(wdneroAmount.times(wdneroPriceBusd))}
            decimals={0}
          />
        )}
        {isHistoricRound && wdneroAmount && (
          <>
            {numberWinners !== '0' && (
              <Text fontSize="12px" color="textSubtle">
                {getFullDisplayBalance(wdneroAmount.div(parseInt(numberWinners, 10)), 18, 2)} WDNERO {t('each')}
              </Text>
            )}
            <Text fontSize="12px" color="textSubtle">
              {numberWinners} {t('Winning Tickets')}
            </Text>
          </>
        )}
      </>
    </Flex>
  )
}

export default RewardBracketDetail
