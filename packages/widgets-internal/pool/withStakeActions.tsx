import BigNumber from "bignumber.js";
import { ReactElement } from "react";
import { useTranslation } from "@dneroswap/localization";
import { getBalanceNumber } from "@dneroswap/utils/formatBalance";
import {
  Button,
  IconButton,
  NotEnoughTokensModal,
  Text,
  Flex,
  Balance,
  Skeleton,
  useModal,
  useTooltip,
  MinusIcon,
  AddIcon,
} from "@dneroswap/uikit";

import { DeserializedPool } from "./types";

interface StakeActionsPropsType<T> {
  pool: DeserializedPool<T>;
  stakingTokenBalance: BigNumber;
  stakedBalance: BigNumber;
  isDTokenPool: boolean;
  isStaked: ConstrainBoolean;
  isLoading?: boolean;
  hideLocateAddress?: boolean;
}

export interface StakeModalPropsType<T> {
  isDTokenPool: boolean;
  pool: DeserializedPool<T>;
  stakingTokenBalance: BigNumber;
  stakingTokenPrice: number;
  isRemovingStake?: boolean;
  onDismiss?: () => void;
}

export function withStakeActions<T>(StakeModal: (props: StakeModalPropsType<T>) => ReactElement) {
  return ({
    pool,
    stakingTokenBalance,
    stakedBalance,
    isDTokenPool,
    isStaked,
    isLoading = false,
    hideLocateAddress = false,
  }: StakeActionsPropsType<T>) => {
    const { stakingToken, stakingTokenPrice, stakingLimit, isFinished, userData } = pool;
    const { t } = useTranslation();
    const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken?.decimals);
    const stakedTokenDollarBalance = stakingTokenPrice
      ? getBalanceNumber(stakedBalance?.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
      : 0;

    const [onPresentTokenRequired] = useModal(
      <NotEnoughTokensModal
        hideLocateAddress={hideLocateAddress}
        tokenAddress={stakingToken.address}
        tokenSymbol={stakingToken?.symbol || ""}
      />
    );

    const [onPresentStake] = useModal(
      <StakeModal
        isDTokenPool={isDTokenPool}
        pool={pool}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenPrice={stakingTokenPrice || 0}
      />
    );

    const [onPresentUnstake] = useModal(
      <StakeModal
        stakingTokenBalance={stakingTokenBalance}
        isDTokenPool={isDTokenPool}
        pool={pool}
        stakingTokenPrice={stakingTokenPrice || 0}
        isRemovingStake
      />
    );

    const { targetRef, tooltip, tooltipVisible } = useTooltip(
      t("You’ve already staked the maximum amount you can stake in this pool!"),
      { placement: "bottom" }
    );

    const reachStakingLimit = stakingLimit?.gt(0) && userData?.stakedBalance?.gte(stakingLimit);

    const renderStakeAction = () => {
      return isStaked ? (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <>
              <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
              {stakingTokenPrice !== 0 && (
                <Text fontSize="12px" color="textSubtle">
                  <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={stakedTokenDollarBalance}
                    prefix="~"
                    unit=" USD"
                  />
                </Text>
              )}
            </>
          </Flex>
          <Flex>
            <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
              <MinusIcon color="primary" width="24px" />
            </IconButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <IconButton variant="secondary" disabled>
                  <AddIcon color="textDisabled" width="24px" height="24px" />
                </IconButton>
              </span>
            ) : (
              <IconButton
                variant="secondary"
                onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <AddIcon color="primary" width="24px" height="24px" />
              </IconButton>
            )}
          </Flex>
          {tooltipVisible && tooltip}
        </Flex>
      ) : (
        <Button disabled={isFinished} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
          {t("Stake")}
        </Button>
      );
    };

    return (
      <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
    );
  };
}
