import { useTranslation } from '@dneroswap/localization'
import { Link } from '@dneroswap/uikit'
import useTheme from 'hooks/useTheme'
import { memo } from 'react'

export const LearnMoreLink: React.FC<{ withArrow?: boolean }> = ({ withArrow }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <Link
      style={{
        display: 'inline',
        color: withArrow ? theme.colors.yellow : 'white',
        textDecoration: 'underline',
        fontSize: 14,
        marginLeft: 3,
      }}
      href="https://docs.pancakeswap.finance/products/vewdnero/migrate-from-wdnero-pool"
      target="_blank"
      rel="noreferrer noopener"
    >
      {t('Learn more')}
      {withArrow && '»'}
    </Link>
  )
}

export const WDneroStakingPageLink: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <Link
      style={{
        display: 'inline',
        textDecoration: 'underline',
        fontSize: 14,
        marginLeft: 3,
        color: 'white',
      }}
      href="/wdnero-staking"
    >
      {t('WDNERO staking page')}
    </Link>
  )
})
