import { useEffect } from "react";
import { Control, useForm } from "react-hook-form";
import { BiTimeFive } from "react-icons/bi";
import { ICON_SIZE } from "../../constants";
import { InputType } from "../../constants/inputType";
import { Setting, useUpdateSettingMutation } from "../../generated/graphql";
import Button, { HTMLButtonType } from "../Buttons/Button";
import TextField, { TextFieldTypes } from "../forms/TextField";
import HDivider from "../layouts/HDivider";
import { WiHumidity } from "react-icons/wi";
import { TbBulb, TbTemperature } from "react-icons/tb";
import { showToast } from "../../redux/slices/toastReducer";
import { useDispatch } from "react-redux";

interface Props {
  setting: Setting;
}

enum FormNames {
  TIME = "time",
}

interface FormValues {
  [FormNames.TIME]: string;
}

const initialData = { time: "0" };

const UpdateSetting = ({ setting }: Props) => {
  // graphql
  const [updateSetting, { loading: updateLoading }] =
    useUpdateSettingMutation();

  // constants
  const { name, value, description, label } = setting;

  // redux
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    defaultValues: initialData,
  });

  const onSubmit = async (data: FormValues) => {
    if (!name) return;
    try {
      await updateSetting({
        variables: {
          input: { name, value: data[FormNames.TIME] },
        },
      });
      dispatch(
        showToast({
          message: `Setting for ${name} successfully update`,
          variant: "success",
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const icon = (() => {
    switch (setting.name) {
      case "containerSnapshotIntervalMin":
        return <BiTimeFive size={ICON_SIZE + 10} />;
      case "humidityThreshold":
        return <WiHumidity size={ICON_SIZE + 10} />;
      case "temperatureThreshold":
        return <TbTemperature size={ICON_SIZE + 10} />;
      case "trayLocationBlinkingSec":
        return <TbBulb
          size={ICON_SIZE + 10}
        />
      default:
        return null;
    }
  })();

  useEffect(() => {
    if (value) setValue(FormNames.TIME, value); // sometimes, initialValue is set before the value is loaded
  }, [value, setValue]);

  return (
    <>
      <div className="grid grid-cols-2 my-4">
        <div id="left" className="col-span-1">
          <div className="flex items-center gap-2">
            {icon}
            <div className="font-bold">{label}:</div>
          </div>
          <div>{description}</div>
        </div>

        <div id="right" className="col-span-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-2">
              <TextField
                required
                name={FormNames.TIME}
                control={control as unknown as Control}
                containerClass="w-full sm:w-80"
                placeholder="Drying Time"
                type={TextFieldTypes.OUTLINED}
                inputType={InputType.Text}
                extraClass="w-full"
                labelClass="mt-4.5 mb-2"
                error={errors[FormNames.TIME]}
              />
              <Button
                label="Update"
                buttonType={HTMLButtonType.SUBMIT}
                loading={updateLoading}
                disabled={!isDirty}
              />
            </div>
          </form>
        </div>
      </div>
      <HDivider />
    </>
  );
};
export default UpdateSetting;
