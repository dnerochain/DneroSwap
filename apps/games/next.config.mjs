import { withWebSecurityHeaders } from '@dneroswap/next-config/withWebSecurityHeaders'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    '@dneroswap/uikit',
    '@dneroswap/hooks',
    '@dneroswap/localization',
    '@dneroswap/utils',
    '@dneroswap/games',
    '@dneroswap/blog',
  ],
  images: {
    contentDispositionType: 'attachment',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.pancakeswap.finance',
        pathname: '/web/**',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },
}

export default withVanillaExtract(withWebSecurityHeaders(nextConfig))
