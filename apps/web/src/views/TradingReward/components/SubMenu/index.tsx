import React, { useMemo } from 'react'
import { useRouter } from 'next/router'
import { SubMenuItems } from '@dneroswap/uikit'
import { useTranslation } from '@dneroswap/localization'

const SubMenu: React.FC<React.PropsWithChildren> = () => {
  const { pathname } = useRouter()
  const { t } = useTranslation()

  const subMenuItems = useMemo(() => {
    return [
      { label: t('WDNERO Stakers'), href: '/trading-reward' },
      { label: t('Top Traders'), href: '/trading-reward/top-traders' },
    ]
  }, [t])

  const activeSubItem = useMemo(() => {
    return subMenuItems.find((subMenuItem) => subMenuItem.href === pathname)?.href
  }, [subMenuItems, pathname])

  return <SubMenuItems items={subMenuItems} activeItem={activeSubItem} />
}

export default SubMenu
