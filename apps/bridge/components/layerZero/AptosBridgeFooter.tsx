import PoweredBy from 'components/layerZero/PoweredBy'
import { LinkExternal } from '@dneroswap/uikit'

const AptosBridgeFooter = ({ isWDnero }: { isWDnero?: boolean }) => {
  return (
    <>
      <PoweredBy />
      {isWDnero ? (
        <>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/products/wdnero-bridging/evms">
            How to bridge?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/products/wdnero-bridging/faq">
            Need Help?
          </LinkExternal>
        </>
      ) : (
        <>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/products/wdnero-bridging/aptos">
            How to bridge?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/products/wdnero-bridging/faq">
            Need Help?
          </LinkExternal>
          <LinkExternal m="20px auto" href="https://docs.pancakeswap.finance/get-started-aptos/aptos-coin-guide">
            Don’t see your assets?
          </LinkExternal>
        </>
      )}
    </>
  )
}

export default AptosBridgeFooter
