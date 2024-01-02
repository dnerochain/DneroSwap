import { useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Flex, Text, Select, OptionProps } from '@dneroswap/uikit'
import { useGetCollection } from 'state/nftMarket/hooks'
import { useTranslation } from '@dneroswap/localization'
import Container from 'components/Layout/Container'
import { safeGetAddress } from 'utils'
import { dneroswapBunniesAddress } from '../../constants'
import DneroswapBunniesCollectionNfts from './DneroswapBunniesCollectionNfts'
import CollectionWrapper from './CollectionWrapper'

const Items = () => {
  const collectionAddress = useRouter().query.collectionAddress as string
  const [sortBy, setSortBy] = useState('updatedAt')
  const { t } = useTranslation()
  const collection = useGetCollection(collectionAddress)
  const isPBCollection = safeGetAddress(collectionAddress) === safeGetAddress(dneroswapBunniesAddress)

  const sortByItems = [
    { label: t('Recently listed'), value: 'updatedAt' },
    { label: t('Lowest price'), value: 'currentAskPrice' },
  ]

  const handleChange = (newOption: OptionProps) => {
    setSortBy(newOption.value)
  }

  return (
    <>
      {isPBCollection ? (
        <Container mb="24px">
          <Flex alignItems="center" justifyContent={['flex-start', null, null, 'flex-end']} mb="24px">
            <Box minWidth="165px">
              <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
                {t('Sort By')}
              </Text>
              <Select options={sortByItems} onOptionChange={handleChange} />
            </Box>
          </Flex>
          <DneroswapBunniesCollectionNfts address={collection?.address} sortBy={sortBy} />
        </Container>
      ) : (
        <CollectionWrapper collection={collection} />
      )}
    </>
  )
}

export default Items
