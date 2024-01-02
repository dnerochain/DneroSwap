import React, { useEffect, useMemo, useRef } from 'react'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import forEach from 'lodash/forEach'
import { useTranslation } from '@dneroswap/localization'
import { usePublicClient } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Box, Text, useToast } from '@dneroswap/uikit'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import {
  BlockNotFoundError,
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptTimeoutError,
} from 'viem'
import { retry, RetryableError } from 'state/multicall/retry'
import { useAppDispatch } from 'state'
import {
  finalizeTransaction,
  FarmTransactionStatus,
  NonDneroFarmTransactionStep,
  MsgStatus,
  NonDneroFarmStepType,
} from './actions'
import { useAllChainTransactions } from './hooks'
import { fetchCelerApi } from './fetchCelerApi'
import { TransactionDetails } from './reducer'

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails,
): boolean {
  if (tx.receipt) return false
  return !fetchedTransactions[tx.hash]
}

export const Updater: React.FC<{ chainId: number }> = ({ chainId }) => {
  const provider = usePublicClient({ chainId })
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions(chainId)

  const { toastError, toastSuccess } = useToast()

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({})

  useEffect(() => {
    if (!chainId || !provider) return

    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          try {
            const receipt: any = await provider.waitForTransactionReceipt({ hash: transaction.hash, timeout: 60_000 })

            dispatch(
              finalizeTransaction({
                chainId,
                hash: transaction.hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: Number(receipt.blockNumber),
                  contractAddress: receipt.contractAddress,
                  from: receipt.from,
                  status: receipt.status === 'success' ? 1 : 0,
                  to: receipt.to,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                },
              }),
            )
            const toast = receipt.status === 'success' ? toastSuccess : toastError
            toast(
              t('Transaction receipt'),
              <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
            )

            merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
          } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
              throw new RetryableError(`Transaction not found: ${transaction.hash}`)
            } else if (error instanceof TransactionReceiptNotFoundError) {
              throw new RetryableError(`Transaction receipt not found: ${transaction.hash}`)
            } else if (error instanceof BlockNotFoundError) {
              throw new RetryableError(`Block not found for transaction: ${transaction.hash}`)
            } else if (error instanceof WaitForTransactionReceiptTimeoutError) {
              throw new RetryableError(`Timeout reached when fetching transaction receipt: ${transaction.hash}`)
            }
          }
          merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
        }
        retry(getTransaction, {
          n: 10,
          minWait: 5000,
          maxWait: 10000,
        })
      },
    )
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError, t])

  const nonDneroFarmPendingTxns = useMemo(
    () =>
      Object.keys(transactions).filter(
        (hash) =>
          transactions[hash].receipt?.status === 1 &&
          transactions[hash].type === 'non-dnero-farm' &&
          transactions[hash].nonDneroFarm?.status === FarmTransactionStatus.PENDING,
      ),
    [transactions],
  )

  useSWRImmutable(
    chainId && Boolean(nonDneroFarmPendingTxns?.length) && ['checkNonDneroFarmTransaction', FAST_INTERVAL, chainId],
    () => {
      nonDneroFarmPendingTxns.forEach((hash) => {
        const steps = transactions[hash]?.nonDneroFarm?.steps || []
        if (steps.length) {
          const pendingStep = steps.findIndex(
            (step: NonDneroFarmTransactionStep) => step.status === FarmTransactionStatus.PENDING,
          )
          const previousIndex = pendingStep - 1

          if (previousIndex >= 0) {
            const previousHash = steps[previousIndex]
            const checkHash = previousHash.tx || hash

            fetchCelerApi(checkHash)
              .then((response) => {
                const transaction = transactions[hash]
                const { destinationTxHash, messageStatus } = response
                const status =
                  messageStatus === MsgStatus.MS_COMPLETED
                    ? FarmTransactionStatus.SUCCESS
                    : messageStatus === MsgStatus.MS_FAIL
                    ? FarmTransactionStatus.FAIL
                    : FarmTransactionStatus.PENDING
                const isFinalStepComplete = status === FarmTransactionStatus.SUCCESS && steps.length === pendingStep + 1

                const newSteps = transaction?.nonDneroFarm?.steps?.map((step, index) => {
                  let newObj = {}
                  if (index === pendingStep) {
                    newObj = { ...step, status, tx: destinationTxHash }
                  }
                  return { ...step, ...newObj }
                })

                dispatch(
                  finalizeTransaction({
                    chainId,
                    hash: transaction.hash,
                    receipt: { ...transaction.receipt },
                    nonDneroFarm: {
                      ...transaction.nonDneroFarm,
                      steps: newSteps,
                      status: isFinalStepComplete ? FarmTransactionStatus.SUCCESS : transaction?.nonDneroFarm?.status,
                    },
                  }),
                )

                const isStakeType = transactions[hash]?.nonDneroFarm?.type === NonDneroFarmStepType.STAKE
                if (isFinalStepComplete) {
                  const toastTitle = isStakeType ? t('Staked!') : t('Unstaked!')
                  toastSuccess(
                    toastTitle,
                    <ToastDescriptionWithTx txHash={destinationTxHash} txChainId={steps[pendingStep].chainId}>
                      {isStakeType
                        ? t('Your LP Token have been staked in the Farm!')
                        : t('Your LP Token have been unstaked in the Farm!')}
                    </ToastDescriptionWithTx>,
                  )
                } else if (status === FarmTransactionStatus.FAIL) {
                  const toastTitle = isStakeType ? t('Stake Error') : t('Unstake Error')
                  const errorText = isStakeType ? t('Token fail to stake.') : t('Token fail to unstake.')
                  toastError(
                    toastTitle,
                    <ToastDescriptionWithTx txHash={destinationTxHash} txChainId={steps[pendingStep].chainId}>
                      <Box>
                        <Text
                          as="span"
                          bold
                        >{`${transaction?.nonDneroFarm?.amount} ${transaction?.nonDneroFarm?.lpSymbol}`}</Text>
                        <Text as="span" ml="4px">
                          {errorText}
                        </Text>
                      </Box>
                    </ToastDescriptionWithTx>,
                  )
                }
              })
              .catch((error) => {
                console.error(`Failed to check harvest transaction hash: ${hash}`, error)
              })
          }
        }
      })
    },
    {
      refreshInterval: FAST_INTERVAL,
      errorRetryInterval: FAST_INTERVAL,
      onError: (error) => {
        console.error('[ERROR] updater checking non DNERO farm transaction error: ', error)
      },
    },
  )

  return null
}

export default Updater
