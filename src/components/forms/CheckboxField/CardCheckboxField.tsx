import classNames from "classnames";
import { forwardRef } from "react";
import {
  ChangeHandler,
  FieldError,
  RefCallBack,
  UseFormWatch,
} from "react-hook-form";
import {
  ACTION_ACTIVE_CARD_CLASSNAMES,
  ACTION_CARD_CLASSNAMES,
} from "../../../theme";
import FormFieldLabel from "../FormFieldLabel";

export interface RadioOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  error?: FieldError;
  watch: UseFormWatch<any>;
  options: RadioOption[];
  labelClass?: string;
  direction?: "row" | "column";
  // from register
  name: string;
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
}

const CardCheckboxField = forwardRef(
  (
    {
      name,
      options,
      watch,
      onChange,
      onBlur,
      label,
      direction = "row",
      labelClass = "mb-2",
    }: Props,
    ref
  ) => {
    const currentValues = watch(name);

    return (
      <div>
        <FormFieldLabel label={label} extraClass={`${labelClass} `} />

        <div
          className={classNames(
            "flex items-start gap-2",
            direction === "row" ? "" : " flex-col "
          )}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="flex gap-2 col-span-2 md:col-span-1"
            >
              <input
                ref={ref as RefCallBack}
                id={option.value}
                name={name}
                type="checkbox"
                onChange={onChange}
                className="hidden"
                onBlur={onBlur}
                value={option.value}
              />
              <label
                htmlFor={option.value}
                className={classNames(
                  "w-full",
                  `${
                    (currentValues || []).includes(option.value)
                      ? ACTION_ACTIVE_CARD_CLASSNAMES
                      : ACTION_CARD_CLASSNAMES
                  }`
                )}
              >
                <div className="flex item-start gap-2">
                  <div className="font-bold">{option.label}</div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

CardCheckboxField.displayName = "CardCheckboxField";

export default CardCheckboxField;
