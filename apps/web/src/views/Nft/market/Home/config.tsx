import { LinkExternal } from '@dneroswap/uikit'
import { ContextApi } from '@dneroswap/localization'

const config = (t: ContextApi['t']) => {
  return [
    {
      title: t('I sold an NFT, where’s my DTOKEN?'),
      description: [
        t(
          'Trades are settled in WDTOKEN, which is a wrapped version of DTOKEN used on DNEROCHAIN. That means that when you sell an item, WDTOKEN is sent to your wallet instead of DTOKEN.',
        ),
        t('You can instantly swap your WDTOKEN for DTOKEN with no trading fees on DneroSwap.'),
      ],
    },
    {
      title: t('How can I list my NFT collection on the Market?'),
      description: [
        t('In Phase 2 of the NFT Marketplace, collections must be whitelisted before they may be listed.'),
        t('We are now accepting applications from NFT collection owners seeking to list their collections.'),
        <LinkExternal href="https://docs.pancakeswap.finance/contact-us/nft-market-applications">
          {t('Please apply here')}
        </LinkExternal>,
      ],
    },
    {
      title: t('What are the fees?'),
      description: [
        t(
          '100% of all platform fees taken by DneroSwap from sales are used to buy back and BURN WDNERO tokens in our weekly WDNERO burns.',
        ),
        t(
          'Platform fees: 2% is subtracted from NFT sales on the market. Subject to change.Collection fees: Additional fees may be taken by collection creators, once those collections are live. These will not contribute to the WDNERO burns.',
        ),
      ],
    },
  ]
}

export default config
