import React from "react";
import { WDneroPrice, WDneroPriceProps } from ".";
import { Flex } from "../Box";

export default {
  title: "Components/WDneroPrice",
  component: WDneroPrice,
};

const Template: React.FC<React.PropsWithChildren<WDneroPriceProps>> = ({ ...args }) => {
  return (
    <Flex p="10px">
      <WDneroPrice {...args} />
    </Flex>
  );
};

export const Default = Template.bind({});
Default.args = {
  wdneroPriceUsd: 20.0,
};
