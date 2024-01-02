import { useTranslation } from '@dneroswap/localization'
import { ChainId } from '@dneroswap/chains'
import { useToast } from '@dneroswap/uikit'
import { dneroswapProfileABI } from 'config/abi/dneroswapProfile'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useEffect, useState } from 'react'
import { getDneroswapProfileAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'

const useGetProfileCosts = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [costs, setCosts] = useState({
    numberWDneroToReactivate: 0n,
    numberWDneroToRegister: 0n,
    numberWDneroToUpdate: 0n,
  })
  const { toastError } = useToast()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    const fetchCosts = async () => {
      try {
        const dneroswapProfileAddress = getDneroswapProfileAddress()

        const [numberWDneroToReactivate, numberWDneroToRegister, numberWDneroToUpdate] = await publicClient({
          chainId: ChainId.DNERO,
        }).multicall({
          allowFailure: false,
          contracts: [
            {
              address: dneroswapProfileAddress,
              abi: dneroswapProfileABI,
              functionName: 'numberWDneroToReactivate',
            },
            {
              address: dneroswapProfileAddress,
              abi: dneroswapProfileABI,
              functionName: 'numberWDneroToRegister',
            },
            {
              address: dneroswapProfileAddress,
              abi: dneroswapProfileABI,
              functionName: 'numberWDneroToUpdate',
            },
          ],
        })

        setCosts({
          numberWDneroToReactivate,
          numberWDneroToRegister,
          numberWDneroToUpdate,
        })
        setIsLoading(false)
      } catch (error) {
        toastError(t('Error'), t('Could not retrieve WDNERO costs for profile'))
      }
    }

    fetchCosts()
  }, [setCosts, toastError, t, chainId])

  return { costs, isLoading }
}

export default useGetProfileCosts
