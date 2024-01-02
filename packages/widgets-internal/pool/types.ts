import BigNumber from "bignumber.js";
import type {
  PoolCategory,
  PoolConfigBaseProps,
  SerializedPoolConfig,
  DeserializedPoolConfig,
  DeserializedPool,
  DeserializedPoolVault,
  DeserializedPoolLockedVault,
  DeserializedLockedVaultUser,
  DeserializedLockedWDneroVault,
  SerializedVaultFees,
  DeserializedVaultFees,
  DeserializedVaultUser,
  DeserializedWDneroVault,
} from "@dneroswap/pools";
import { VaultKey } from "@dneroswap/pools";

export {
  PoolCategory,
  PoolConfigBaseProps,
  SerializedPoolConfig,
  DeserializedPoolConfig,
  DeserializedPoolVault,
  DeserializedPoolLockedVault,
  DeserializedPool,
  DeserializedLockedVaultUser,
  DeserializedLockedWDneroVault,
  SerializedVaultFees,
  DeserializedVaultFees,
  DeserializedVaultUser,
  DeserializedWDneroVault,
  VaultKey,
};

export interface HarvestActionsProps {
  earnings: BigNumber;
  isLoading?: boolean;
  onPresentCollect: any;
  earningTokenPrice: number;
  earningTokenBalance: number;
  earningTokenDollarBalance: number;
}
