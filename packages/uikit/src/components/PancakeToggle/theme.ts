import { darkColors, lightColors } from "../../theme/colors";
import { DneroswapToggleTheme } from "./types";

export const light: DneroswapToggleTheme = {
  handleBackground: lightColors.backgroundAlt,
  handleShadow: lightColors.textDisabled,
};

export const dark: DneroswapToggleTheme = {
  handleBackground: darkColors.backgroundAlt,
  handleShadow: darkColors.textDisabled,
};
