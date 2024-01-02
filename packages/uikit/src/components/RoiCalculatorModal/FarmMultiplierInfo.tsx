import { styled } from "styled-components";
import { useTranslation } from "@dneroswap/localization";
import { Link } from "../Link";
import { Text } from "../Text";

const InlineText = styled(Text)`
  display: inline;
`;

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
`;

interface FarmMultiplierInfoProps {
  farmWDneroPerSecond: string;
  totalMultipliers: string;
}

export const FarmMultiplierInfo: React.FC<React.PropsWithChildren<FarmMultiplierInfoProps>> = ({
  farmWDneroPerSecond,
  totalMultipliers,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Text bold>
        {t("Farm’s WDNERO Per Second:")}
        <InlineText marginLeft={2}>{farmWDneroPerSecond}</InlineText>
      </Text>
      <Text bold>
        {t("Total Multipliers:")}
        <InlineText marginLeft={2}>{totalMultipliers}</InlineText>
      </Text>
      <Text my="24px">
        {t(
          "The Farm Multiplier represents the proportion of WDNERO rewards each farm receives as a proportion of its farm group."
        )}
      </Text>
      <Text my="24px">
        {t("For example, if a 1x farm received 1 WDNERO per block, a 40x farm would receive 40 WDNERO per block.")}
      </Text>
      <Text>
        {t("Different farm groups have different sets of multipliers.")}
        <InlineLink
          mt="8px"
          display="inline"
          href="https://docs.pancakeswap.finance/products/yield-farming/faq#why-a-2x-farm-in-v3-has-less-apr-than-a-1x-farm-in-v2"
          external
        >
          {t("Learn More")}
        </InlineLink>
      </Text>
    </>
  );
};
