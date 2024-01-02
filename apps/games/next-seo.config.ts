import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | DneroSwap',
  defaultTitle: 'Game | DneroSwap',
  description: 'Play different games on DneroSwap, using WDNERO and DneroSwap NFTs',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@DneroSwap',
    site: '@DneroSwap',
  },
  openGraph: {
    title: '🥞 DneroSwap - A next evolution DeFi exchange on DNEROCHAIN (DNERO)',
    description: 'Play different games on DneroSwap, using WDNERO and DneroSwap NFTs',
    images: [{ url: 'https://assets.pancakeswap.finance/web/og/v2/hero.jpg' }],
  },
}
