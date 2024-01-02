import { Pool } from '@dneroswap/widgets-internal'
import { Coin } from '@dneroswap/aptos-swap-sdk'
import { ConnectWalletButton } from 'components/ConnectWalletButton'

import WDneroCollectModal from '../PoolCard/WDneroCollectModal'
import WDneroStakeModal from '../PoolCard/WDneroStakeModal'

const StakeActions = Pool.withStakeActions(WDneroStakeModal)

const StakeActionContainer = Pool.withStakeActionContainer(StakeActions, ConnectWalletButton)

export default Pool.withTableActions<Coin>(Pool.withCollectModalTableAction(WDneroCollectModal), StakeActionContainer)
