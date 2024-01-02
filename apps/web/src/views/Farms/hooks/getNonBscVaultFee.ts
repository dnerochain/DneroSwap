import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@dneroswap/utils/bigNumber'
import { getNonDneroVaultContract, getCrossFarmingSenderContract } from 'utils/contractHelpers'
import { Address } from 'wagmi'

export enum MessageTypes {
  Deposit = 0,
  Withdraw = 1,
  EmergencyWithdraw = 2,
  Claim = 3,
}

enum Chains {
  EVM = 0,
  DNERO = 1,
}

interface CalculateTotalFeeProps {
  pid: number
  amount: string
  chainId: number
  userAddress: string
  messageType: MessageTypes
  gasPrice: number
  oraclePrice: string
}

const COMPENSATION_PRECISION = 1e5
const ORACLE_PRECISION = 1e18
const DTOKEN_CHANGE = 5000000000000000
const BUFFER = 1.3
const WITHDRAW_BUFFER = 1.4

export const getNonDneroVaultContractFee = async ({
  pid,
  amount,
  chainId,
  userAddress,
  messageType,
  oraclePrice,
  gasPrice,
}: CalculateTotalFeeProps) => {
  try {
    const nonDneroVaultContract = getNonDneroVaultContract(null, chainId)
    const crossFarmingAddress = getCrossFarmingSenderContract(null, chainId)
    const exchangeRate = new BigNumber(ORACLE_PRECISION).div(oraclePrice).times(ORACLE_PRECISION) // invert into DTOKEN/ETH price

    const getNonce = await crossFarmingAddress.read.nonces([userAddress as Address, BigInt(pid)])
    const nonce = new BigNumber(getNonce.toString()).toJSON()
    const [encodeMessage, hasFirstTime, estimateGaslimit] = await Promise.all([
      nonDneroVaultContract.read.encodeMessage([
        userAddress as Address,
        BigInt(pid),
        BigInt(amount),
        messageType,
        BigInt(nonce),
      ]),
      crossFarmingAddress.read.is1st([userAddress as Address]),
      crossFarmingAddress.read.estimateGaslimit([Chains.DNERO, userAddress as Address, messageType]),
    ])
    const calcFee = await nonDneroVaultContract.read.calcFee([encodeMessage])

    const msgBusFee = new BigNumber(calcFee.toString())
    const destTxFee = new BigNumber(gasPrice)
      .times(estimateGaslimit.toString())
      .times(exchangeRate)
      .times(COMPENSATION_PRECISION)
      .div(new BigNumber(ORACLE_PRECISION).times(COMPENSATION_PRECISION))
    const totalFee = new BigNumber(msgBusFee).plus(destTxFee)

    if (!hasFirstTime) {
      const depositFee = new BigNumber(DTOKEN_CHANGE).times(exchangeRate).div(ORACLE_PRECISION)
      return totalFee.plus(depositFee).times(BUFFER).toFixed(0)
    }

    if (messageType >= MessageTypes.Withdraw) {
      const estimateEvmGaslimit = await crossFarmingAddress.read.estimateGaslimit([
        Chains.EVM,
        userAddress as Address,
        messageType,
      ])
      const fee = msgBusFee.times(exchangeRate).div(ORACLE_PRECISION)
      const total = new BigNumber(gasPrice).times(estimateEvmGaslimit.toString()).plus(fee)
      return totalFee.plus(total).times(WITHDRAW_BUFFER).toFixed(0)
    }

    return totalFee.times(BUFFER).toFixed(0)
  } catch (error) {
    console.error('Failed to fetch non DneroVault fee', error)
    return BIG_ZERO.toJSON()
  }
}
