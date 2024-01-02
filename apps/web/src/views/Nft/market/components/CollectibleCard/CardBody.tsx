import { Box, CardBody, Flex, Text } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import { safeGetAddress } from 'utils'
import { useDTOKENPrice } from 'hooks/useDTOKENPrice'
import PreviewImage from './PreviewImage'
import { CostLabel, LowestPriceMetaRow, MetaRow } from './styles'
import LocationTag from './LocationTag'
import { CollectibleCardProps } from './types'
import { useGetLowestPriceFromNft } from '../../hooks/useGetLowestPrice'
import { dneroswapBunniesAddress } from '../../constants'
import NFTMedia from '../NFTMedia'

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const dtokenBusdPrice = useDTOKENPrice()
  const isDneroswapBunny = safeGetAddress(nft.collectionAddress) === safeGetAddress(dneroswapBunniesAddress)
  const { isFetching, lowestPrice } = useGetLowestPriceFromNft(nft)

  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
        {isDneroswapBunny && (
          <LowestPriceMetaRow lowestPrice={lowestPrice} isFetching={isFetching} dtokenBusdPrice={dtokenBusdPrice} />
        )}
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} dtokenBusdPrice={dtokenBusdPrice} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
