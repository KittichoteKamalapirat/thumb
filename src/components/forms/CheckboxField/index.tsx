import classNames from "classnames";
import { forwardRef, useId } from "react";
import {
  ChangeHandler,
  FieldError,
  RefCallBack,
  UseFormRegisterReturn,
} from "react-hook-form";
import getErrorMessage from "../../../utils/getErrorMessage";

import FormHelperText from "../FormHelperText";

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

interface Props {
  disabled?: boolean;
  error?: FieldError;
  extraClass?: string;
  helperText?: string;
  isError?: boolean;
  label?: string;
  name?: string;
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
  value?: string;
  rows?: number;
  isDisabled?: boolean;
  option?: SelectOption;
  labelClass?: string;
  isChecked: boolean;
}

/* eslint-disable @typescript-eslint/no-empty-function */
const noopCallback = async () => {};
const nullRefCallback: RefCallBack = (_instance) => {};
/* eslint-enable @typescript-eslint/no-empty-function */

const CheckboxField = forwardRef(
  (
    {
      error,
      label = "",
      name = "",
      helperText = "",
      onBlur,
      onChange,
      value,
      isDisabled,
      extraClass,
      option = { value: "", label: "" },
      isError: isInputError = false,
      labelClass,
      isChecked,
      ...inputFields
    }: Props,
    ref
  ) => {
    const id = useId();
    const isError = !!error || isInputError;

    const errorMessage = getErrorMessage(label || name, error);
    const formRegisterFields: UseFormRegisterReturn = {
      onChange: onChange || noopCallback,
      onBlur: onBlur || noopCallback,
      ref: (ref as RefCallBack) || nullRefCallback,
      name: name || option.label || "",
      ...inputFields,
    };

    const isDisabledStyle = isDisabled
      ? "text-grey-300 cursor-not-allowed"
      : "cursor-pointer";

    return (
      <div>
        <label
          className={classNames(
            "flex items-center max-w-fit px-2 py-2 hover:bg-green-50 hover:cursor-pointer ",
            isDisabledStyle,
            labelClass
          )}
          htmlFor={id}
        >
          <input
            id={id}
            type="checkbox"
            aria-label={option.label}
            value={option.value}
            disabled={isDisabled}
            className="w-4 h-4 rounded hover:cursor-pointer"
            {...formRegisterFields}
          />
          <div
            className={classNames(
              "ml-2",
              isChecked ? "text-green-500 font-bold" : "text-grey-900"
            )}
          >
            {option.label}
          </div>
        </label>
        <FormHelperText
          isError={isError}
          helperText={errorMessage || helperText}
        />
      </div>
    );
  }
);

export default CheckboxField;
