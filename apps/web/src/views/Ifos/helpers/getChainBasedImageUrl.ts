import { ChainId, getChainName } from '@dneroswap/chains'

type GetUrlOptions = {
  chainId?: ChainId
  name: string
}

export function getChainBasedImageUrl({ chainId = ChainId.DNERO, name }: GetUrlOptions) {
  return `/images/ifos/${name}/${getChainName(chainId)}.png`
}
