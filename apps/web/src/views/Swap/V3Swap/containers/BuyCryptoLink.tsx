import { Currency } from '@dneroswap/sdk'
import { memo } from 'react'
import { Row, Text } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'

import InternalLink from 'components/Links'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCanBuyCrypto } from 'hooks/useCanBuyCrypto'

interface Props {
  currency?: Currency | null
}

export const BuyCryptoLink = memo(function BuyCryptoInstruction({ currency }: Props) {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const canBuyCrypto = useCanBuyCrypto({ chainId, currencySymbol: currency?.symbol })

  if (!currency || !canBuyCrypto) {
    return null
  }

  return (
    <Row alignItems="center" justifyContent="center" mb="4px">
      <Text fontSize="14px">
        {t('Insufficient Funds?')}{' '}
        <InternalLink href={`/buy-crypto?inputCurrency=${currency.symbol}`}>{t('Buy Crypto here.')}</InternalLink>
      </Text>
    </Row>
  )
})
