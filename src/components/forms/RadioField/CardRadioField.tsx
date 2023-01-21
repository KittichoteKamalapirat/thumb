import classNames from "classnames";
import { forwardRef, ReactNode } from "react";
import {
  ChangeHandler,
  FieldError,
  RefCallBack,
  UseFormRegisterReturn,
} from "react-hook-form";
import {
  ACTION_ACTIVE_CARD_CLASSNAMES,
  ACTION_CARD_CLASSNAMES,
} from "../../../theme";

const noopCallback = async () => {};
const nullRefCallback: RefCallBack = (_instance) => {};

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
  watchedValue: string;
  value: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const CardRadioField = forwardRef(
  (
    {
      name,
      onChange,
      onBlur,
      watchedValue,
      value,
      label,
      inputRef,
      children,
      labelClass = "mb-2",
      ...inputFields
    }: Props,
    ref
  ) => {
    console.log("wwwwwatched", watchedValue);
    console.log("ref", ref);

    const formRegisterFields: UseFormRegisterReturn | undefined = (() => {
      return {
        onChange: onChange || noopCallback,
        onBlur: onBlur || noopCallback,
        ref: (ref as RefCallBack) || nullRefCallback,
        name: name || label || "",
        ...inputFields,
      };
    })();

    return (
      <>
        <div key={value} className="flex gap-2 col-span-2 md:col-span-1">
          <input
            id={value}
            type="radio"
            // ref={inputRef}
            value={value}
            className="hidden"
            {...formRegisterFields}
          />
          <label
            htmlFor={value}
            className={classNames(
              "w-full",
              `${
                watchedValue === value
                  ? ACTION_ACTIVE_CARD_CLASSNAMES
                  : ACTION_CARD_CLASSNAMES
              }`
            )}
          >
            {children}
          </label>
        </div>
      </>
    );
  }
);

CardRadioField.displayName = "CardRadioField";

export default CardRadioField;
