import { WETH9, NATIVE } from '@dneroswap/sdk'
import { ChainId } from '@dneroswap/chains'
import { ethereumTokens } from '@dneroswap/tokens'
import { LiquidStakingList, FunctionName } from 'views/LiquidStaking/constants/types'
import { WBETH } from 'config/constants/liquidStaking'
// FAQs
import { EthWbethFaq } from 'views/LiquidStaking/constants/FAQs/EthWbethFaq'
// ABI
import { wbethEthABI } from 'config/abi/wbethETH'

const liquidStaking: LiquidStakingList[] = [
  {
    stakingSymbol: 'ETH / wBETH',
    contract: WBETH[ChainId.GOERLI],
    token0: NATIVE[ChainId.GOERLI],
    token1: ethereumTokens.wbeth,
    abi: wbethEthABI,
    shouldCheckApproval: true,
    approveToken: WETH9[ChainId.GOERLI],
    aprUrl: 'https://www.binance.com/bapi/earn/v1/public/pos/cftoken/project/getPurchasableProject',
    exchangeRateMultiCall: [
      {
        abi: wbethEthABI,
        address: WBETH[ChainId.GOERLI],
        functionName: FunctionName.exchangeRate,
      },
    ],
    stakingMethodArgs: ['masterChefAddress'],
    stakingOverrides: ['value'],
    FAQs: EthWbethFaq(),
  },
]

export default liquidStaking
