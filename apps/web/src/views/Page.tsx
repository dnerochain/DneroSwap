import { useTranslation } from '@dneroswap/localization'
import { Swap } from '@dneroswap/widgets-internal'
import { ChainId } from '@dneroswap/chains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { EXCHANGE_HELP_URLS } from 'config/constants'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
  }>
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  helpUrl = EXCHANGE_HELP_URLS,
  ...props
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const isDNERO = chainId === ChainId.DNERO
  const externalText = isDNERO ? t('Bridge assets to DneroChain') : ''
  const externalLinkUrl = isDNERO ? 'https://bridge.pancakeswap.finance/' : ''

  return (
    <Swap.Page
      removePadding={removePadding}
      noMinHeight={noMinHeight}
      hideFooterOnDesktop={hideFooterOnDesktop}
      helpUrl={helpUrl}
      externalText={externalText}
      externalLinkUrl={externalLinkUrl}
      {...props}
    >
      {children}
    </Swap.Page>
  )
}

export default Page
