import { Token } from '@dneroswap/sdk'
import { Pool } from '@dneroswap/widgets-internal'
import StakeModal from '../../Modals/StakeModal'

export default Pool.withStakeActions<Token>(StakeModal)
