import React from "react";
import { DneroswapStack, DneroswapInput, DneroswapLabel } from "./StyledDneroswapToggle";
import { DneroswapToggleProps, scales } from "./types";

const DneroswapToggle: React.FC<React.PropsWithChildren<DneroswapToggleProps>> = ({
  checked,
  scale = scales.LG,
  ...props
}) => (
  <DneroswapStack scale={scale}>
    <DneroswapInput id={props.id || "dneroswap-toggle"} scale={scale} type="checkbox" checked={checked} {...props} />
    <DneroswapLabel scale={scale} checked={checked} htmlFor={props.id || "dneroswap-toggle"}>
      <div className="pancakes">
        <div className="dneroswap" />
        <div className="dneroswap" />
        <div className="dneroswap" />
        <div className="butter" />
      </div>
    </DneroswapLabel>
  </DneroswapStack>
);

export default DneroswapToggle;
