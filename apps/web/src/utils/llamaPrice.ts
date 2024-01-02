import { defiLlamaChainNames } from '@dneroswap/chains'
import { WDNERO } from '@dneroswap/tokens'
import { getWDneroPriceFromOracle } from 'hooks/useWDneroPrice'

// use for fetch usd outside of the liquidity pools on DneroSwap
export const fetchTokenUSDValue = async (chainId: number, tokenAddresses: string[]) => {
  if (!tokenAddresses.length || !defiLlamaChainNames[chainId]) return new Map<string, string>()

  const list = tokenAddresses.map((address) => `${defiLlamaChainNames[chainId]}:${address}`).join(',')

  let tokenPriceArray: { coins: { [key: string]: { price: string } } } = {
    coins: {},
  }

  await fetch(`https://coins.llama.fi/prices/current/${list}`).then(async (res) => {
    const data = await res.json()
    tokenPriceArray = {
      coins: {
        ...tokenPriceArray.coins,
        ...data.coins,
      },
    }
  })

  const commonTokenUSDValue = new Map<string, string>()

  const wdneroAddress = tokenAddresses
    .map((address) =>
      address.toLowerCase() === WDNERO?.[chainId]?.address?.toLowerCase()
        ? `${defiLlamaChainNames[chainId]}:${address}`
        : '',
    )
    .filter(Boolean)

  if (wdneroAddress.length > 0) {
    const wdneroPrice = parseFloat(await getWDneroPriceFromOracle())
    wdneroAddress.forEach((address) => {
      tokenPriceArray = {
        coins: {
          ...tokenPriceArray.coins,
          [address]: {
            price: wdneroPrice.toString(),
          },
        },
      }
    })
  }

  Object.entries(tokenPriceArray.coins || {}).forEach(([key, value]) => {
    const [, address] = key.split(':')
    commonTokenUSDValue.set(address, value.price)
  })

  return commonTokenUSDValue
}
