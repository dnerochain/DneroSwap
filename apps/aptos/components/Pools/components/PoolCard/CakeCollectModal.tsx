import { useQueryClient } from '@dneroswap/awgmi'
import { Pool } from '@dneroswap/widgets-internal'
import useHarvestFarm from 'components/Farms/hooks/useHarvestFarm'
import wdneroPoolRelatedQueries from 'components/Pools/utils/wdneroPoolRelatedQueries'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback } from 'react'
import CollectModalContainer from './CollectModalContainer'

const WDneroCollectModal = ({ earningTokenAddress = '', ...rest }: React.PropsWithChildren<Pool.CollectModalProps>) => {
  const { onReward } = useHarvestFarm(earningTokenAddress)
  const queryClient = useQueryClient()
  const { account } = useActiveWeb3React()

  const onDone = useCallback(() => {
    queryClient.invalidateQueries({
      predicate: wdneroPoolRelatedQueries(account),
    })
  }, [account, queryClient])

  return <CollectModalContainer {...rest} onDone={onDone} onReward={onReward} />
}

export default WDneroCollectModal
