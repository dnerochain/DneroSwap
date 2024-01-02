import { ChainId } from '@dneroswap/chains'
import SwapWarningTokensConfig from 'config/constants/swapWarningTokens'
import SafemoonWarning from './SafemoonWarning'
import ItamWarning from './ItamWarning'
import BondlyWarning from './BondlyWarning'
import CcarWarning from './CcarWarning'
import BTTWarning from './BTTWarning'
import RugPullWarning from './RugPullWarning'
import FREEWarning from './FREEWarning'
import GalaWarning from './GalaWarning'
import ADTOKENWarning from './ADTOKENWarning'
import XCADWarning from './XCADWarning'
import METISWarning from './METISWarning'
import LUSDWarning from './LUSDWarning'

const { safemoon, bondly, itam, ccar, bttold, pokemoney, free, gala, adtokenc, xcad, metis, lusd } =
  SwapWarningTokensConfig[ChainId.DNERO]

const DNERO_WARNING_LIST = {
  [safemoon.address]: {
    symbol: safemoon.symbol,
    component: <SafemoonWarning />,
  },
  [bondly.address]: {
    symbol: bondly.symbol,
    component: <BondlyWarning />,
  },
  [itam.address]: {
    symbol: itam.symbol,
    component: <ItamWarning />,
  },
  [ccar.address]: {
    symbol: ccar.symbol,
    component: <CcarWarning />,
  },
  [bttold.address]: {
    symbol: bttold.symbol,
    component: <BTTWarning />,
  },
  [pokemoney.address]: {
    symbol: pokemoney.symbol,
    component: <RugPullWarning />,
  },
  [free.address]: {
    symbol: free.symbol,
    component: <FREEWarning />,
  },
  [gala.address]: {
    symbol: gala.symbol,
    component: <GalaWarning />,
  },
  [adtokenc.address]: {
    symbol: adtokenc.symbol,
    component: <ADTOKENWarning />,
  },
  [xcad.address]: {
    symbol: xcad.symbol,
    component: <XCADWarning />,
  },
  [metis.address]: {
    symbol: metis.symbol,
    component: <METISWarning />,
  },
  [lusd.address]: {
    symbol: lusd.symbol,
    component: <LUSDWarning />,
  },
}

export default DNERO_WARNING_LIST
