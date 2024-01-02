import { expect, test } from 'vitest'
import * as exportedNames from './index'

test('exports', () => {
  expect(Object.keys(exportedNames)).toMatchInlineSnapshot(`
    [
      "PoolIds",
      "MessageStatus",
      "WDNERO_DTOKEN_LP_MAINNET",
      "wdneroDTokenLpToken",
      "CROSS_CHAIN_ONLY_SUPPORTED_CHAIN_IDS",
      "PROFILE_SUPPORTED_CHAIN_IDS",
      "SUPPORTED_CHAIN_IDS",
      "SOURCE_CHAIN_MAP",
      "SOURCE_CHAIN_TO_DEST_CHAINS",
      "CROSS_CHAIN_GAS_MULTIPLIER",
      "IWDNERO",
      "INFO_SENDER",
      "isIfoSupported",
      "isNativeIfoSupported",
      "isCrossChainIfoSupportedOnly",
      "getContractAddress",
      "getCrossChainMessageUrl",
      "getLayerZeroChainId",
      "getChainIdByLZChainId",
      "getInfoSenderContract",
      "getSourceChain",
      "getDestChains",
      "getIfoConfig",
      "getActiveIfo",
      "getInActiveIfos",
      "getTotalIFOSold",
      "getIfoCreditAddressContract",
      "fetchPublicIfoData",
      "fetchUserIfoCredit",
      "getUserIfoInfo",
      "getCurrentIfoRatio",
      "fetchUserVestingData",
      "getBridgeIWDneroGasFee",
      "getCrossChainMessage",
      "iWDneroABI",
      "dneroswapInfoSenderABI",
      "ifoV7ABI",
    ]
  `)
})
