/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { confirmOrderCancellation, confirmOrderSubmission, saveOrder } from 'utils/localStorageOrders'
import { Hash } from 'viem'
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  TransactionType,
  clearAllChainTransactions,
  NonDneroFarmTransactionType,
  FarmTransactionStatus,
} from './actions'
import { resetUserState } from '../global/actions'

const now = () => Date.now()

export interface TransactionDetails {
  hash: Hash
  approval?: { tokenAddress: string; spender: string }
  type?: TransactionType
  order?: Order
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number> }
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  nonDneroFarm?: NonDneroFarmTransactionType
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (
        transactions,
        { payload: { chainId, from, hash, approval, summary, translatableSummary, claim, type, order, nonDneroFarm } },
      ) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = transactions[chainId] ?? {}
        txs[hash as Hash] = {
          hash: hash as Hash,
          approval,
          summary,
          translatableSummary,
          claim,
          from,
          addedTime: now(),
          type,
          order,
          nonDneroFarm,
        }
        transactions[chainId] = txs
        if (order) saveOrder(chainId, from, order, true)
      },
    )
    .addCase(clearAllTransactions, () => {
      return {}
    })
    .addCase(clearAllChainTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt, nonDneroFarm } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()

      if (tx.type === 'limit-order-submission') {
        confirmOrderSubmission(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (tx.type === 'limit-order-cancellation') {
        confirmOrderCancellation(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (tx.type === 'non-dnero-farm') {
        if (tx.nonDneroFarm.steps[0].status === FarmTransactionStatus.PENDING) {
          if (receipt.status === FarmTransactionStatus.FAIL) {
            tx.nonDneroFarm = { ...tx.nonDneroFarm, status: receipt.status }
          }

          tx.nonDneroFarm.steps[0] = {
            ...tx.nonDneroFarm.steps[0],
            status: receipt.status,
          }
        } else {
          tx.nonDneroFarm = nonDneroFarm
        }
      }
    })
    .addCase(resetUserState, (transactions, { payload: { chainId, newChainId } }) => {
      if (!newChainId && transactions[chainId]) {
        transactions[chainId] = {}
      }
    }),
)
