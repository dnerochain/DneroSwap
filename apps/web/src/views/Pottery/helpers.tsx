import BigNumber from 'bignumber.js'
import { PotteryDepositStatus } from 'state/types'

interface CalculateWDneroAmount {
  status: PotteryDepositStatus
  previewRedeem: string
  shares: string
  totalSupply: BigNumber
  totalLockWDnero: BigNumber
}

export const calculateWDneroAmount = ({
  status,
  previewRedeem,
  shares,
  totalSupply,
  totalLockWDnero,
}: CalculateWDneroAmount): BigNumber => {
  if (status === PotteryDepositStatus.LOCK) {
    return new BigNumber(shares).div(totalSupply).times(totalLockWDnero)
  }

  return new BigNumber(previewRedeem)
}
