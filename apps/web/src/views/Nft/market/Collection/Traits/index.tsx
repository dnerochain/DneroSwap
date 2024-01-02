import { useRouter } from 'next/router'
import { safeGetAddress } from 'utils'
import Container from 'components/Layout/Container'
import DneroswapBunniesTraits from './DneroswapBunniesTraits'
import { dneroswapBunniesAddress } from '../../constants'
import CollectionTraits from './CollectionTraits'

const Traits = () => {
  const collectionAddress = useRouter().query.collectionAddress as string

  return (
    <>
      <Container py="40px">
        {safeGetAddress(collectionAddress) === safeGetAddress(dneroswapBunniesAddress) ? (
          <DneroswapBunniesTraits collectionAddress={collectionAddress} />
        ) : (
          <CollectionTraits collectionAddress={collectionAddress} />
        )}
      </Container>
    </>
  )
}

export default Traits
