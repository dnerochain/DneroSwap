import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { NftToken } from 'state/nftMarket/types'
import { getDneroswapProfileAddress } from 'utils/addressHelpers'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import useSWR from 'swr'
import { safeGetAddress } from 'utils'

const useNftOwner = (nft: NftToken, isOwnNft = false) => {
  const { address: account } = useAccount()
  const [owner, setOwner] = useState(null)
  const [isLoadingOwner, setIsLoadingOwner] = useState(true)
  const collectionContract = useErc721CollectionContract(nft.collectionAddress)
  const currentSeller = nft.marketData?.currentSeller
  const dneroswapProfileAddress = getDneroswapProfileAddress()
  const { collectionAddress, tokenId } = nft
  const { data: tokenOwner } = useSWR(
    collectionContract ? ['nft', 'ownerOf', collectionAddress, tokenId] : null,
    async () => collectionContract.read.ownerOf([BigInt(tokenId)]),
  )

  useEffect(() => {
    const getOwner = async () => {
      try {
        if (isOwnNft && account) {
          setOwner(account)
        } else if (tokenOwner && safeGetAddress(tokenOwner) !== safeGetAddress(dneroswapProfileAddress)) {
          setOwner(tokenOwner)
        } else {
          setOwner(null)
        }
      } catch (error) {
        setOwner(null)
      } finally {
        setIsLoadingOwner(false)
      }
    }

    if (currentSeller && currentSeller !== NOT_ON_SALE_SELLER) {
      setOwner(currentSeller)
      setIsLoadingOwner(false)
    } else {
      getOwner()
    }
  }, [account, isOwnNft, currentSeller, collectionContract, tokenId, tokenOwner, dneroswapProfileAddress])

  return { owner, isLoadingOwner }
}

export default useNftOwner
