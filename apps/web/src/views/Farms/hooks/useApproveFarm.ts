import { useCallback } from 'react'
import { MaxUint256 } from '@dneroswap/swap-sdk-core'
import { getMasterChefV2Address, getNonDneroVaultAddress } from 'utils/addressHelpers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { verifyDneroNetwork } from 'utils/verifyDneroNetwork'
import { useERC20 } from 'hooks/useContract'
import { Address } from 'wagmi'

const useApproveFarm = (lpContract: ReturnType<typeof useERC20>, chainId: number) => {
  const isDneroNetwork = verifyDneroNetwork(chainId)
  const contractAddress = isDneroNetwork ? getMasterChefV2Address(chainId) : getNonDneroVaultAddress(chainId)

  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [contractAddress, MaxUint256])
  }, [lpContract, contractAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm

export const useApproveBoostProxyFarm = (lpContract: ReturnType<typeof useERC20>, proxyAddress?: Address) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return proxyAddress && callWithGasPrice(lpContract, 'approve', [proxyAddress, MaxUint256])
  }, [lpContract, proxyAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}
