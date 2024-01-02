import { Currency } from '@dneroswap/sdk'
import { useContext, memo } from 'react'
import { Box } from '@dneroswap/uikit'

import AccessRisk from 'components/AccessRisk'

import { SwapFeaturesContext } from '../../SwapFeaturesContext'

interface Props {
  currency?: Currency
}

export const RiskCheck = memo(function RiskCheck({ currency }: Props) {
  const { isAccessTokenSupported } = useContext(SwapFeaturesContext)

  if (!isAccessTokenSupported || !currency?.isToken) {
    return null
  }

  return (
    <Box>
      <AccessRisk token={currency} />
    </Box>
  )
})
