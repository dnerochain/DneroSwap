import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import { safeGetAddress } from 'utils'
import { dneroswapBunniesAddress } from '../../constants'
import IndividualDneroswapBunnyPage from './DneroswapBunnyPage'
import IndividualNFTPage from './OneOfAKindNftPage'

const IndividualNFTPageRouter = () => {
  const router = useRouter()
  // For DneroswapBunnies tokenId in url is really bunnyId
  const { collectionAddress, tokenId } = router.query

  if (router.isFallback) {
    return <PageLoader />
  }

  const isPBCollection = safeGetAddress(String(collectionAddress)) === safeGetAddress(dneroswapBunniesAddress)
  if (isPBCollection) {
    return <IndividualDneroswapBunnyPage bunnyId={String(tokenId)} />
  }

  return <IndividualNFTPage collectionAddress={safeGetAddress(collectionAddress as string)} tokenId={String(tokenId)} />
}

export default IndividualNFTPageRouter
