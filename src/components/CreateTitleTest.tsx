import { zodResolver } from "@hookform/resolvers/zod";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import {
  Control,
  FieldErrorsImpl,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import Button, { HTMLButtonType } from "./Buttons/Button";

import { ChannelContext } from "../contexts/ChannelContext";
import { getVidList } from "../firebase/client";
import { createTesting } from "../firebase/createTesting";
import { DurationType } from "../firebase/types/Testing.type";
import { urlResolver } from "../lib/UrlResolver";
import {
  ACTION_ACTIVE_CARD_CLASSNAMES,
  ACTION_CARD_CLASSNAMES,
} from "../theme";
import { debounce } from "../utils/debounce";
import TextField, { TextFieldTypes } from "./forms/TextField";
import { InputType } from "./forms/TextField/inputType";
import Searchbar from "./Searchbar";
import SubHeading from "./typography/SubHeading";
import dayjs from "dayjs";
import SelectField from "./forms/SelectField";
import { discovery_v1 } from "googleapis";
import { suggestNumTestDays } from "../utils/suggestNumTestDays";

interface Props {}

interface MyUpload {
  videoId: string;
  thumbnailUrl: string;
  title: string;
}
// const oauth2Client = new google.auth.OAuth2(client, secret, redirect);

const TitleSchema = z
  .object({
    value: z.string().min(1, "Title cannot be empty"),
  })
  .array();

const StatsSignificantSchema = z.object({
  videoId: z.string().min(1, { message: "Please select a video" }),
  variationTitles: TitleSchema,
  originalTitle: z.string(),
  durationType: z.literal("stats_significant"),
  type: z.literal("title"),
});

const CertainDaysSchema = z.object({
  videoId: z.string().min(1, { message: "Please select a video" }),
  variationTitles: TitleSchema,
  durationType: z.literal("specific"),
  originalTitle: z.string(),
  duration: z.number(),
  type: z.literal("title"),
});

const durationTypeOptions: { label: string; value: DurationType }[] = [
  { label: "A set number of days", value: "specific" },
  {
    label: 'Run until click-through rate is "Statistically Significant"',
    value: "stats_significant",
  },
];

const FormSchema = z.discriminatedUnion("durationType", [
  StatsSignificantSchema,
  CertainDaysSchema,
]);

type StatsSignificantFormValues = z.infer<typeof StatsSignificantSchema>;
type CertainDaysFormValues = z.infer<typeof CertainDaysSchema>;
export type FormValues = z.infer<typeof FormSchema>;

export type CreateTitleTestInput = FormValues;

enum FormNames {
  VIDEO_ID = "videoId",
  DURATION_TYPE = "durationType",
  DURATION = "duration",
  VARI_TITLE = "variationTitles",
  ORI_TITLE = "originalTitle",
  TYPE = "type",
  // TYPE = "type",
}

// export interface FormValues {
//   [FormNames.VIDEO_ID]: string;
//   [FormNames.DURATION_TYPE]: DurationType;
//   [FormNames.DURATION]: number; // in days
//   // [FormNames.TYPE]: TestingType ; // TODO add this later, now only thumbnail
// }

const defaultValues: FormValues = {
  [FormNames.VIDEO_ID]: "PlT05VwzMlg",
  [FormNames.DURATION_TYPE]: "specific",
  [FormNames.DURATION]: 7, // in  days
  [FormNames.VARI_TITLE]: [{ value: "" }],
  [FormNames.ORI_TITLE]: "opriginal title",
  [FormNames.TYPE]: "title",
};

const CreateTitleTest = ({}: Props) => {
  // const [selectedUpload, setSelectedUpload] = useState<MyUpload>();
  const [uploads, setUploads] = useState<MyUpload[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<MyUpload[]>([]);
  const params = useParams();

  const { channel, setChannel } = useContext(ChannelContext);
  const channelId = channel.channelId;
  const location = useLocation();

  const [search, setSearch] = useState("");

  const handleSearch = (query: string) => {
    setSearch(query);

    const searchDebounce = debounce((query) => {
      if (query) {
        const filtered = [...uploads].filter(
          (upload) =>
            upload.title.includes(query) || upload.videoId.includes(query)
        );
        setFilteredUploads(filtered);
      } else setFilteredUploads(uploads);
    }, 1000);
    searchDebounce(query);
  };

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(FormSchema),
    // shouldUnregister: true, // TODO uncomment
  });

  const { fields, append, remove } = useFieldArray({
    name: "variationTitles",
    control,
  });
  const durationTypeWatch = watch(FormNames.DURATION_TYPE);
  const videoIdWatch = watch(FormNames.VIDEO_ID);
  const selectedVideo = uploads?.find(
    (upload) => upload.videoId === videoIdWatch
  );
  const durationWatch = watch(FormNames.DURATION);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
    try {
      const docId = await createTesting(channelId, input);

      if (docId) {
        navigate(urlResolver.myTest(docId));
      } else {
        console.log("......cannot create ");
      }
    } catch (error) {
      console.log("error inside  catch", error);
    }
  };

  const isSubmittable =
    videoIdWatch &&
    (durationTypeWatch === "stats_significant" ||
      (durationTypeWatch === "specific" && durationWatch));

  useEffect(() => {
    const handleList = async () => {
      const result = await getVidList(channelId);
      const myUploads = result;
      setUploads(myUploads);
      setFilteredUploads(myUploads);
    };

    if (channelId) handleList();
  }, [channelId]);

  useEffect(() => {
    if (!selectedVideo) return;
    setValue(FormNames.ORI_TITLE, selectedVideo?.title);
  }, [selectedVideo]);

  useEffect(() => {
    setValue(FormNames.TYPE, "title");
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <AuthDisplay /> */}

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
                        videoIdWatch === upload.videoId
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
              className={classNames("col-span-12 md:col-span-6 xl:col-span-8")}
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
                        {...register(`${FormNames.VARI_TITLE}.${index}.value`)}
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
                  error={
                    (errors as FieldErrorsImpl<CertainDaysFormValues>)[
                      FormNames.DURATION
                    ]
                  }
                  validation={
                    durationTypeWatch === "specific"
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
                            num === durationWatch && "bg-primary-50"
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
                  {dayjs()
                    .add(durationWatch, "d")
                    .format("dddd, MMMM DD, YYYY")}
                </p>

                <p className="mt-4">
                  Final results will be available on
                  <span>
                    {" "}
                    {dayjs()
                      .add(durationWatch + 2, "d")
                      .format("dddd, MMMM DD, YYYY")}{" "}
                  </span>
                  because Youtube Analytics are delayed 48 hours
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
export default CreateTitleTest;
