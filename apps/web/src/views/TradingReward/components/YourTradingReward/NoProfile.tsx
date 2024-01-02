import { Box, Text, Button, Link, Message, MessageText } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'
import Image from 'next/image'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { ChainId } from '@dneroswap/chains'
import { CHAIN_QUERY_NAME } from 'config/chains'

const NoProfile = () => {
  const { t } = useTranslation()
  const { account, chainId } = useAccountActiveChain()

  return (
    <>
      <Text bold mb="8px">
        {t('You have no active Dneroswap Profile.')}
      </Text>
      <Text mb="32px">{t('Create a Dneroswap Profile to start earning from trades')}</Text>
      <Box>
        <Image src="/images/trading-reward/create-profile.png" width={420} height={128} alt="create-profile" />
      </Box>
      {chainId !== ChainId.DNERO && (
        <Box maxWidth={365} mt="24px">
          <Message variant="primary">
            <MessageText>
              {t('To create Dneroswap Profile, you will need to switch your network to DneroChain.')}
            </MessageText>
          </Message>
        </Box>
      )}
      <Link mt="32px" external href={`/profile/${account}?chain=${CHAIN_QUERY_NAME[ChainId.DNERO]}`}>
        <Button>{t('Activate Profile')}</Button>
      </Link>
    </>
  )
}

export default NoProfile
