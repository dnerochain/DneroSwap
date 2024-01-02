import { useTranslation } from '@dneroswap/localization'
import { ChainId } from '@dneroswap/chains'
import { useNetwork } from 'wagmi'
import { Message, MessageText, Box } from '@dneroswap/uikit'

const ZkSyncWarning = () => {
  const { t } = useTranslation()
  const { chain } = useNetwork()

  return (
    <>
      {chain?.id === ChainId.ZKSYNC || chain?.id === ChainId.ZKSYNC_TESTNET ? (
        <Box maxWidth={['100%', '100%', '100%', '307px']}>
          <Message variant="warning" m="24px 0 0 0">
            <MessageText>
              {t(
                'When staking on zkSync Era, unstaking your WDNERO shortly after staking could result in no rewards being earned.',
              )}
            </MessageText>
          </Message>
        </Box>
      ) : null}
    </>
  )
}

export default ZkSyncWarning
