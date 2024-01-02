import React from "react";
import { SequencePlayer } from "./SequencePlayer";
import { dtoken2WDneroImages, wdnero2DTokenImages } from "./constant";

export default {
  title: "Components/CoinSwitcher",
  component: SequencePlayer,
  argTypes: {},
};

export const DToken2WDnero: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={dtoken2WDneroImages()} />
    </div>
  );
};

export const WDnero2DToken: React.FC<React.PropsWithChildren> = () => {
  return (
    <div>
      <SequencePlayer images={wdnero2DTokenImages()} />
    </div>
  );
};
