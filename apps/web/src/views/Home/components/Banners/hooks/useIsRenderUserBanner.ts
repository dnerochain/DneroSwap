import { ChainId } from '@dneroswap/chains'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useFarmsWithBalance from 'views/Home/hooks/useFarmsWithBalance'
import {} from 'state/farms/hooks'
import BigNumber from 'bignumber.js'
import { useWDneroPrice } from 'hooks/useWDneroPrice'
import { useMemo } from 'react'

const useIsRenderUserBanner = () => {
  const { chainId, account } = useActiveWeb3React()

  const { earningsSum: farmEarningsSum } = useFarmsWithBalance()
  const wdneroPriceBusd = useWDneroPrice()
  const isEarningsBusdZero = new BigNumber(farmEarningsSum).multipliedBy(wdneroPriceBusd).isZero()

  return useMemo(() => {
    return { shouldRender: Boolean(account) && chainId === ChainId.DNERO, isEarningsBusdZero }
  }, [account, chainId, isEarningsBusdZero])
}

export default useIsRenderUserBanner
