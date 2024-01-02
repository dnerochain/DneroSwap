import { useMemo, useState, useCallback, useEffect } from 'react'
import { ChainId, CurrencyAmount, Currency } from '@dneroswap/sdk'
import {
  INFO_SENDER,
  getCrossChainMessageUrl,
  CrossChainMessage,
  getBridgeIWDneroGasFee,
  getCrossChainMessage,
  dneroswapInfoSenderABI,
  getLayerZeroChainId,
  MessageStatus,
} from '@dneroswap/ifos'
import { useAccount } from 'wagmi'
import { Hash, Address } from 'viem'
import localforage from 'localforage'
import { useQuery } from '@tanstack/react-query'

import { getBlockExploreLink } from 'utils'
import { getViemClients } from 'utils/viem'
import { useContract } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useTransactionAdder } from 'state/transactions/hooks'
import useCatchTxError from 'hooks/useCatchTxError'
import { isUserRejected } from 'utils/sentry'

import { useChainName } from './useChainNames'

export enum BRIDGE_STATE {
  // Before start bridging
  INITIAL,

  // Pending user sign tx on wallet
  PENDING_WALLET_SIGN,

  // Sending tx on source chain
  PENDING_SOURCE_CHAIN_TX,

  // After getting receipt on source chain,
  // while pending tx on destination chain
  PENDING_CROSS_CHAIN_TX,

  // After message got confirmed on destination chain
  FINISHED,
}

export type BaseBridgeState = {
  state: BRIDGE_STATE.INITIAL | BRIDGE_STATE.PENDING_WALLET_SIGN | BRIDGE_STATE.PENDING_SOURCE_CHAIN_TX
}

export type PendingCrossChainState = {
  state: BRIDGE_STATE.PENDING_CROSS_CHAIN_TX
} & CrossChainMessage

export type BridgeSuccessState = {
  state: BRIDGE_STATE.FINISHED
} & CrossChainMessage

export type BridgeState = BaseBridgeState | PendingCrossChainState | BridgeSuccessState

const INITIAL_BRIDGE_STATE: BridgeState = {
  state: BRIDGE_STATE.INITIAL,
}

type Params = {
  ifoId: string
  srcChainId: ChainId
  ifoChainId: ChainId

  // iwdnero on source chain
  iwdnero?: CurrencyAmount<Currency>
  // iwdnero on destination chain
  dstIcake?: CurrencyAmount<Currency>

  // Called if user reject signing bridge tx
  onUserReject?: () => void
}

// NOTE: this hook has side effect
export function useBridgeIWDnero({ srcChainId, ifoChainId, iwdnero, ifoId, dstIcake, onUserReject }: Params) {
  const [signing, setSigning] = useState(false)
  const sourceChainName = useChainName(srcChainId)
  const ifoChainName = useChainName(ifoChainId)
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addTransaction = useTransactionAdder()
  const infoSender = useContract(INFO_SENDER, dneroswapInfoSenderABI, { chainId: srcChainId })
  const { receipt, saveTransactionHash, clearTransactionHash, txHash } = useLatestBridgeTx(ifoId, srcChainId)
  const message = useCrossChainMessage({ txHash: receipt?.transactionHash, srcChainId })
  const { fetchWithCatchTxError } = useCatchTxError({ throwUserRejectError: true })
  const isIWDneroSynced = useMemo(
    () => iwdnero && dstIcake && iwdnero.quotient === dstIwdnero.quotient && iwdnero.quotient > 0n,
    [iwdnero, dstIcake],
  )

  const bridge = useCallback(async () => {
    if (!account) {
      return
    }
    try {
      await fetchWithCatchTxError(async () => {
        setSigning(true)
        const gasEstimate = await getBridgeIWDneroGasFee({
          srcChainId,
          dstChainId: ifoChainId,
          account,
          provider: getViemClients,
        })
        const txReceipt = await callWithGasPrice(infoSender, 'sendSyncMsg', [getLayerZeroChainId(ifoChainId)], {
          value: gasEstimate.quotient,
        })
        saveTransactionHash(txReceipt.hash)
        const summary = `Bridge ${iwdnero?.toExact()} iWDNERO from ${sourceChainName} to ${ifoChainName}`
        addTransaction(txReceipt, {
          summary,
          translatableSummary: {
            text: 'Bridge %iwdneroAmount% iWDNERO from %srcChain% to %ifoChain%',
            data: {
              iwdneroAmount: iwdnero?.toExact() || '',
              srcChain: sourceChainName,
              ifoChain: ifoChainName,
            },
          },
          type: 'bridge-iwdnero',
        })
        setSigning(false)
        return txReceipt
      })
    } catch (e) {
      if (isUserRejected(e)) {
        onUserReject?.()
        return
      }
      console.error(e)
    } finally {
      setSigning(false)
    }
  }, [
    onUserReject,
    fetchWithCatchTxError,
    saveTransactionHash,
    account,
    srcChainId,
    ifoChainId,
    callWithGasPrice,
    infoSender,
    addTransaction,
    iwdnero,
    sourceChainName,
    ifoChainName,
  ])

  const state = useMemo<BridgeState>(() => {
    if (!txHash && !signing && !receipt && !message) {
      return INITIAL_BRIDGE_STATE
    }
    if (signing) {
      return {
        state: BRIDGE_STATE.PENDING_WALLET_SIGN,
      }
    }
    if (txHash && (!receipt || !message)) {
      return {
        state: BRIDGE_STATE.PENDING_SOURCE_CHAIN_TX,
      }
    }
    if (message && message.status !== MessageStatus.DELIVERED) {
      return {
        state: BRIDGE_STATE.PENDING_CROSS_CHAIN_TX,
        ...message,
      }
    }
    if (message && message.status === MessageStatus.DELIVERED) {
      return {
        state: BRIDGE_STATE.FINISHED,
        ...message,
      }
    }
    return INITIAL_BRIDGE_STATE
  }, [signing, receipt, message, txHash])

  const isBridging = useMemo(
    () => state.state !== BRIDGE_STATE.INITIAL && state.state !== BRIDGE_STATE.FINISHED,
    [state.state],
  )

  const isBridged = useMemo(
    () => isIWDneroSynced || message?.status === MessageStatus.DELIVERED,
    [message?.status, isIWDneroSynced],
  )

  return {
    state,
    bridge,
    isBridging,
    isBridged,
    clearBridgeHistory: clearTransactionHash,
  }
}

export function useBridgeMessageUrl(state: BridgeState) {
  return useMemo(
    () =>
      state.state === BRIDGE_STATE.PENDING_CROSS_CHAIN_TX || state.state === BRIDGE_STATE.FINISHED
        ? getCrossChainMessageUrl(state)
        : null,
    [state],
  )
}

export function useBridgeSuccessTxUrl(state: BridgeState) {
  return useMemo(
    () =>
      state.state === BRIDGE_STATE.FINISHED && state.dstTxHash
        ? getBlockExploreLink(state.dstTxHash, 'transaction', state.dstChainId)
        : null,
    [state],
  )
}

const getLastBridgeTxStorageKey = (ifoId: string, chainId?: ChainId, account?: Address) =>
  chainId && account && `bridge-iwdnero-tx-hash-latest-${account}-${chainId}-${ifoId}`

export function useLatestBridgeTx(ifoId: string, chainId?: ChainId) {
  const { address: account } = useAccount()
  const [tx, setTx] = useState<Hash | null>(null)
  const storageKey = useMemo(() => getLastBridgeTxStorageKey(ifoId, chainId, account), [ifoId, chainId, account])

  const tryGetTxFromStorage = useCallback(async () => {
    if (!storageKey) {
      return
    }

    try {
      const lastTx: Hash | null = await localforage.getItem(storageKey)
      if (lastTx) {
        setTx(lastTx)
      }
    } catch (e) {
      console.error(e)
    }
  }, [storageKey])

  const saveTransactionHash = useCallback(
    async (txHash: Hash) => {
      setTx(txHash)
      if (storageKey) {
        await localforage.setItem(storageKey, txHash)
      }
    },
    [storageKey],
  )

  const clearTransactionHash = useCallback(async () => {
    if (storageKey) {
      await localforage.removeItem(storageKey)
    }
  }, [storageKey])

  const { data: receipt } = useQuery(
    [tx, 'bridge-iwdnero-tx-receipt'],
    () => tx && getViemClients({ chainId })?.waitForTransactionReceipt({ hash: tx }),
    {
      enabled: Boolean(tx && chainId),
    },
  )

  // Get last tx from storage on load
  useEffect(() => {
    tryGetTxFromStorage()
  }, [tryGetTxFromStorage])

  return {
    txHash: tx,
    receipt,
    saveTransactionHash,
    clearTransactionHash,
  }
}

type CrossChainMeesageParams = {
  txHash?: Hash | null
  srcChainId?: ChainId
}

export function useCrossChainMessage({ txHash, srcChainId }: CrossChainMeesageParams) {
  const { data: message } = useQuery(
    [txHash, srcChainId, 'ifo-cross-chain-sync-message'],
    () => {
      if (!srcChainId || !txHash) {
        throw new Error('Invalid srcChainId or tx hash')
      }

      return getCrossChainMessage({
        chainId: srcChainId,
        txHash,
      })
    },
    {
      enabled: Boolean(txHash && srcChainId),
      refetchInterval: 5 * 1000,
    },
  )
  return message
}
