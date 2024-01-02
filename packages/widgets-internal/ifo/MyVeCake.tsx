import { useTranslation } from "@dneroswap/localization";
import { FlexGap, Text } from "@dneroswap/uikit";
import { PropsWithChildren, useMemo } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import Image from "next/image";

import { BalanceDisplay } from "./BalanceDisplay";

const Container = styled(FlexGap)`
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.gradientPrimary};
  padding: 0.75rem 1rem;
`;

export function MyVeWDnero({ amount = 0 }: PropsWithChildren<{ amount?: number | BigNumber }>) {
  const { t } = useTranslation();
  const balanceNumber = useMemo(() => new BigNumber(amount).toNumber(), [amount]);
  const showLabel = useMemo(() => Math.floor(balanceNumber).toString().length < 9, [balanceNumber]);

  const label = showLabel ? (
    <Text fontSize="1.25rem" bold lineHeight="1.375rem" color="white">
      {t("veWDNERO")}
    </Text>
  ) : null;

  return (
    <Container alignItems="center" gap="0.5rem">
      <Image src="/images/wdnero-staking/token-vewdnero.png" alt="token-vewdnero" width={40} height={40} />
      <FlexGap
        flex="1"
        flexDirection="row"
        justifyContent={showLabel ? "space-between" : "flex-end"}
        gap="0.5rem"
        alignItems="center"
      >
        {label}
        <BalanceDisplay fontSize="1.25rem" bold color="white" value={balanceNumber} decimals={2} />
      </FlexGap>
    </Container>
  );
}
