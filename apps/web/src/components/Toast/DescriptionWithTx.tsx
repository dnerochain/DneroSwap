import { Link, Text, DneroScanIcon } from '@dneroswap/uikit'
import { ChainId } from '@dneroswap/chains'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { useTranslation } from '@dneroswap/localization'
import truncateHash from '@dneroswap/utils/truncateHash'
import { useActiveChainId } from 'hooks/useActiveChainId'

interface DescriptionWithTxProps {
  description?: string
  txHash?: string
  txChainId?: number
}

const DescriptionWithTx: React.FC<React.PropsWithChildren<DescriptionWithTxProps>> = ({
  txHash,
  txChainId,
  children,
}) => {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()

  return (
    <>
      {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      {txHash && (
        <Link external href={getBlockExploreLink(txHash, 'transaction', txChainId || chainId)}>
          {t('View on %site%', { site: getBlockExploreName(txChainId || chainId) })}: {truncateHash(txHash, 8, 0)}
          {(txChainId || chainId) === ChainId.DNERO && <DneroScanIcon color="primary" ml="4px" />}
        </Link>
      )}
    </>
  )
}

export default DescriptionWithTx
