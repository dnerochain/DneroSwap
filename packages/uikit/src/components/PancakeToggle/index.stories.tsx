import React, { useState } from "react";
import DneroswapToggle from "./DneroswapToggle";

export default {
  title: "Components/DneroswapToggle",
  component: DneroswapToggle,
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [isChecked, setIsChecked] = useState(false);

  const toggle = () => setIsChecked(!isChecked);

  return (
    <>
      <div style={{ marginBottom: "32px" }}>
        <DneroswapToggle checked={isChecked} onChange={toggle} />
      </div>
      <div style={{ marginBottom: "32px" }}>
        <DneroswapToggle checked={isChecked} onChange={toggle} scale="md" />
      </div>
      <div>
        <DneroswapToggle checked={isChecked} onChange={toggle} scale="sm" />
      </div>
    </>
  );
};
