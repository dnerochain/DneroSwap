import { GetStaticProps, InferGetStaticPropsType } from 'next'
// eslint-disable-next-line camelcase
import { unstable_serialize, SWRConfig } from 'swr'
import { getCollections } from 'state/nftMarket/helpers'
import DneroswapCollectiblesPageRouter from 'views/Profile/components/DneroswapCollectiblesPageRouter'
import { dneroswapProfileABI } from 'config/abi/dneroswapProfile'
import { getProfileContract } from 'utils/contractHelpers'
import { viemServerClients } from 'utils/viem.server'
import { ChainId } from '@dneroswap/chains'
import { ContractFunctionResult } from 'viem'
import { getDneroswapProfileAddress } from 'utils/addressHelpers'

const DneroswapCollectiblesPage = ({ fallback = {} }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <SWRConfig
      value={{
        fallback,
      }}
    >
      <DneroswapCollectiblesPageRouter />
    </SWRConfig>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const fetchedCollections = await getCollections()
  if (!fetchedCollections || !Object.keys(fetchedCollections).length) {
    return {
      props: {
        fallback: {},
      },
      revalidate: 60,
    }
  }

  try {
    const profileContract = getProfileContract()
    const nftRole = await profileContract.read.NFT_ROLE()

    const collectionRoles = (await viemServerClients[ChainId.DNERO].multicall({
      contracts: Object.keys(fetchedCollections).map((collectionAddress) => {
        return {
          abi: dneroswapProfileABI,
          address: getDneroswapProfileAddress(),
          functionName: 'hasRole',
          args: [nftRole, collectionAddress],
        }
      }),
      allowFailure: false,
    })) as ContractFunctionResult<typeof dneroswapProfileABI, 'hasRole'>[]

    const dneroswapCollectibles = Object.values(fetchedCollections).filter((collection, index) => {
      return collectionRoles[index]
    })

    return {
      props: {
        fallback: {
          [unstable_serialize(['dneroswapCollectibles'])]: dneroswapCollectibles,
        },
      },
      revalidate: 60 * 60 * 12, // 12 hours
    }
  } catch (error) {
    return {
      props: {
        fallback: {},
      },
      revalidate: 60,
    }
  }
}

export default DneroswapCollectiblesPage
