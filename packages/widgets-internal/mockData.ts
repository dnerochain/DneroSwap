import { ERC20Token } from "@dneroswap/sdk";
import { ChainId } from "@dneroswap/chains";

// For StoryBook
export const wdneroToken = new ERC20Token(
  ChainId.DNERO,
  "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
  18,
  "WDNERO",
  "DneroSwap Token",
  "https://pancakeswap.finance/"
);

export const dneroToken = new ERC20Token(
  ChainId.DNERO,
  "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
  18,
  "DTOKEN",
  "DTOKEN",
  "https://www.binance.com/"
);
