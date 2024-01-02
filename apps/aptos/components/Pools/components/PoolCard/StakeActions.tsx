import { Token } from '@dneroswap/swap-sdk-core'
import { Pool } from '@dneroswap/widgets-internal'
import StakeModal from './StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
