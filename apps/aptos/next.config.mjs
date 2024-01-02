import bundleAnalyzer from '@next/bundle-analyzer'

import { withWebSecurityHeaders } from '@dneroswap/next-config/withWebSecurityHeaders'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  transpilePackages: [
    '@dneroswap/localization',
    '@dneroswap/hooks',
    '@dneroswap/utils',
    '@dneroswap/tokens',
    '@dneroswap/farms',
    '@dneroswap/widgets-internal',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/swap',
        permanent: false,
      },
    ]
  },
}

export default withBundleAnalyzer(withVanillaExtract(withWebSecurityHeaders(nextConfig)))
