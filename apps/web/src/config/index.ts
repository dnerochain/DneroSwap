import { getFullDecimalMultiplier } from '@dneroswap/utils/getFullDecimalMultiplier'

export const DNERO_BLOCK_TIME = 3

// WDNERO_PER_BLOCK details
// 40 WDNERO is minted per block
// 20 WDNERO per block is sent to Burn pool (A farm just for burning cake)
// 10 WDNERO per block goes to WDNERO syrup pool
// 9 WDNERO per block goes to Yield farms and lottery
// WDNERO_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// WDNERO/Block in src/views/Home/components/WDneroDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const WDNERO_PER_BLOCK = 40
export const BLOCKS_PER_DAY = (60 / DNERO_BLOCK_TIME) * 60 * 24
export const BLOCKS_PER_YEAR = BLOCKS_PER_DAY * 365 // 10512000
export const WDNERO_PER_YEAR = WDNERO_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://pancakeswap.finance'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const DEFAULT_TOKEN_DECIMAL = getFullDecimalMultiplier(18)
export const DEFAULT_GAS_LIMIT = 250000n
export const BOOSTED_FARM_GAS_LIMIT = 500000n
export const BOOSTED_FARM_V3_GAS_LIMIT = 1000000n
export const AUCTION_BIDDERS_TO_FETCH = 500
export const RECLAIM_AUCTIONS_TO_FETCH = 500
export const AUCTION_WHITELISTED_BIDDERS_TO_FETCH = 500
export const IPFS_GATEWAY = 'https://ipfs.io/ipfs'
