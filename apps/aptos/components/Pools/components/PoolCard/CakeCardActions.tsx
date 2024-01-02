import { Pool } from '@dneroswap/widgets-internal'
import { Coin } from '@dneroswap/aptos-swap-sdk'
import WDneroCollectModal from './WDneroCollectModal'
import WDneroStakeModal from './WDneroStakeModal'

const HarvestActions = Pool.withCollectModalCardAction(WDneroCollectModal)
const StakeActions = Pool.withStakeActions(WDneroStakeModal)

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
