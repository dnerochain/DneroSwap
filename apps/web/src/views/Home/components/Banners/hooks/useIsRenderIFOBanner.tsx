import { useChainCurrentBlock } from 'state/block/hooks'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { ChainId } from '@dneroswap/chains'

const useIsRenderIfoBanner = () => {
  const currentBlock = useChainCurrentBlock(ChainId.DNERO)

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  return !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
}

export default useIsRenderIfoBanner
