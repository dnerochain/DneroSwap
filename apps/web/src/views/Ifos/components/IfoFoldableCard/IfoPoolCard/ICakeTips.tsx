import { useTranslation } from '@dneroswap/localization'
import { ChainId } from '@dneroswap/sdk'
import { Address } from 'viem'

import { StakeButton } from './StakeButton'
import { useIWDneroBridgeStatus } from '../../../hooks/useIfoCredit'
import { useChainNames } from '../../../hooks/useChainNames'
import { BridgeButton } from './BridgeButton'
import { WarningTips, LinkTitle, ContentText } from '../../WarningTips'

type Props = {
  ifoId: string

  ifoChainId: ChainId

  ifoAddress?: Address
}

export function IWDneroTips({ ifoChainId, ifoId, ifoAddress }: Props) {
  const { t } = useTranslation()
  const { noIWDnero, hasBridged, shouldBridgeAgain, sourceChainCredit, destChainCredit } = useIWDneroBridgeStatus({
    ifoChainId,
    ifoAddress,
  })
  const chainName = useChainNames([ifoChainId])

  if (hasBridged) {
    return (
      <BridgeButton
        mt="0.625rem"
        ifoChainId={ifoChainId}
        iwdnero={sourceChainCredit}
        dstIcake={destChainCredit}
        buttonVisible={false}
        ifoId={ifoId}
      />
    )
  }

  const tips = noIWDnero
    ? t('You don’t have any iWDNERO available for IFO public sale.')
    : shouldBridgeAgain
    ? t('Bridge iWDNERO again if you have extended your WDNERO staking or added more WDNERO')
    : t('Bridge your iWDNERO to participate this sale on %chain%', {
        chain: chainName,
      })

  const action = noIWDnero ? (
    <StakeButton />
  ) : (
    <BridgeButton ifoChainId={ifoChainId} iwdnero={sourceChainCredit} dstIcake={destChainCredit} ifoId={ifoId} />
  )

  return (
    <WarningTips
      mt="1.5rem"
      action={action}
      title={!shouldBridgeAgain && <LinkTitle href="/ifo#ifo-how-to">{t('How to Take Part')} »</LinkTitle>}
      content={<ContentText>{tips}</ContentText>}
    />
  )
}
