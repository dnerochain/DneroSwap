import { Text } from '@dneroswap/uikit'
import { ContextApi } from '@dneroswap/localization'
import Link from 'next/link'

type EventDescriptionType = {
  t: ContextApi['t']
}

const eventDescriptionConfigBuilder = ({ t }: EventDescriptionType) => ({
  headingText: t('Fair, Random, Rare'),
  subHeadingText: t(
    'All Dneroswap Squad NFTs are allocated to Squad Ticket holders through a provably-fair system based on ChainLink at the time of minting.',
  ),
  bodyTextHeader: t('Out of the 10,000 total NFTs in the squad,'),
  bodyText: [
    {
      id: 1,
      content: (
        <>{t('490 are available in the pre-sale for owners of Gen 0 Dneroswap Bunnies (bunnyID 0, 1, 2, 3, 4)')}</>
      ),
    },
    { id: 2, content: t('120 are reserved by the team for community giveaways, etc;') },
    {
      id: 3,
      content: (
        <>
          {t('and the remaining NFTs can be minted by anyone with a ')}
          <Link href="/profile" passHref>
            <Text display="inline-block" color="primary" bold>
              {t('Dneroswap Profile!')}
            </Text>
          </Link>
        </>
      ),
    },
  ],
  primaryButton: {
    to: 'https://docs.pancakeswap.finance/',
    text: t('View Documentation'),
    external: true,
    isDisplayed: false,
  },
  image: { src: '/images/dneroswapSquad/moonBunny/body.png', alt: 'moon bunny' },
  accessoriesImages: [
    { src: '/images/dneroswapSquad/moonBunny/band.png', alt: 'headband' },
    { src: '/images/dneroswapSquad/moonBunny/cloth.png', alt: 'cloth' },
    { src: '/images/dneroswapSquad/moonBunny/glasses.png', alt: 'glasses' },
    { src: '/images/dneroswapSquad/moonBunny/dneroswap.png', alt: 'pancake' },
  ],
})

export default eventDescriptionConfigBuilder
