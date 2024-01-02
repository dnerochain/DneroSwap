import { useRouter } from 'next/router'
import PageLoader from 'components/Loader/PageLoader'
import DneroswapCollectibles from './DneroswapCollectibles'

const DneroswapCollectiblesPageRouter = () => {
  const router = useRouter()

  if (router.isFallback) {
    return <PageLoader />
  }

  return <DneroswapCollectibles />
}

export default DneroswapCollectiblesPageRouter
