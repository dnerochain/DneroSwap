import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useDTOKENPrice } from 'hooks/useDTOKENPrice'
import { useStablecoinPrice } from 'hooks/useBUSDPrice'
import { Currency } from '@dneroswap/swap-sdk-core'
import { dneroTokens } from '@dneroswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'

export const useTokenPrice = (token: Currency, enabled = true): BigNumber => {
  const enableWDnero = useMemo(() => enabled && token.equals(dneroTokens.wdnero), [enabled, token])
  const enableDToken = useMemo(() => enabled && token.equals(dneroTokens.dtoken), [enabled, token])
  const enableOther = useMemo(() => enabled && !enableWDnero && !enableDToken, [enabled, enableWDnero, enableDToken])

  const wdneroPrice = useWDneroPrice({ enabled: enableWDnero })
  const dtokenPrice = useDTOKENPrice({ enabled: enableDToken })
  const tokenPrice = useStablecoinPrice(token, { enabled: enableOther })

  if (enableWDnero) {
    return wdneroPrice
  }
  if (enableDToken) {
    return dtokenPrice
  }
  return tokenPrice ? new BigNumber(tokenPrice.toSignificant(18)) : BIG_ZERO
}
