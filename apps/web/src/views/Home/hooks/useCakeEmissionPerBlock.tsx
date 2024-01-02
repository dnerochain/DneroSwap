import { ChainId } from '@dneroswap/chains'
import BigNumber from 'bignumber.js'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { getMasterChefV2Address } from 'utils/addressHelpers'
import { formatEther } from 'viem'
import { useContractRead } from 'wagmi'

const WDNERO_PER_BLOCK = 40
const masterChefAddress = getMasterChefV2Address()

export const useWDneroEmissionPerBlock = (inView?: boolean) => {
  const { data: emissionsPerBlock } = useContractRead({
    abi: masterChefV2ABI,
    address: masterChefAddress,
    chainId: ChainId.DNERO,
    functionName: 'wdneroPerBlockToBurn',
    enabled: inView,
    select: (d) => {
      const burn = formatEther(d)
      return new BigNumber(WDNERO_PER_BLOCK).minus(burn).toNumber()
    },
  })

  return emissionsPerBlock
}
