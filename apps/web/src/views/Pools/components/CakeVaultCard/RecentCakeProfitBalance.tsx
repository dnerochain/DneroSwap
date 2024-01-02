import { Token } from '@dneroswap/sdk'
import { TooltipText, useTooltip, Balance } from '@dneroswap/uikit'
import { Pool } from '@dneroswap/widgets-internal'

import AutoEarningsBreakdown from '../AutoEarningsBreakdown'

interface RecentWDneroProfitBalanceProps {
  wdneroToDisplay: number
  pool: Pool.DeserializedPool<Token>
  account: string
}

const RecentWDneroProfitBalance: React.FC<React.PropsWithChildren<RecentWDneroProfitBalanceProps>> = ({
  wdneroToDisplay,
  pool,
  account,
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<AutoEarningsBreakdown pool={pool} account={account} />, {
    placement: 'bottom-end',
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={wdneroToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentWDneroProfitBalance
