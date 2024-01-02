import { dneroTokens } from '@dneroswap/tokens'

import { useFetchIfo } from 'state/pools/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'

import IfoContainer from './components/IfoContainer'
import IfoSteps from './components/IfoSteps'
import ComingSoonSection from './components/ComingSoonSection'
import { useIWDneroBridgeStatus } from './hooks/useIfoCredit'

const SoonIfo = () => {
  useFetchIfo()
  const { chainId } = useActiveChainId()
  const { sourceChainCredit } = useIWDneroBridgeStatus({
    ifoChainId: chainId,
  })
  return (
    <IfoContainer
      ifoSection={<ComingSoonSection />}
      ifoSteps={
        <IfoSteps
          isLive={false}
          hasClaimed={false}
          isCommitted={false}
          ifoCurrencyAddress={dneroTokens.wdnero.address}
          sourceChainIfoCredit={sourceChainCredit}
        />
      }
    />
  )
}

export default SoonIfo
