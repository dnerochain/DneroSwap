import { withWebSecurityHeaders } from '@dneroswap/next-config/withWebSecurityHeaders'
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'

const withVanillaExtract = createVanillaExtractPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@dneroswap/uikit', '@dneroswap/hooks', '@dneroswap/localization', '@dneroswap/utils'],
  compiler: {
    styledComponents: true,
  },
}

export default withVanillaExtract(withWebSecurityHeaders(nextConfig))
