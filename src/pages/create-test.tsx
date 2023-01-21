import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { Control, FieldError, useForm } from "react-hook-form";
import { AiOutlineShop, AiOutlineHome } from "react-icons/ai";
import { useLocation, useParams } from "react-router-dom";
import Button, { HTMLButtonType } from "../components/Buttons/Button";
import DropzoneField, { UploadedFile } from "../components/DropzoneField";
import CardCheckboxField from "../components/forms/CheckboxField/CardCheckboxField";
import RadioField from "../components/forms/RadioField";
import CardRadioField from "../components/forms/RadioField/CardRadioField";

import TextField, { TextFieldTypes } from "../components/forms/TextField";
import { InputType } from "../components/forms/TextField/inputType";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";
import SubHeading from "../components/typography/SubHeading";
import { ChannelContext } from "../contexts/ChannelContext";
import {
  createAndSaveTokensCall,
  getStats,
  getVidList,
  updateThumbnail,
} from "../firebase/client";
import { createTesting } from "../firebase/createTesting";
import { DurationType, TestingType } from "../firebase/types/Testing.type";
import {
  ACTION_ACTIVE_CARD_CLASSNAMES,
  ACTION_CARD_CLASSNAMES,
} from "../theme";

interface Props {}

interface MyUpload {
  videoId: string;
  thumbnailUrl: string;
  title: string;
}
// const oauth2Client = new google.auth.OAuth2(client, secret, redirect);

interface StatProps {
  channelId: string;
  videoIds: string[];
}

const durationTypeOptions: { label: string; value: DurationType }[] = [
  { label: "A set number of days", value: "specific" },
  {
    label: 'Run until click-through rate is "Statistically Significant"',
    value: "stats_significant",
  },
];

enum FormNames {
  VIDEO_ID = "videoId",
  DURATION_TYPE = "durationType",
  DURATION = "duration",
  // TYPE = "type",
}

export interface FormValues {
  [FormNames.VIDEO_ID]: string;
  [FormNames.DURATION_TYPE]: DurationType;
  [FormNames.DURATION]: number; // in days
  // [FormNames.TYPE]: TestingType ; // TODO add this later, now only thumbnail
}

const defaultValues = {
  [FormNames.VIDEO_ID]: "",
  [FormNames.DURATION_TYPE]: null,
  [FormNames.DURATION]: null, // in days
  // [FormNames.TYPE]: null,
};

const CODE_REGEX = new RegExp("(?<=code=)(.*)(?=&scope)");

const CreateTest = ({}: Props) => {
  const [selectedUpload, setSelectedUpload] = useState<MyUpload>();
  const [uploads, setUploads] = useState<MyUpload[] | null>(null);
  const params = useParams();
  const [fileUploads, setFileUploads] = useState<UploadedFile[]>([]);

  const { channel, setChannel } = useContext(ChannelContext);
  const channelId = channel.channelId;
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  console.log("errors", errors);
  const durationTypeWatch = watch(FormNames.DURATION_TYPE);
  const videoIdWatch = watch(FormNames.VIDEO_ID);
  console.log("durationTypeWatch", durationTypeWatch);

  const handleList = async () => {
    if (!channelId) return;
    console.log("list starts");
    const result = await getVidList(channelId);
    console.log("result", result);
    const myUploads = result.data as MyUpload[];
    setUploads(myUploads);
    console.log("list ends");
  };

  const handleUpload = async () => {
    updateThumbnail({
      videoId: selectedUpload?.videoId,
      thumbUrl: fileUploads[0].url,
      channelId,
    });
  };

  const onSubmit = async (input: FormValues) => {
    console.log("input", input);
    try {
      console.log("......");
      const result = await createTesting(channelId, input);
      if (result) console.log(".......success!!!");
      else console.log("......cannot create ");
    } catch (error) {
      console.log("error inside  catch", error);
      console.log("......error creating");
    }
  };
  const handleStats = async () => {
    const videoIds = uploads?.map((upload) => upload.videoId);
    getStats({ channelId, videoIds });
  };

  const handleSelectUpload = (id: string) => {
    console.log("click", id);
    if (!uploads) return;
    const upload = uploads.find(({ videoId }) => videoId === id) as MyUpload;
    console.log("match", upload);
    setSelectedUpload(upload);
    console.log("settttt");
  };

  useEffect(() => {
    if (channelId) handleList();
  }, [channelId]);

  // clear duration to 0 if durationType = stats_significant
  useEffect(() => {
    if (durationTypeWatch === "stats_significant") setValue("duration", 0);
  });
  useEffect(() => {
    console.log("111111111");
    const codes = location.search.match(CODE_REGEX);
    const code = codes?.[0];
    console.log("code", code);

    const ano = async () => {
      console.log("create and save token");
      if (!code) return;
      const result = await createAndSaveTokensCall(code);

      console.log("resultttttt", result);

      const { channelId } = result.data as { channelId: string };

      localStorage.setItem("channelId", channelId);
      const channel = { channelId };
      setChannel(channel);

      console.log("result", result);
    };

    ano();
  }, [location]);
  return (
    <Layout>
      {/* <Navbar /> */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* <AuthDisplay /> */}
        <PageHeading heading="Create an AB testing" />
        <div className="flex gap-2">
          <SubHeading
            heading="1. Select the video"
            extraClass="text-left text-xl mb-4 font-bold"
          />
          <span className="align-sub text-xl text-red-500">*</span>
        </div>

        <div>
          -----------------------------------------------------------------
        </div>
        <div className="grid grid-cols-5 gap-2">
          {uploads?.map((upload, index) => {
            const selectedClass =
              selectedUpload?.videoId === upload.videoId ? "bg-primary-50" : "";
            if (selectedUpload?.videoId === upload.videoId) {
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
        <div className="flex gap-2">
          <SubHeading
            heading="2. Select duration"
            extraClass="text-left text-xl mb-4 font-bold"
          />
          <span className="align-sub text-xl text-red-500">*</span>
        </div>
        {/* Select duration */}
        <RadioField
          {...register(FormNames.DURATION_TYPE, {
            required: {
              value: true,
              message: "is required",
            },
          })}
          error={errors[FormNames.DURATION_TYPE] as FieldError | undefined}
          options={durationTypeOptions}
          labelClass="mt-4"
        />
        {durationTypeWatch === "specific" && (
          <TextField
            required // no need to check whether specific since it's not mounted anyway
            name={FormNames.DURATION}
            control={control as unknown as Control}
            containerClass="w-full sm:w-80"
            placeholder="15"
            inputType={InputType.Number}
            type={TextFieldTypes.OUTLINED}
            extraClass="w-full"
            labelClass="mt-4"
            error={errors[FormNames.DURATION]}
            validation={{
              min: {
                value: 1,
                message: "cannot be 0",
              },
              max: {
                value: 100,
                message: "has to be less than 101",
              },
            }}
          />
        )}
        {/* Select a thumbnail */}
        <div className="flex gap-2">
          <SubHeading
            heading="3. Upload a thumbnail"
            extraClass="text-left text-xl mb-4 font-bold"
          />
          <span className="align-sub text-xl text-red-500">*</span>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <img
            src={selectedUpload?.thumbnailUrl}
            className="w-3/4 rounded-xl col-span-12 md:col-span-6"
          />
          <div className="col-span-12 md:col-span-6">
            <DropzoneField
              ariaLabel="Image"
              inputClass="w-3/4 h-60 mt-10"
              fileUploads={fileUploads}
              setFileUploads={setFileUploads}
              showConfirmationOnDelete={false}
              maxFiles={1}
            >
              Drop images here
            </DropzoneField>
          </div>
        </div>
        {/* <Button label="Get list" onClick={handleList} fontColor="text-grey-0" /> */}
        <Button label="Upload" onClick={handleUpload} fontColor="text-grey-0" />
        <Button
          label="Create a test"
          fontColor="text-grey-0"
          buttonType={HTMLButtonType.SUBMIT}
        />
        <Button
          label="Get stats"
          onClick={handleStats}
          fontColor="text-grey-0"
        />
      </form>
    </Layout>
  );
};
export default CreateTest;
