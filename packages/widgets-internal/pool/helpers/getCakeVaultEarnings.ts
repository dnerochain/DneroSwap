import BigNumber from "bignumber.js";
import { BIG_ZERO } from "@dneroswap/utils/bigNumber";
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from "@dneroswap/utils/formatBalance";

// min deposit and withdraw amount
export const MIN_LOCK_AMOUNT = new BigNumber(10000000000000);

export const ENABLE_EXTEND_LOCK_AMOUNT = new BigNumber(100000000000000);

export const convertSharesToWDnero = (
  shares: BigNumber,
  wdneroPerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
  fee?: BigNumber
) => {
  const sharePriceNumber = getBalanceNumber(wdneroPerFullShare, decimals);
  const amountInWDnero = new BigNumber(shares.multipliedBy(sharePriceNumber)).minus(fee || BIG_ZERO);
  const wdneroAsNumberBalance = getBalanceNumber(amountInWDnero, decimals);
  const wdneroAsBigNumber = getDecimalAmount(new BigNumber(wdneroAsNumberBalance), decimals);
  const wdneroAsDisplayBalance = getFullDisplayBalance(amountInWDnero, decimals, decimalsToRound);
  return { wdneroAsNumberBalance, wdneroAsBigNumber, wdneroAsDisplayBalance };
};

export const getWDneroVaultEarnings = (
  account: string,
  wdneroAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
  fee?: BigNumber
) => {
  const hasAutoEarnings = account && wdneroAtLastUserAction?.gt(0) && userShares?.gt(0);
  const { wdneroAsBigNumber } = convertSharesToWDnero(userShares, pricePerFullShare);
  const autoWDneroProfit = wdneroAsBigNumber.minus(fee || BIG_ZERO).minus(wdneroAtLastUserAction);
  const autoWDneroToDisplay = autoWDneroProfit.gte(0) ? getBalanceNumber(autoWDneroProfit, 18) : 0;

  const autoUsdProfit = autoWDneroProfit.times(earningTokenPrice);
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0;
  return { hasAutoEarnings, autoWDneroToDisplay, autoUsdToDisplay };
};

export default getWDneroVaultEarnings;
