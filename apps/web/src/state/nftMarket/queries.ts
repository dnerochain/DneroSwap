export const baseNftFields = `
  tokenId
  metadataUrl
  currentAskPrice
  currentSeller
  latestTradedPriceInDTOKEN
  tradeVolumeDTOKEN
  totalTrades
  isTradable
  updatedAt
  otherId
  collection {
    id
  }
`

export const baseTransactionFields = `
  id
  block
  timestamp
  askPrice
  netPrice
  withDTOKEN
  buyer {
    id
  }
  seller {
    id
  }
`

export const collectionBaseFields = `
  id
  name
  symbol
  active
  totalTrades
  totalVolumeDTOKEN
  numberTokensListed
  creatorAddress
  tradingFee
  creatorFee
  whitelistChecker
`
