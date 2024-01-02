import { ChainId, Pair } from '@dneroswap/aptos-swap-sdk'
import type { SerializedFarmConfig } from '@dneroswap/farms'
import { APT, WDNERO } from 'config/coins'
import { mainnetTokens } from 'config/constants/tokens'

const priceHelperLps: Omit<SerializedFarmConfig, 'pid'>[] = [
  {
    pid: null,
    lpSymbol: 'amAPT-APT LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.amapt,
  },
  {
    pid: null,
    lpSymbol: 'APT-stAPT LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.stapt,
  },
  {
    pid: null,
    lpSymbol: 'APT-WDNERO LP',
    quoteToken: APT[ChainId.MAINNET],
    token: WDNERO[ChainId.MAINNET],
  },
  {
    pid: null,
    lpSymbol: 'APT-ceDTOKEN LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.cedtoken,
  },
  {
    pid: null,
    lpSymbol: 'APT-ETERN LP',
    quoteToken: APT[ChainId.MAINNET],
    token: mainnetTokens.etern,
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: Pair.getAddress(p.token, p.quoteToken),
}))

export default priceHelperLps
