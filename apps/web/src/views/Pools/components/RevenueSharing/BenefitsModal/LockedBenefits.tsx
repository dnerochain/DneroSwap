import { useMemo } from 'react'
import { useTranslation } from '@dneroswap/localization'
import { Box, Flex, Text, Card, IWDneroIcon, BWDneroIcon, VWDneroIcon } from '@dneroswap/uikit'
import { NextLinkFromReactRouter } from '@dneroswap/widgets-internal'

import Image from 'next/image'
import BigNumber from 'bignumber.js'
import BenefitsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsText'
import useWDneroBenefits from 'components/Menu/UserMenu/hooks/useWDneroBenefits'
import { useVaultApy } from 'hooks/useVaultApy'
import { VaultKey, DeserializedLockedWDneroVault } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'

const LockedBenefits = () => {
  const { t } = useTranslation()
  const { data: wdneroBenefits } = useWDneroBenefits()
  const { getLockedApy, getBoostFactor } = useVaultApy()
  const { userData } = useVaultPoolByKey(VaultKey.WDneroVault) as DeserializedLockedWDneroVault
  const { secondDuration } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime ?? '0',
    lockEndTime: userData?.lockEndTime ?? '0',
  })

  const lockedApy = useMemo(() => getLockedApy(secondDuration), [getLockedApy, secondDuration])
  const boostFactor = useMemo(() => getBoostFactor(secondDuration), [getBoostFactor, secondDuration])
  const delApy = useMemo(() => new BigNumber(lockedApy).div(boostFactor).toNumber(), [lockedApy, boostFactor])

  const iWDneroTooltipComponent = () => (
    <>
      <Text>
        {t('iWDNERO allows you to participate in the IFO public sales and commit up to %iWDnero% amount of WDNERO.', {
          iWDnero: wdneroBenefits?.iWDnero,
        })}
      </Text>
      <NextLinkFromReactRouter to="/ifo">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  const bWDneroTooltipComponent = () => (
    <>
      <Text>{t('bWDNERO allows you to boost your yield in DneroSwap Farms by up to 2x.')}</Text>
      <NextLinkFromReactRouter to="/farms">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  const vWDneroTooltipComponent = () => (
    <>
      <Text>
        {t('vWDNERO boosts your voting power to %totalScore% in the DneroSwap voting governance.', {
          totalScore: wdneroBenefits?.vWDnero?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  return (
    <Box position="relative">
      <Box position="absolute" right="20px" top="-55px" zIndex={1}>
        <Image width={73} height={84} alt="lockWDNERObenefit" src="/images/pool/lockWDNERObenefit.png" />
      </Box>
      <Card mb="24px">
        <Box padding={16}>
          <Text fontSize={12} bold color="secondary" textTransform="uppercase">
            {t('locked benefits')}
          </Text>
          <Box mt="8px">
            <Flex mt="8px" flexDirection="row" alignItems="center">
              <Text color="textSubtle" fontSize="14px" mr="auto">
                {t('WDNERO Yield')}
              </Text>
              <Text style={{ display: 'inline-block' }} color="success" bold>
                {`${Number(lockedApy).toFixed(2)}%`}
              </Text>
              <Text ml="2px" as="del" bold>{`${Number(delApy).toFixed(2)}%`}</Text>
            </Flex>
            <BenefitsText
              title="iWDNERO"
              value={wdneroBenefits?.iWDnero}
              tooltipComponent={iWDneroTooltipComponent()}
              icon={<IWDneroIcon width={24} height={24} mr="8px" />}
            />
            <BenefitsText
              title="bWDNERO"
              value={t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
              tooltipComponent={bWDneroTooltipComponent()}
              icon={<BWDneroIcon width={24} height={24} mr="8px" />}
            />
            <BenefitsText
              title="vWDNERO"
              value={wdneroBenefits?.vWDnero?.vaultScore}
              tooltipComponent={vWDneroTooltipComponent()}
              icon={<VWDneroIcon width={24} height={24} mr="8px" />}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default LockedBenefits
