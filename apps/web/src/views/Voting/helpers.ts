import { wdneroVaultV2ABI } from '@dneroswap/pools'
import { dneroTokens } from '@dneroswap/tokens'
import BigNumber from 'bignumber.js'
import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import fromPairs from 'lodash/fromPairs'
import groupBy from 'lodash/groupBy'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { getWDneroVaultAddress } from 'utils/addressHelpers'
import { createPublicClient, http } from 'viem'
import { dnero } from 'viem/chains'
import { convertSharesToWDnero } from 'views/Pools/helpers'
import { Address } from 'wagmi'
import { ADMINS, DNEROSWAP_SPACE, SNAPSHOT_VERSION } from './config'
import { getScores } from './getScores'
import * as strategies from './strategies'

export const isCoreProposal = (proposal: Proposal) => {
  return ADMINS.includes(proposal.author.toLowerCase())
}

export const filterProposalsByType = (proposals: Proposal[], proposalType: ProposalType) => {
  if (proposals) {
    switch (proposalType) {
      case ProposalType.COMMUNITY:
        return proposals.filter((proposal) => !isCoreProposal(proposal))
      case ProposalType.CORE:
        return proposals.filter((proposal) => isCoreProposal(proposal))
      case ProposalType.ALL:
      default:
        return proposals
    }
  } else {
    return []
  }
}

export const filterProposalsByState = (proposals: Proposal[], state: ProposalState) => {
  return proposals.filter((proposal) => proposal.state === state)
}

export interface Message {
  address: string
  msg: string
  sig: string
}

const STRATEGIES = [
  { name: 'cake', params: { symbol: 'WDNERO', address: dneroTokens.wdnero.address, decimals: 18, max: 300 } },
]
const NETWORK = '56'

/**
 * Generates metadata required by snapshot to validate payload
 */
export const generateMetaData = () => {
  return {
    plugins: {},
    network: 56,
    strategies: STRATEGIES,
  }
}

/**
 * Returns data that is required on all snapshot payloads
 */
export const generatePayloadData = () => {
  return {
    version: SNAPSHOT_VERSION,
    timestamp: (Date.now() / 1e3).toFixed(),
    space: DNEROSWAP_SPACE,
  }
}

/**
 * General function to send commands to the snapshot api
 */
export const sendSnapshotData = async (message: Message) => {
  const response = await fetch(SNAPSHOT_HUB_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error_description)
  }

  const data = await response.json()
  return data
}

export const VOTING_POWER_BLOCK = {
  v0: 16300686n,
  v1: 17137653n,
}

export const VEWDNERO_VOTING_POWER_BLOCK = 34371669n

/**
 *  Get voting power by single user for each category
 */
type GetVotingPowerType = {
  total: number
  voter: string
  poolsBalance?: number
  wdneroBalance?: number
  wdneroPoolBalance?: number
  wdneroDTokenLpBalance?: number
  wdneroVaultBalance?: number
  ifoPoolBalance?: number
  lockedWDneroBalance?: number
  lockedEndTime?: number
}

// Voting power for veWDnero holders
type GetVeVotingPowerType = {
  total: number
  voter: string
  veWDneroBalance: number
}

const nodeRealProvider = createPublicClient({
  transport: http(`https://dnero-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`),
  chain: dnero,
})

export const getVeVotingPower = async (account: Address, blockNumber?: bigint): Promise<GetVeVotingPowerType> => {
  const scores = await getScores(DNEROSWAP_SPACE, STRATEGIES, NETWORK, [account], Number(blockNumber))
  const result = scores[0][account]

  return {
    total: result,
    voter: account,
    veWDneroBalance: result,
  }
}

export const getVotingPower = async (
  account: Address,
  poolAddresses: Address[],
  blockNumber?: bigint,
): Promise<GetVotingPowerType> => {
  if (blockNumber && (blockNumber >= VOTING_POWER_BLOCK.v0 || blockNumber >= VOTING_POWER_BLOCK.v1)) {
    const wdneroVaultAddress = getWDneroVaultAddress()
    const version = blockNumber >= VOTING_POWER_BLOCK.v1 ? 'v1' : 'v0'

    const [
      pricePerShare,
      [
        shares,
        _lastDepositedTime,
        _wdneroAtLastUserAction,
        _lastUserActionTime,
        _lockStartTime,
        lockEndTime,
        userBoostedShare,
      ],
    ] = await nodeRealProvider.multicall({
      contracts: [
        {
          address: wdneroVaultAddress,
          abi: wdneroVaultV2ABI,
          functionName: 'getPricePerFullShare',
        },
        {
          address: wdneroVaultAddress,
          abi: wdneroVaultV2ABI,
          functionName: 'userInfo',
          args: [account],
        },
      ],
      blockNumber,
      allowFailure: false,
    })

    const [wdneroBalance, wdneroDTokenLpBalance, wdneroPoolBalance, wdneroVaultBalance, poolsBalance, total, ifoPoolBalance] =
      await getScores(
        DNEROSWAP_SPACE,
        [
          strategies.wdneroBalanceStrategy(version),
          strategies.wdneroDTokenLpBalanceStrategy(version),
          strategies.wdneroPoolBalanceStrategy(version),
          strategies.wdneroVaultBalanceStrategy(version),
          strategies.createPoolsBalanceStrategy(poolAddresses, version),
          strategies.createTotalStrategy(poolAddresses, version),
          strategies.ifoPoolBalanceStrategy,
        ],
        NETWORK,
        [account],
        Number(blockNumber),
      )

    const lockedWDneroBalance = convertSharesToWDnero(
      new BigNumber(shares.toString()),
      new BigNumber(pricePerShare.toString()),
      18,
      3,
      new BigNumber(userBoostedShare.toString()),
    )?.wdneroAsNumberBalance

    const versionOne =
      version === 'v0'
        ? {
            ifoPoolBalance: ifoPoolBalance[account] ? ifoPoolBalance[account] : 0,
          }
        : {}

    return {
      ...versionOne,
      voter: account,
      total: total[account] ? total[account] : 0,
      poolsBalance: poolsBalance[account] ? poolsBalance[account] : 0,
      wdneroBalance: wdneroBalance[account] ? wdneroBalance[account] : 0,
      wdneroPoolBalance: wdneroPoolBalance[account] ? wdneroPoolBalance[account] : 0,
      wdneroDTokenLpBalance: wdneroDTokenLpBalance[account] ? wdneroDTokenLpBalance[account] : 0,
      wdneroVaultBalance: wdneroVaultBalance[account] ? wdneroVaultBalance[account] : 0,
      lockedWDneroBalance: Number.isFinite(lockedWDneroBalance) ? lockedWDneroBalance : 0,
      lockedEndTime: lockEndTime ? +lockEndTime.toString() : 0,
    }
  }

  const [total] = await getScores(DNEROSWAP_SPACE, STRATEGIES, NETWORK, [account], Number(blockNumber))

  return {
    total: total[account] ? total[account] : 0,
    voter: account,
  }
}

export const calculateVoteResults = (votes: Vote[]): { [key: string]: Vote[] } => {
  if (votes) {
    const result = groupBy(votes, (vote) => vote.proposal.choices[vote.choice - 1])
    return result
  }
  return {}
}

export const getTotalFromVotes = (votes: Vote[]) => {
  if (votes) {
    return votes.reduce((accum, vote) => {
      let power = parseFloat(vote.metadata?.votingPower)

      if (!power) {
        power = 0
      }

      return accum + power
    }, 0)
  }
  return 0
}

/**
 * Get voting power by a list of voters, only total
 */
export async function getVotingPowerByWDneroStrategy(voters: string[], blockNumber: number) {
  const strategyResponse = await getScores(DNEROSWAP_SPACE, STRATEGIES, NETWORK, voters, blockNumber)

  const result = fromPairs(
    voters.map((voter) => {
      const defaultTotal = strategyResponse.reduce(
        (total, scoreList) => total + (scoreList[voter] ? scoreList[voter] : 0),
        0,
      )

      return [voter, defaultTotal]
    }),
  )

  return result
}
