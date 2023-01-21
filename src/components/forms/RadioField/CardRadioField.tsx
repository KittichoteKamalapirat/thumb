import { forwardRef, ReactNode } from "react";
import { ChangeHandler, FieldError, RefCallBack } from "react-hook-form";
import FormFieldLabel from "../FormFieldLabel";

export interface RadioOption {
  value: string;
  label: string;
}

interface Props {
  children: ReactNode;
  label?: string;
  error?: FieldError;
  labelClass?: string;

  // from register
  name?: string;
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
}

const CardRadioField = forwardRef(
  (
    { name, onChange, onBlur, label, children, labelClass = "mb-2" }: Props,
    ref
  ) => {
    return (
      <>
        <FormFieldLabel label={label} extraClass={`${labelClass} `} />
        <div>{children}</div>
      </>
    );
  }
);

CardRadioField.displayName = "CardRadioField";

export default CardRadioField;
