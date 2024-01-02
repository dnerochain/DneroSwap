import addresses from 'config/constants/contracts'

import { GRAPH_API_PREDICTION_WDNERO, GRAPH_API_PREDICTION_DTOKEN } from 'config/constants/endpoints'
import { getAddressFromMap } from 'utils/addressHelpers'
import { dneroTokens } from '@dneroswap/tokens'

export default {
  DTOKEN: {
    address: getAddressFromMap(addresses.predictionsDTOKEN),
    api: GRAPH_API_PREDICTION_DTOKEN,
    chainlinkOracleAddress: getAddressFromMap(addresses.chainlinkOracleDTOKEN),
    displayedDecimals: 4,
    token: dneroTokens.dtoken,
  },
  WDNERO: {
    address: getAddressFromMap(addresses.predictionsWDNERO),
    api: GRAPH_API_PREDICTION_WDNERO,
    chainlinkOracleAddress: getAddressFromMap(addresses.chainlinkOracleWDNERO),
    displayedDecimals: 4,
    token: dneroTokens.wdnero,
  },
}
