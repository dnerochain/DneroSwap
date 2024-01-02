import { useMemo } from 'react'
import { footerLinks } from '@dneroswap/uikit'
import Footer from '@dneroswap/uikit/components/Footer'
import { languageList, useTranslation } from '@dneroswap/localization'
import { useTheme } from 'next-themes'
import { ChainId } from '@dneroswap/chains'
import { useWDneroPrice } from 'hooks/useWDneroPrice'

const FooterPage = () => {
  const { setTheme, resolvedTheme } = useTheme()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { data: wdneroPrice } = useWDneroPrice()

  const isDark = resolvedTheme === 'dark'

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])

  return (
    <Footer
      chainId={ChainId.DNERO}
      items={getFooterLinks}
      isDark={isDark}
      toggleTheme={toggleTheme}
      langs={languageList}
      setLang={setLanguage}
      currentLang={currentLanguage.code}
      wdneroPriceUsd={wdneroPrice ? Number(wdneroPrice) : undefined}
      buyWDneroLabel={t('Buy WDNERO')}
      buyWDneroLink="https://pancakeswap.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56"
    />
  )
}

export default FooterPage
