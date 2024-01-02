# Dneroswap Smart Router

`@dneroswap/smart-router` is a SDK for getting best trade routes from Dneroswap AMM.

## Install

```bash
$ pnpm add @dneroswap/smart-router
```

## Usage

Use DNERO as an example. Here's how we use smart router sdk to find the best trade route swapping from DTOKEN to WDNERO and construct a valid swap transaction from the trade route we got.

For working code example, please refer to [smart-router-example](https://github.com/pancakeswap/smart-router-example).

0. Install other dependencies

```bash
$ pnpm add viem graphql-request @dneroswap/sdk @dneroswap/tokens
```

1. Prepare on-chain rpc provider and subgraph providers

```typescript
import { createPublicClient, http } from 'viem'
import { GraphQLClient } from 'graphql-request'
import { SmartRouter } from '@dneroswap/smart-router/evm'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://dnero-dataseed1.binance.org'),
  batch: {
    multicall: {
      batchSize: 1024 * 200,
    },
  },
})

const v3SubgraphClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc')
const v2SubgraphClient = new GraphQLClient('https://proxy-worker-api.pancakeswap.com/dneroswap-exchange')

const quoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: () => publicClient })
```

2. Get candidate pools

```typescript
import { Native } from '@dneroswap/sdk'
import { SmartRouter } from '@dneroswap/smart-router/evm'
import { dneroTokens } from '@dneroswap/tokens'

const swapFrom = Native.onChain(chainId)
const swapTo = dneroTokens.wdnero

const [v2Pools, v3Pools] = await Promise.all([
  SmartRouter.getV2CandidatePools({
    onChainProvider: () => publicClient,
    v2SubgraphProvider: () => v2SubgraphClient,
    v3SubgraphProvider: () => v3SubgraphClient,
    currencyA: swapFrom,
    currencyB: swapTo,
  }),
  SmartRouter.getV3CandidatePools({
    onChainProvider: () => publicClient,
    subgraphProvider: () => v3SubgraphClient,
    currencyA: swapFrom,
    currencyB: swapTo,
  }),
])
```

3. Find the best swap trade route

```typescript
import { CurrencyAmount, TradeType } from '@dneroswap/sdk'

// 0.01 DTOKEN in our example
const amount = CurrencyAmount.fromRawAmount(swapFrom, 10 ** 16)

const trade = await SmartRouter.getBestTrade(amount, swapTo, TradeType.EXACT_INPUT, {
  gasPriceWei: () => publicClient.getGasPrice(),
  maxHops: 2,
  maxSplits: 2,
  poolProvider: SmartRouter.createStaticPoolProvider(pools),
  quoteProvider,
  quoterOptimization: true,
})
```

4. Build the swap transaction from trade

```typescript
import { ChainId } from '@dneroswap/chains'
import { SmartRouter, SmartRouterTrade, SMART_ROUTER_ADDRESSES, SwapRouter } from '@dneroswap/smart-router/evm'
import { hexToBigInt } from 'viem'

const routerAddress = SMART_ROUTER_ADDRESSES[ChainId.DNERO]
// Swap recipient address
const address = '0x'

const { value, calldata } = SwapRouter.swapCallParameters(trade, {
  recipient: address,
  slippageTolerance: new Percent(1),
})

const tx = {
  account: address,
  to: routerAddress,
  data: calldata,
  value: hexToBigInt(value),
}
const gasEstimate = await publicClient.estimateGas(tx)
```
