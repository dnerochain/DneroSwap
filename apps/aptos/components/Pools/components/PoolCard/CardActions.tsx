import { Pool } from '@dneroswap/widgets-internal'
import { Coin } from '@dneroswap/aptos-swap-sdk'
import StakeActions from './StakeActions'
import HarvestActions from './HarvestActions'

export default Pool.withCardActions<Coin>(HarvestActions, StakeActions)
