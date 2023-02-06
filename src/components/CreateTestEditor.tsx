import classNames from "classnames";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import {
  Control,
  SubmitHandler,
  useFieldArray,
  UseFormReturn,
} from "react-hook-form";
import Button, { HTMLButtonType } from "./Buttons/Button";

import dayjs from "dayjs";
import { ChannelContext } from "../contexts/ChannelContext";
import {
  ACTION_ACTIVE_CARD_CLASSNAMES,
  ACTION_CARD_CLASSNAMES,
} from "../theme";
import { suggestNumTestDays } from "../utils/suggestNumTestDays";
import { FormValues, MyUpload } from "./CreateTest";
import TextField, { TextFieldTypes } from "./forms/TextField";
import { InputType } from "./forms/TextField/inputType";
import Searchbar from "./Searchbar";
import SubHeading from "./typography/SubHeading";
import DropzoneField, { UploadedFile } from "./DropzoneField";
import { testingTypeOptions } from "../firebase/types/Testing.type";

interface Props {
  uploads: MyUpload[];
  setUploads: Dispatch<SetStateAction<MyUpload[]>>;
  handleSearch: (query: string) => void;
  filteredUploads: MyUpload[];
  useFormData: UseFormReturn<FormValues>;
  onSubmit: SubmitHandler<FormValues>;
  selectedVideo: MyUpload | undefined;

  fileUploads: UploadedFile[];
  setFileUploads: Dispatch<SetStateAction<UploadedFile[]>>;
}

enum FormNames {
  VIDEO_ID = "videoId",
  DURATION_TYPE = "durationType",
  DURATION = "duration",
  VARI_TITLE = "variationTitles",
  ORI = "ori", // could be thumb url or title
  TYPE = "type",
  // TYPE = "type",
}

const CreateTestEditor = ({
  uploads,
  fileUploads,
  setUploads,
  handleSearch,
  filteredUploads,
  useFormData,
  onSubmit,
  selectedVideo,
  setFileUploads,
}: Props) => {
  const [search, setSearch] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useFormData;

  const { fields, append, remove } = useFieldArray({
    name: "variationTitles",
    control,
  });
  const { durationType, duration, videoId, type } = watch();

  // const testTypeWatch = watch(FormNames.TYPE);
  // const videoIdWatch = watch(FormNames.VIDEO_ID);
  // const durationWatch = watch(FormNames.DURATION);

  console.log("type", type);

  return (
    <div>
      {/* <Navbar /> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* section 0 */}

        <div>
          <div data-section="1" className="mt-4">
            <div className="flex gap-2">
              <SubHeading
                heading="Do you want to test a thumbnail or a title"
                extraClass="text-left text-xl mb-4 font-bold"
              />
              <span className="align-sub text-xl text-red-500">*</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {testingTypeOptions.map((option) => (
              <div key={option.value} className="flex col-span-6 md:col-span-4">
                <input
                  id={option.value}
                  type="radio"
                  value={option.value}
                  className="hidden"
                  checked={type === option.value}
                  {...register("type")}
                />
                <label
                  htmlFor={option.value}
                  className={classNames(
                    "w-full",
                    `${
                      type === option.value
                        ? ACTION_ACTIVE_CARD_CLASSNAMES
                        : ACTION_CARD_CLASSNAMES
                    }`
                  )}
                >
                  <div>{option.label}</div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* section 1 */}
        <div data-section="1" className="mt-4">
          <div className="flex gap-2">
            <SubHeading
              heading="1. Select the video"
              extraClass="text-left text-xl mb-4 font-bold"
            />
            <span className="align-sub text-xl text-red-500">*</span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {filteredUploads?.slice(0, 5).map((upload, index) => {
              const selectedClass =
                selectedVideo?.videoId === upload.videoId
                  ? "bg-primary-50"
                  : "";
              if (selectedVideo?.videoId === upload.videoId) {
              }

              return (
                <div
                  key={upload.videoId}
                  className="flex gap-2 col-span-2 md:col-span-1"
                >
                  <input
                    id={upload.videoId}
                    type="radio"
                    value={upload.videoId}
                    className="hidden"
                    {...register(FormNames.VIDEO_ID)}
                  />
                  <label
                    htmlFor={upload.videoId}
                    className={classNames(
                      "w-full",
                      `${
                        videoId === upload.videoId
                          ? ACTION_ACTIVE_CARD_CLASSNAMES
                          : ACTION_CARD_CLASSNAMES
                      }`
                    )}
                  >
                    <div className="flex item-start gap-2">
                      <div className="font-bold">
                        <img
                          src={upload.thumbnailUrl}
                          className="w-full rounded-xl"
                        />
                        <p className="text-lg mt-2">
                          {upload.title.slice(0, 80)}
                        </p>
                        <p>{upload.videoId}</p>
                      </div>
                    </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <Searchbar query={search} onChange={handleSearch} />

        {JSON.stringify(watch(), null, 2)}
        {/* section 2 Select a thumbnail */}
        {type === "title" && (
          <div data-section="2" className="mt-4">
            <div className="flex gap-2">
              <SubHeading
                heading="2. What title do you want to test?"
                extraClass="text-left text-xl mb-4 font-bold"
              />
              <span className="align-sub text-xl text-red-500">*</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <p className="font-bold mb-2">Original Title</p>
                {selectedVideo ? selectedVideo?.title : "Please select a video"}
              </div>

              {/* right side */}
              <div
                className={classNames(
                  "col-span-12 md:col-span-6 xl:col-span-8"
                )}
              >
                <p className="font-bold mb-2">Test Title</p>

                {fields.map((field, index) => {
                  return (
                    <div key={field.id}>
                      <div className="flex items-center gap-2 mb-4">
                        <label
                          htmlFor={`${FormNames.VARI_TITLE}.${index}.value`}
                          className="block mb-2 text-sm font-medium text-gray-900 "
                        >
                          {index + 1}.
                        </label>
                        <input
                          type="text"
                          id={`${FormNames.VARI_TITLE}.${index}.value`}
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                          placeholder="John"
                          required
                          {...register(
                            `${FormNames.VARI_TITLE}.${index}.value`
                          )}
                        />
                        <Button label="delete" onClick={() => remove(index)} />
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-end">
                  <Button
                    label="Add title"
                    fontColor="text-grey-0"
                    buttonType={HTMLButtonType.BUTTON}
                    onClick={() => append({ value: "" })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* section 2 (thumbnail) */}
        {type === "thumb" && (
          <div data-section="2" className="mt-4">
            <div className="flex gap-2">
              <SubHeading
                heading="2. Upload thumbnails"
                extraClass="text-left text-xl mb-4 font-bold"
              />
              <span className="align-sub text-xl text-red-500">*</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <p className="font-bold text-primary mb-2">
                  Original Thumbnail
                </p>
              </div>
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                <p className="font-bold text-primary mb-2">Test Thumbnail</p>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 md:col-span-6 xl:col-span-4">
                {true ? (
                  <img
                    // src={fileUploads[0].url}
                    src="https://firebasestorage.googleapis.com/v0/b/mee-time-364614.appspot.com/o/files%2FHair_Salon_Stations.jpeg?alt=media&token=302382b1-8c3c-43c4-96cc-c25c479d586f"
                    className="w-full rounded-xl"
                  />
                ) : (
                  <div>Select a video</div>
                )}
              </div>
              <div
                className={classNames(
                  "col-span-12 md:col-span-6 xl:col-span-8",
                  fileUploads.length === 0 &&
                    "border-dashed border-[2px] rounded-xl border-primary-500 cursor-pointer p-4"
                )}
              >
                <DropzoneField
                  ariaLabel="Image"
                  fileUploads={fileUploads}
                  setFileUploads={setFileUploads}
                  showConfirmationOnDelete={false}
                  maxFiles={10}
                />
              </div>
            </div>
          </div>
        )}

        {/* section 3 */}
        <div data-section="3" className="mt-4">
          {/* select duration label */}
          <div className="flex gap-2">
            <SubHeading
              heading="3. How long would you like to test?"
              extraClass="text-left text-xl mb-4 font-bold"
            />
            <span className="align-sub text-xl text-red-500">*</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex item-start gap-2">
              <div>
                <TextField
                  name={FormNames.DURATION}
                  control={control as unknown as Control}
                  containerClass="w-full sm:w-80"
                  placeholder="15"
                  inputType={InputType.Number}
                  type={TextFieldTypes.OUTLINED}
                  extraClass="w-full"
                  labelClass="mt-4"
                  error={errors[FormNames.DURATION]}
                  validation={
                    durationType === "specific"
                      ? {
                          min: {
                            value: 1,
                            message: "cannot be 0",
                          },
                          max: {
                            value: 100,
                            message: "has to be less than 101",
                          },
                        }
                      : {}
                  }
                />

                {fields.length > 0 && (
                  <div>
                    <p>
                      Since you have {fields.length} titles to test. We
                      recommend the following number of days.
                    </p>

                    <div className="flex gap-2">
                      {suggestNumTestDays(fields.length).map((num) => (
                        <div
                          key={num}
                          onClick={() => setValue(FormNames.DURATION, num)}
                          className={classNames(
                            "border w-20 text-center hover:cursor-pointer hover:bg-primary-50 px-2 py-1 rounded-md",
                            num === duration && "bg-primary-50"
                          )}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="mt-4">
                  Test will complete on{" "}
                  <span className="font-bold">
                    {" "}
                    {dayjs()
                      .add(duration, "d")
                      .format("dddd, MMMM DD, YYYY")}{" "}
                  </span>
                </p>

                <p className="mt-4">
                  Final results will be available on
                  <span className="font-bold text-green-500">
                    {" "}
                    {dayjs()
                      .add(duration + 2, "d")
                      .format("dddd, MMMM DD, YYYY")}{" "}
                  </span>
                  because{" "}
                  <span className="text-red-500">Youtube Analytics</span> are
                  delayed 48 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <Button
            label="Create a test"
            fontColor="text-grey-0"
            buttonType={HTMLButtonType.SUBMIT}
            disabled={!isValid || isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
export default CreateTestEditor;
