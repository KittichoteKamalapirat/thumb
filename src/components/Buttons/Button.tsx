import { Link } from "react-router-dom";
import Spinner from "../Spinner";

export enum ButtonTypes {
  PRIMARY = "primary",
  ACTION = "action",
  SECONDARY = "secondary",
  OUTLINED = "outlined",
  TEXT = "text",
}

export enum HTMLButtonType {
  SUBMIT = "submit",
  RESET = "reset",
  BUTTON = "button",
}

interface Props {
  onClick?: () => void;
  label: string;
  ariaLabel?: string;
  type: ButtonTypes;
  href: string;
  height: string;
  spacing: string;
  extraClass: string;
  buttonType?: HTMLButtonType;
  disabled: boolean;
  borderColor: string;
  borderRadius: string;
  borderWidth: string;
  fontSize: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fontColor: string;
  loading?: boolean;
}

interface ClassProps {
  type: ButtonTypes;
  disabled: boolean;
  spacing: string;
  fontSize: string;
  extraClass: string;
  height: string;
  borderColor: string;
  borderRadius: string;
  borderWidth: string;
  fontColor: string;
}

const useClassName = ({
  type,
  disabled,
  spacing,
  borderRadius,
  borderColor,
  borderWidth,
  fontSize,
  fontColor,
  extraClass,
  height,
}: ClassProps) => {
  const commonClass = `px-4 border border-2 border-grey py-2 text-grey rounded shadow-md no-underline px-4 rounded-md ${fontSize} ${height} ${spacing} ${borderRadius} ${extraClass} ${
    disabled ? "opacity-50 cursor-not-allowed" : ""
  }`;
  const borderClass = `${borderColor} ${borderWidth}`;

  switch (type) {
    case ButtonTypes.OUTLINED:
      return `hover:bg-grey-100 py-2 ${fontColor} ${borderClass} ${commonClass}`;

    case ButtonTypes.SECONDARY:
      return `bg-grey-100 hover:bg-grey-200 py-2  text-grey-250 text-opacity-70 text-11px font-nunito ${commonClass}`;

    case ButtonTypes.TEXT:
      return `${fontColor} hover:text-primary-hovered text-15px underline px-0 ${commonClass}`;

    case ButtonTypes.ACTION:
      return `bg-action hover:bg-primary-hovered py-2 text-white ${commonClass}`;

    case ButtonTypes.PRIMARY:
    default:
      return `bg-primary-primary hover:bg-primary-hovered py-2 text-white ${commonClass}`;
  }
};

const Button = ({
  onClick,
  label,
  ariaLabel,
  type,
  href,
  spacing,
  extraClass,
  buttonType,
  disabled,
  height,
  fontSize,
  borderColor,
  borderRadius,
  borderWidth,
  startIcon,
  endIcon,
  fontColor,
  loading,
}: Props) => {
  const className = useClassName({
    type,
    disabled,
    spacing,
    fontSize,
    extraClass,
    height,
    borderColor,
    borderRadius,
    borderWidth,
    fontColor,
  });

  const button = (
    <button
      disabled={disabled}
      type={buttonType}
      className={className}
      onClick={onClick}
      name={label}
      aria-label={ariaLabel ?? label}
    >
      <div className="flex flex-row items-center justify-center">
        {loading && <Spinner size="w-4 h-4" longColor="text-grey-0" />}
        {startIcon && <div className="mr-2">{startIcon}</div>}
        {label}
        {endIcon && <div className="ml-2">{endIcon}</div>}
      </div>
    </button>
  );

  return href ? <Link to={href}>{button}</Link> : button;
};

Button.defaultProps = {
  type: ButtonTypes.PRIMARY,
  spacing: "px-5.5",
  height: "h-7.75",
  extraClass: "",
  href: "",
  buttonType: HTMLButtonType.BUTTON,
  disabled: false,
  borderRadius: "rounded-5px",
  borderColor: "border-primary-primary",
  borderWidth: "border",
  fontSize: "text-13px",
  fontColor: "text-primary-primary",
};

export default Button;
