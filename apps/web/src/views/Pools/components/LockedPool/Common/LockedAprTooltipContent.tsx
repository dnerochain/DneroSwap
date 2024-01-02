import { useTranslation } from '@dneroswap/localization'

export default function LockedAprTooltipContent() {
  const { t } = useTranslation()
  return <>{t('To continue receiving WDNERO rewards, please migrate your Fixed-Term Staking WDNERO Balance to veWDNERO')}</>
}
