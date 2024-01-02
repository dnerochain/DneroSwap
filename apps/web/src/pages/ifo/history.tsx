import { SUPPORTED_CHAIN_IDS } from '@dneroswap/ifos'

import { IfoPageLayout } from '../../views/Ifos'
import PastIfo from '../../views/Ifos/PastIfo'

const PastIfoPage = () => {
  return <PastIfo />
}

PastIfoPage.Layout = IfoPageLayout

PastIfoPage.chains = SUPPORTED_CHAIN_IDS

export default PastIfoPage
