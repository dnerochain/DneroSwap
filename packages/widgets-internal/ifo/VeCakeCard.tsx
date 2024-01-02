import { styled } from "styled-components";
import { Card, CardHeader, Flex, Text, QuestionHelper, FlexGap, CardBody } from "@dneroswap/uikit";
import { useTranslation } from "@dneroswap/localization";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { BigNumber } from "bignumber.js";
import Image from "next/image";

import { BalanceDisplay } from "./BalanceDisplay";

const StyledCard = styled(Card)`
  min-width: 280px;
  max-width: 100%;
  margin: 0 0 1.5em 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ theme }) => theme.colors.secondary};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 350px;
    margin: 0 12px 46px;
  }
`;

const StyledCardHeader = styled(CardHeader)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-radius: ${({ theme }) => `${theme.radii.card} ${theme.radii.card} 0 0`};
`;

function Header({ children }: PropsWithChildren) {
  return (
    <StyledCardHeader>
      <Flex alignItems="center" justifyContent="space-between">
        {children}
      </Flex>
    </StyledCardHeader>
  );
}

export function MyIWDnero({ amount = 0 }: { amount?: number | BigNumber }) {
  const { t } = useTranslation();
  const hasIWDnero = useMemo(() => Number(amount.toString()) > 0, [amount]);
  const color = hasIWDnero ? "secondary" : "failure";

  return (
    <FlexGap gap="0.25rem" flexDirection="column" justifyContent="flex-start">
      <Text fontSize="1.25rem" lineHeight="1.375rem" bold>
        {t("My iWDNERO")}
      </Text>
      <FlexGap gap="0.25rem" alignItems="center">
        <BalanceDisplay
          fontSize="1.5rem"
          bold
          value={Number(amount.toString())}
          decimals={2}
          lineHeight="1.75rem"
          color={color}
        />
        <QuestionHelper
          size="1.375rem"
          text={t(
            "Your available iWDNERO is calculated with the veWDNERO balance at the snapshot time, multiplied by a fixed ratio."
          )}
          color={color}
          placement="top-start"
        />
      </FlexGap>
    </FlexGap>
  );
}

export function IfoSalesLogo({ hasIWDnero }: { hasIWDnero?: boolean }) {
  return (
    <Image
      alt="ifo sales logo"
      src={`/images/ifos/assets/${hasIWDnero ? "ifo-sales-active" : "ifo-sales"}.png`}
      width={60}
      height={60}
    />
  );
}

type VeWDneroCardProps = PropsWithChildren<{
  header?: ReactNode;
}>;

export function VeWDneroCard({ header, children }: VeWDneroCardProps) {
  return (
    <StyledCard isActive>
      <Header>{header}</Header>
      <CardBody>{children}</CardBody>
    </StyledCard>
  );
}
