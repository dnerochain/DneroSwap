import { Flex, Text, Button } from '@dneroswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from '@dneroswap/localization'
import { formatNumber } from '@dneroswap/utils/formatBalance'
import { ChainId } from '@dneroswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface SingleLatestRewardProps {
  usdAmountTitle: string
  usdAmount: number
  wdneroAmountTitle: string
  wdneroAmount: number
  disabled: boolean
  clickClaim: () => void
}

const SingleLatestReward: React.FC<React.PropsWithChildren<SingleLatestRewardProps>> = ({
  usdAmountTitle,
  usdAmount,
  wdneroAmountTitle,
  wdneroAmount,
  disabled,
  clickClaim,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  return (
    <LightGreyCard>
      <Flex justifyContent="space-between" mb="7px">
        <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
          {usdAmountTitle}
        </Text>
        <Text bold fontSize="14px" textAlign="right">
          {`$ ${formatNumber(usdAmount)}`}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
          {wdneroAmountTitle}
        </Text>
        <Text bold fontSize="14px" textAlign="right">
          {`~ ${formatNumber(wdneroAmount)} WDNERO`}
        </Text>
      </Flex>
      <Button onClick={clickClaim} disabled={chainId !== ChainId.DNERO || disabled} mt="18px" width="100%">
        {t('Claim')}
      </Button>
    </LightGreyCard>
  )
}

export default SingleLatestReward
