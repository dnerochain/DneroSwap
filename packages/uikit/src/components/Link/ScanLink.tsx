import React, { ReactElement, useMemo } from "react";
import Link from "./Link";
import OpenNewIcon from "../Svg/Icons/OpenNew";
import DneroScanIcon from "../Svg/Icons/DneroScan";
import { LinkProps } from "./types";

interface ScanLinkProps extends Omit<LinkProps, "external" | "showExternalIcon"> {
  icon?: ReactElement;
  useDneroCoinFallback?: boolean;
}

const ScanLink: React.FC<React.PropsWithChildren<ScanLinkProps>> = ({
  children,
  icon,
  useDneroCoinFallback,
  ...props
}) => {
  const iconToShow = useMemo(() => {
    if (icon) return icon;
    if (useDneroCoinFallback) return <DneroScanIcon />;
    return <OpenNewIcon />;
  }, [icon, useDneroCoinFallback]);
  const iconElement = useMemo(() => {
    return React.isValidElement(iconToShow)
      ? React.cloneElement(iconToShow, {
          // @ts-ignore
          color: props.color ? props.color : "primary",
          ml: "4px",
        })
      : null;
  }, [iconToShow, props.color]);
  return (
    <Link external {...props}>
      {children}
      {iconElement}
    </Link>
  );
};

export default ScanLink;
