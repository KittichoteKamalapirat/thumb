import {
  Control,
  Controller,
  FieldPath,
  FieldPathValue,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import Select from "react-select";
import FormFieldLabel from "../FormFieldLabel";
import FormHelperText from "../FormHelperText";

import getErrorMessage from "../../../utils/getErrorMessage";
import { getStyles } from "./utils";

export interface SelectOption<T = string> {
  value: T;
  label: string;
}

export declare type SelectChangeFunction = (newValue: {
  value: string;
  label: string;
}) => void;

interface Props {
  children?: React.ReactNode;
  className?: string;
  control: Control;
  helperIcon?: React.ReactNode;
  helperText?: string;
  isClearable?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  label?: string;
  labelClass?: string;
  labelFontColour?: string;
  name?: string;
  options?: SelectOption[];
  placeholder?: string;
  onSelectChange?: SelectChangeFunction;
  validation?: RegisterOptions;
  required?: boolean;
  selectClass?: string;
  isDisabled?: boolean;
  defaultValue?: SelectOption;
  watch?: FieldPathValue<FieldValues, FieldPath<FieldValues>>;
  optionalLabelStyle?: string;
  testId?: string;
  noOptionsMessage?: string;
}

const SelectField = ({
  children,
  selectClass = "",
  className = "",
  control,
  helperIcon = null,
  helperText = "",
  isClearable = true,
  isError: isInputError,
  isLoading = false,
  isSearchable = false,
  label = "",
  labelClass = "mb-2",
  name = "",
  options = [],
  placeholder = "Select an option",
  onSelectChange,
  required = false,
  validation = {},
  isDisabled = false,
  optionalLabelStyle = "",
  defaultValue,
  labelFontColour,
  testId = "",
  noOptionsMessage = "No Options",
}: Props) => {
  return (
    <div className={className}>
      <FormFieldLabel
        label={label}
        fontColour={labelFontColour}
        extraClass={labelClass}
        displayOptionalLabel={!required}
        optionalLabelStyle={optionalLabelStyle}
      />
      <Controller
        control={control}
        name={name || label}
        rules={{ ...validation, required: required ? "is required" : false }}
        render={({
          field: { onChange, onBlur, value, ref },
          fieldState: { invalid, error },
        }) => {
          const isError = !!(error || invalid || isInputError);
          const errorMessage = getErrorMessage(label || name, error);

          return (
            <>
              <div className="flex flex-row items-center" data-testid={testId}>
                <Select
                  ref={ref}
                  // tslint:disable-next-line: react-hooks-nesting
                  styles={getStyles(isError)}
                  value={defaultValue || value}
                  isClearable={isClearable}
                  isSearchable={isSearchable}
                  className={selectClass}
                  options={options}
                  isLoading={isLoading}
                  aria-label={name || label}
                  onChange={onSelectChange || onChange}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  isDisabled={isDisabled}
                  noOptionsMessage={() => <div>{noOptionsMessage}</div>}
                />
                {children}
              </div>
              <div className="flex flex-row items-center w-full">
                {Boolean(helperIcon) && (
                  <div className="mr-2">{helperIcon}</div>
                )}
                <FormHelperText
                  isError={isError}
                  helperText={errorMessage || helperText}
                />
              </div>
            </>
          );
        }}
      />
    </div>
  );
};

export default SelectField;
