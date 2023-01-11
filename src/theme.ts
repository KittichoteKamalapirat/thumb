import classNames from "classnames";

export const green = "#57B65F";
export const blue = "#4E97F3";
export const red = "#D2042D";
export const yellow = "#E6CC00";

// white grey and black
export const grey0 = "#FFFFFF";
export const grey50 = "#F5F0F0";
export const grey100 = "#E0E0E0";
export const grey200 = "#C2C2C2";
export const grey300 = "#8F8F8F";
export const grey400 = "#7A7A7A";
export const grey500 = "#666666";
export const grey600 = "#525252";
export const grey700 = "#3D3D3D";
export const grey800 = "#292929";
export const grey850 = "#1F1F1F";
export const grey900 = "#121212";
// main
export const primaryColor = "#0018A8";
export const primaryHoveredColor = "#FEBA72";

export const bgColor = grey0;
export const primaryTextColor = grey900;
export const inactiveGrey = grey200;

// font family
export const sansFamily = ["TTCommonsRegular", "Arial", "sans-serif"];
export const serifFamily = ["TTCommonsMedium", "Arial", "sans-serif"];
export const monoFamily = ["Nunito", "Montserrat", "Arial", "sans-serif"];

// font size
export const fontSizeXS = "12px";
export const fontSizeSM = "14px";
export const fontSizeMD = "16px";
export const fontSizeLG = "18px";
export const fontSizeXL = "20px";
export const fontSize2XL = "24px";
export const fontSize3XL = "30px";

// space
export const space2XS = "0.125rem";
export const spaceXS = "0.25rem";
export const spaceSM = "0.5rem";
export const spaceMD = "1rem";
export const spaceLG = "1.25rem";
export const spaceXL = "1.5rem";
export const space2XL = "2rem";
export const space3XL = "4rem";

export const CARD_CLASSNAMES =
  "border-solid rounded-md border-2 border-grey-50 p-6 shadow-md my-4";

export const UNCLICKABLE_CARD_CLASSNAMES = classNames(
  CARD_CLASSNAMES,
  "hover:cursor-default"
);

export const BORDER_CLASSNAMES =
  "border-solid rounded-md border-2 border-grey-50 p-6 shadow-md my-4";

export const ACTIVE_PAGE_CLASSNAMES =
  "text-primary-primary font-bold border-solid border-b-2 border-primary-primary rounded-t-md";

export const ACTION_CARD_CLASSNAMES = `${CARD_CLASSNAMES} hover:bg-primary-50 hover:cursor-pointer`;
