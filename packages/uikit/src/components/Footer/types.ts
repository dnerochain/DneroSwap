import { Language } from "../LangSelector/types";
import { FlexProps } from "../Box";

export type FooterLinkType = {
  label: string;
  items: { label: string; href?: string; isHighlighted?: boolean }[];
};

export type FooterProps = {
  items: FooterLinkType[];
  buyWDneroLabel: string;
  buyWDneroLink: string;
  isDark: boolean;
  toggleTheme: (isDark: boolean) => void;
  wdneroPriceUsd?: number;
  currentLang: string;
  langs: Language[];
  chainId: number;
  setLang: (lang: Language) => void;
} & FlexProps;
