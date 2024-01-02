import { ChainId } from '@dneroswap/chains'
import FixedStaking from 'views/FixedStaking'

const FixedStakingPage = () => {
  return <FixedStaking />
}

FixedStakingPage.chains = [ChainId.DNERO]

export default FixedStakingPage
