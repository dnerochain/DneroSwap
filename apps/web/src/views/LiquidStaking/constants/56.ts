import { NATIVE, WETH9 } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { dneroTokens } from '@dneroswap/tokens'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH, SNDTOKEN } from 'config/constants/liquidStaking'
// FAQs
import { EthWbethFaq } from 'views/LiquidStaking/constants/FAQs/EthWbethFaq'
import { DTokenSndtokenFaq } from 'views/LiquidStaking/constants/FAQs/DTokenSndtokenFaq'
// ABI
import { wbethDneroABI } from 'config/abi/wbethDNERO'
import { snDTokenABI } from 'config/abi/snDTOKEN'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / wBETH',
    contract: WBETH[ChainId.DNERO],
    token0: WETH9[ChainId.DNERO],
    token1: dneroTokens.wbeth,
    abi: wbethDneroABI,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.DNERO],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethDneroABI,
        address: WBETH[ChainId.DNERO],
        functionName: FunctionName.exchangeRate,
      },
    ],
    stakingMethodArgs: ['convertedStakeAmount', 'masterChefAddress'],
    stakingOverrides: [],
    FAQs: EthWbethFaq(),
  },
  {
    stakingSymbol: 'DTOKEN / SnDTOKEN',
    contract: SNDTOKEN[ChainId.DNERO],
    token0: NATIVE[ChainId.DNERO],
    token1: dneroTokens.sndtoken,
    abi: snDTokenABI,
    shouldCheckApproval: false,
    approveToken: null,
    aprUrl: 'https://www.synclub.io/staas/v1/public/staking/sndtoken/apy',
    exchangeRateMultiCall: [
      {
        abi: snDTokenABI,
        address: SNDTOKEN[ChainId.DNERO],
        functionName: FunctionName.convertSnDTokenToDToken,
        args: [1000000000000000000], // 1 SnDTOKEN
      },
    ],
    stakingMethodArgs: [],
    stakingOverrides: ['value'],
    FAQs: DTokenSndtokenFaq(),
  },
]

export default liquidStaking
