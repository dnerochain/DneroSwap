import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | DneroSwap',
  defaultTitle: 'DneroSwap',
  description:
    'The most popular AMM DEX on DNERO is now on Aptos! Swap your favourite tokens instantly and provide liquidity to start earning from trading fees. Earn WDNERO through yield farming, and stake them to earn more tokens, or use them to buy new tokens in initial farm offerings—all on a platform you can trust.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@DneroSwap',
    site: '@DneroSwap',
  },
  openGraph: {
    title: '🥞 DneroSwap - The most popular DeFi exchange on DNERO, now on Aptos',
    description:
      'The most popular AMM on DNERO is now on Aptos! Swap your favourite tokens instantly and provide liquidity to start earning from trading fees. Earn WDNERO through yield farming, and stake them to earn more tokens, or use them to buy new tokens in initial farm offerings—all on a platform you can trust.',
    images: [{ url: 'https://aptos.pancakeswap.finance/images/hero.jpeg' }],
  },
}
