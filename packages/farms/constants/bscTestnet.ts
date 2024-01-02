import { dneroTestnetTokens } from '@dneroswap/tokens'
import { FeeAmount } from '@dneroswap/v3-sdk'
import { getAddress } from 'viem'
import { SerializedFarmConfig } from '..'
import { defineFarmV3Configs } from '../src/defineFarmV3Configs'

export const farmsV3 = defineFarmV3Configs([
  {
    pid: 1,
    lpAddress: '0x5147173E452AE4dd23dcEe7BaAaaAB7318F16F6B',
    token0: dneroTestnetTokens.usdt,
    token1: dneroTestnetTokens.wdtoken,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 2,
    lpAddress: '0xe62C422c1E8083CE3b4526Ff0b16388354AB6E64',
    token0: dneroTestnetTokens.wdnero2,
    token1: dneroTestnetTokens.wdtoken,
    feeAmount: FeeAmount.MEDIUM,
  },
  {
    pid: 3,
    lpAddress: '0xc0E0F94a79Aabc6c655f308Da21D6EbDE64b0995',
    token0: dneroTestnetTokens.mockB,
    token1: dneroTestnetTokens.mockA,
    feeAmount: FeeAmount.LOW,
  },
  {
    pid: 4,
    lpAddress: '0xf7f2894abd4beE559521D754c5D481730E1C7d8C',
    token0: dneroTestnetTokens.mockB,
    token1: dneroTestnetTokens.mockA,
    feeAmount: FeeAmount.LOWEST,
  },
  {
    pid: 5,
    lpAddress: '0x5d9550E870D42Ae03Fab91508cC5722A80CF0b5e',
    token0: dneroTestnetTokens.mockB,
    token1: dneroTestnetTokens.mockA,
    feeAmount: FeeAmount.HIGH,
  },
  {
    pid: 6,
    lpAddress: '0x427d29C609A85AA3aaF87Aff65C392D72588ceC2',
    token0: dneroTestnetTokens.wdnero2,
    token1: dneroTestnetTokens.busd,
    feeAmount: FeeAmount.MEDIUM,
  },
])

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 2, 3) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'WDNERO',
    lpAddress: '0x36e3E4fF6471559b19F66bD10985534d5e214D44',
    token: dneroTestnetTokens.syrup,
    quoteToken: dneroTestnetTokens.wdtoken,
  },
  {
    pid: 3,
    lpSymbol: 'BUSD-WDNERO LP',
    lpAddress: '0xb98C30fA9f5e9cf6749B7021b4DDc0DBFe73b73e',
    token: dneroTestnetTokens.busd,
    quoteToken: dneroTestnetTokens.wdnero,
  },
  {
    pid: 4,
    lpSymbol: 'WDNERO-DTOKEN LP',
    lpAddress: '0xa96818CA65B57bEc2155Ba5c81a70151f63300CD',
    token: dneroTestnetTokens.wdnero,
    quoteToken: dneroTestnetTokens.wdtoken,
  },
  {
    pid: 10,
    lpSymbol: 'DTOKEN-BUSD LP',
    lpAddress: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
    token: dneroTestnetTokens.wdtoken,
    quoteToken: dneroTestnetTokens.busd,
  },
  {
    pid: 9,
    lpSymbol: 'BUSD-USDC LP',
    lpAddress: '0x7CA885d338462790DD1B5416ebe6bec75ee045a1',
    token: dneroTestnetTokens.mockBusd, // coins[0]
    quoteToken: dneroTestnetTokens.usdc, // coins[1]
    stableSwapAddress: '0xd5E56CD4c8111643a94Ee084df31F44055a1EC9F',
    infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
    stableLpFee: 0.0002,
    stableLpFeeRateOfTotalFee: 0.5,
  },
  {
    pid: 11,
    lpSymbol: 'USDT-BUSD LP',
    lpAddress: '0x9Fa2Ef2C3dF6F903F4b73047311e861C51a11B60',
    token: dneroTestnetTokens.usdt, // coins[0]
    quoteToken: dneroTestnetTokens.mockBusd, // coins[1]
    stableSwapAddress: '0xc418d68751Cbe0407C8fdd90Cde73cE95b892f39',
    infoStableSwapAddress: '0xaE6C14AAA753B3FCaB96149e1E10Bc4EDF39F546',
    stableLpFee: 0.0002,
    stableLpFeeRateOfTotalFee: 0.5,
  },
].map((p) => ({
  ...p,
  token: p.token.serialize,
  quoteToken: p.quoteToken.serialize,
  lpAddress: getAddress(p.lpAddress),
}))

export default farms
