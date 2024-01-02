import { useTranslation } from '@dneroswap/localization'
import { Button } from '@dneroswap/uikit'
import { useRouter } from 'next/router'
import { memo } from 'react'

const BUTTON_TEXT = {
  get: 'Get veWDNERO now!',
  migrate: 'Migrate to veWDNERO',
  check: 'Check out veWDNERO',
}

export const VeWDneroButton: React.FC<{ type: 'get' | 'migrate' | 'check'; style?: React.CSSProperties }> = memo(
  ({ type, style }) => {
    const { push } = useRouter()
    const { t } = useTranslation()
    return (
      <Button
        width="100%"
        style={style}
        onClick={() => {
          push('/wdnero-staking')
        }}
      >
        {t(BUTTON_TEXT[type])}
      </Button>
    )
  },
)
