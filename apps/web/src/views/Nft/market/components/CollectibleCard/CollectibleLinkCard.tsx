import { NextLinkFromReactRouter } from '@dneroswap/widgets-internal'
import { safeGetAddress } from 'utils'
import { StyledCollectibleCard } from './styles'
import CardBody from './CardBody'
import { CollectibleCardProps } from './types'
import { nftsBaseUrl, dneroswapBunniesAddress } from '../../constants'

const CollectibleLinkCard: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  ...props
}) => {
  const urlId =
    safeGetAddress(nft.collectionAddress) === safeGetAddress(dneroswapBunniesAddress)
      ? nft.attributes[0].value
      : nft.tokenId
  return (
    <StyledCollectibleCard {...props}>
      <NextLinkFromReactRouter to={`${nftsBaseUrl}/collections/${nft.collectionAddress}/${urlId}`}>
        <CardBody nft={nft} nftLocation={nftLocation} currentAskPrice={currentAskPrice} />
      </NextLinkFromReactRouter>
    </StyledCollectibleCard>
  )
}

export default CollectibleLinkCard
