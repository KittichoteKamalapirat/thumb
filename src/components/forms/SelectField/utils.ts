import { StylesConfig } from "react-select";
import { SelectOption } from ".";
import { fontSizeMD } from "../../../theme";

type IsMulti = false;
export const getStyles = (
  displayError: boolean
): StylesConfig<SelectOption, IsMulti> => {
  const currentColour = displayError ? "#ef4444" : "#E4E7EB";

  return {
    valueContainer: (provided) => ({
      ...provided,
      height: "2rem",
    }),
    control: (provided) => ({
      ...provided,
      borderColor: currentColour,
      cursor: "pointer",
      appearance: "none",
      boxShadow: "none",
      borderRadius: "0.25rem",
      fontSize: fontSizeMD,
      "&:focus": {
        outline: "none",
        borderColor: currentColour,
      },
      "&:hover": {
        outline: "none",
        borderColor: currentColour,
      },
      minHeight: "2rem",
      height: "2rem",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: fontSizeMD,
      fontWeigfht: "400",
      marginTop: "1px",
    }),
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      fontSize: fontSizeMD,
      fontWeight: "400",
      color: "#000",
      backgroundColor: state.isSelected ? "#bae6fd" : "#fff",
      "&:hover": {
        backgroundColor: "#bae6fd",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: fontSizeMD,
      fontWeight: "400",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#8b8b8b",
      fontSize: "10px",
      fontWeight: "300",
    }),
    input: (provided) => ({
      ...provided,
      marginY: "0px",
      fontWeight: "400",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "2rem",
    }),
  };
};
