import { forwardRef } from "react";
import { ChangeHandler, FieldError, RefCallBack } from "react-hook-form";
import FormFieldLabel from "../FormFieldLabel";

export interface RadioOption {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  error?: FieldError;
  options: RadioOption[];
  labelClass?: string;

  // from register
  name?: string;
  onBlur?: ChangeHandler;
  onChange?: ChangeHandler;
}

const RadioField = forwardRef(
  (
    { name, options, onChange, onBlur, label, labelClass = "mb-2" }: Props,
    ref
  ) => {
    return (
      <>
        <FormFieldLabel label={label} extraClass={`${labelClass} `} />

        <div>
          {options.map((option) => (
            <div key={option.value}>
              <label htmlFor={option.value}>
                <input
                  ref={ref as RefCallBack}
                  id={option.value}
                  name={name}
                  type="radio"
                  onChange={onChange}
                  onBlur={onBlur}
                  value={option.value}
                />
                <span className="ml-1">{option.label}</span>
              </label>
            </div>
          ))}
        </div>
      </>
    );
  }
);

RadioField.displayName = "RadioField";

export default RadioField;
