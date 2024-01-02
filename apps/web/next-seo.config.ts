import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | DneroSwap',
  defaultTitle: 'DneroSwap',
  description:
    'Cheaper and faster than Uniswap? Discover DneroSwap, the leading DEX on DNEROCHAIN (DNERO) with the best farms in DeFi and a lottery for WDNERO.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@DneroSwap',
    site: '@DneroSwap',
  },
  openGraph: {
    title: '🥞 DneroSwap - A next evolution DeFi exchange on DNEROCHAIN (DNERO)',
    description:
      'The most popular AMM on DNERO by user count! Earn WDNERO through yield farming or win it in the Lottery, then stake it in Syrup Pools to earn more tokens! Initial Farm Offerings (new token launch model pioneered by DneroSwap), NFTs, and more, on a platform you can trust.',
    images: [{ url: 'https://assets.pancakeswap.finance/web/og/v2/hero.jpg' }],
  },
}
