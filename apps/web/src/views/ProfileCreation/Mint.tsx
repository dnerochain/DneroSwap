import { useTranslation } from '@dneroswap/localization'
import { Card, CardBody, Heading, Text, useToast } from '@dneroswap/uikit'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { FetchStatus } from 'config/constants/types'
import { formatUnits } from 'viem'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useBunnyFactory } from 'hooks/useContract'
import { useDNEROWDneroBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiSingleTokenData } from 'state/nftMarket/types'
import { getBunnyFactoryAddress } from 'utils/addressHelpers'
import { dneroTokens } from '@dneroswap/tokens'
import { dneroswapBunniesAddress } from 'views/Nft/market/constants'
import { MINT_COST, STARTER_NFT_BUNNY_IDS } from './config'
import useProfileCreation from './contexts/hook'
import NextStepButton from './NextStepButton'
import SelectionCard from './SelectionCard'

interface MintNftData extends ApiSingleTokenData {
  bunnyId?: string
}

const Mint: React.FC<React.PropsWithChildren> = () => {
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('')
  const [starterNfts, setStarterNfts] = useState<MintNftData[]>([])
  const { actions, allowance } = useProfileCreation()
  const { toastSuccess } = useToast()

  const bunnyFactoryContract = useBunnyFactory()
  const { t } = useTranslation()
  const { balance: wdneroBalance, fetchStatus } = useDNEROWDneroBalance()
  const hasMinimumWDneroRequired = fetchStatus === FetchStatus.Fetched && wdneroBalance >= MINT_COST
  const { callWithGasPrice } = useCallWithGasPrice()

  useEffect(() => {
    const getStarterNfts = async () => {
      const response = await getNftsFromCollectionApi(dneroswapBunniesAddress)
      if (!response) return
      const { data: allPbTokens } = response
      const nfts = STARTER_NFT_BUNNY_IDS.map((bunnyId) => {
        if (allPbTokens && allPbTokens[bunnyId]) {
          return { ...allPbTokens[bunnyId], bunnyId }
        }
        return undefined
      })
      setStarterNfts(nfts)
    }
    if (starterNfts.length === 0) {
      getStarterNfts()
    }
  }, [starterNfts])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      token: dneroTokens.wdnero,
      spender: getBunnyFactoryAddress(),
      minAmount: MINT_COST,
      targetAmount: allowance,
      onConfirm: () => {
        return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [BigInt(selectedBunnyId)])
      },
      onApproveSuccess: () => {
        toastSuccess(t('Enabled'), t("Press 'confirm' to mint this NFT"))
      },
      onSuccess: () => {
        toastSuccess(t('Success'), t('You have minted your starter NFT'))
        actions.nextStep()
      },
    })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Get Starter Collectible')}
      </Heading>
      <Text as="p">{t('Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{t('This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {t('You can change your profile pic later if you get another approved Dneroswap Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {t('Cost: %num% WDNERO', { num: formatUnits(MINT_COST, 18) })}
          </Text>
          {starterNfts.map((nft) => {
            const handleChange = (value: string) => setSelectedBunnyId(value)

            return (
              <SelectionCard
                key={nft?.name}
                name="mintStarter"
                value={nft?.bunnyId}
                image={nft?.image.thumbnail}
                isChecked={selectedBunnyId === nft?.bunnyId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumWDneroRequired}
              >
                <Text bold>{nft?.name}</Text>
              </SelectionCard>
            )
          })}
          {!hasMinimumWDneroRequired && (
            <Text color="failure" mb="16px">
              {t('A minimum of %num% WDNERO is required', { num: formatUnits(MINT_COST, 18) })}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={selectedBunnyId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumWDneroRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
