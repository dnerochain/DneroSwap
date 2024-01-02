import { WETH9 } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { dneroTokens } from '@dneroswap/tokens'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH } from 'config/constants/liquidStaking'
// FAQs
import { EthWbethFaq } from 'views/LiquidStaking/constants/FAQs/EthWbethFaq'
// ABI
import { wbethDneroABI } from 'config/abi/wbethDNERO'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / wBETH',
    contract: WBETH[ChainId.DNERO],
    token0: WETH9[ChainId.DNERO_TESTNET],
    token1: dneroTokens.wbeth,
    abi: wbethDneroABI,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.DNERO_TESTNET],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethDneroABI,
        address: WBETH[ChainId.DNERO_TESTNET],
        functionName: FunctionName.exchangeRate,
      },
    ],
    stakingMethodArgs: ['convertedStakeAmount', 'masterChefAddress'],
    stakingOverrides: [],
    FAQs: EthWbethFaq(),
  },
]

export default liquidStaking
