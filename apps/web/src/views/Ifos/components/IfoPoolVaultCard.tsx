import { useMemo } from 'react'
import { Flex } from '@dneroswap/uikit'
import { isWDneroVaultSupported } from '@dneroswap/pools'
import { Address } from 'viem'
import { ChainId } from '@dneroswap/chains'

import { useActiveChainId } from 'hooks/useActiveChainId'

import IfoVesting from './IfoVesting/index'
import { VeWDneroCard } from './VeWDneroCard'

type Props = {
  ifoBasicSaleType?: number
  ifoAddress?: Address
  ifoChainId?: ChainId
}

const IfoPoolVaultCard = ({ ifoBasicSaleType, ifoAddress }: Props) => {
  const { chainId } = useActiveChainId()
  const wdneroVaultSupported = useMemo(() => isWDneroVaultSupported(chainId), [chainId])

  const vault = <VeWDneroCard ifoAddress={ifoAddress} />

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {wdneroVaultSupported ? vault : null}
      <IfoVesting ifoBasicSaleType={ifoBasicSaleType} />
    </Flex>
  )
}

export default IfoPoolVaultCard
