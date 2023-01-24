import { zodResolver } from "@hookform/resolvers/zod";
import { string, z } from "zod";
import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { Control, FieldError, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button, { HTMLButtonType } from "../components/Buttons/Button";
import DropzoneField, { UploadedFile } from "../components/DropzoneField";
import CardRadioField from "../components/forms/RadioField/CardRadioField";

import TextField, { TextFieldTypes } from "../components/forms/TextField";
import { InputType } from "../components/forms/TextField/inputType";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";
import SubHeading from "../components/typography/SubHeading";
import { ChannelContext } from "../contexts/ChannelContext";
import {
  createAndSaveTokensCall,
  getVidList,
  updateThumbnail,
} from "../firebase/client";
import {
  createTesting,
  CreateThumbnailTestingInput,
} from "../firebase/createTesting";
import { DurationType } from "../firebase/types/Testing.type";
import { urlResolver } from "../lib/UrlResolver";
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

const StatsSignificantSchema = z.object({
  videoId: z.string(),
  durationType: z.literal("stats_significant"),
});

const CertainDaysSchema = z.object({
  videoId: z.string(),
  durationType: z.literal("specific"),
  duration: z.number(),
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

export type FormValues = z.infer<typeof FormSchema>;

enum FormNames {
  VIDEO_ID = "videoId",
  DURATION_TYPE = "durationType",
  DURATION = "duration",
  // TYPE = "type",
}

// export interface FormValues {
//   [FormNames.VIDEO_ID]: string;
//   [FormNames.DURATION_TYPE]: DurationType;
//   [FormNames.DURATION]: number; // in days
//   // [FormNames.TYPE]: TestingType ; // TODO add this later, now only thumbnail
// }

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
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    shouldUnregister: true,
  });

  console.log("errors", errors);
  const durationTypeWatch = watch(FormNames.DURATION_TYPE);
  const videoIdWatch = watch(FormNames.VIDEO_ID);
  const durationWatch = watch(FormNames.VIDEO_ID);
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

  const navigate = useNavigate();
  const handleUpload = async () => {
    updateThumbnail({
      videoId: selectedUpload?.videoId,
      thumbUrl: fileUploads[0].url,
      channelId,
    });
  };

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
    const originalThumbUrl = uploads?.find(
      (upload) => upload.videoId === input[FormNames.VIDEO_ID]
    )?.thumbnailUrl as string;

    const dbInput = {
      originalThumbUrl, // todo what if testing title
      variationThumbUrl: fileUploads[0].url,
      ...input,
    };

    try {
      console.log("......");
      const docId = await createTesting(channelId, dbInput);
      if (docId) {
        console.log(".......success!!!", docId);
        navigate(urlResolver.myTest(docId));
      } else console.log("......cannot create ");
    } catch (error) {
      console.log("error inside  catch", error);
      console.log("......error creating");
    }
  };

  const handleSelectUpload = (id: string) => {
    console.log("click", id);
    if (!uploads) return;
    const upload = uploads.find(({ videoId }) => videoId === id) as MyUpload;
    console.log("match", upload);
    setSelectedUpload(upload);
    console.log("settttt");
  };

  // console.log("xx", watch());
  const isSubmittable =
    videoIdWatch &&
    fileUploads[0] &&
    (durationTypeWatch === "stats_significant" ||
      (durationTypeWatch === "specific" && durationWatch));

  // useEffect(() => {
  //   if (channelId) handleList();
  // }, [channelId]);

  useEffect(() => {
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
            {uploads?.map((upload, index) => {
              const selectedClass =
                selectedUpload?.videoId === upload.videoId
                  ? "bg-primary-50"
                  : "";
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
        </div>

        {/* section 2 */}
        <div data-section="2" className="mt-4">
          {/* select duration label */}
          <div className="flex gap-2">
            <SubHeading
              heading="2. Select duration"
              extraClass="text-left text-xl mb-4 font-bold"
            />
            <span className="align-sub text-xl text-red-500">*</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CardRadioField
              {...register(FormNames.DURATION_TYPE, {
                required: {
                  value: true,
                  message: "is required",
                },
              })}
              watchedValue={durationTypeWatch}
              labelClass="mt-4.5 mb-2"
              value="stats_significant"
              error={errors[FormNames.DURATION_TYPE] as FieldError}
            >
              <div className="flex item-start gap-2">
                <div>
                  <p className="font-bold">
                    Run until Click Through Rate (CTR) is "Statistically
                    Significant
                  </p>
                  <p className="mt-4">
                    Statistical significance is a way to know if something
                    happened because of a good reason or just by chance, like
                    flipping a coin and getting heads or tails.
                  </p>
                </div>
              </div>
            </CardRadioField>

            <CardRadioField
              {...register(FormNames.DURATION_TYPE)}
              watchedValue={durationTypeWatch}
              labelClass="mt-4.5 mb-2"
              value="specific"
              error={errors[FormNames.DURATION_TYPE] as FieldError}
            >
              <div className="flex item-start gap-2">
                <div>
                  <p className="font-bold">A set number of days</p>

                  {/* Select duration ends */}

                  {durationTypeWatch === "specific" && (
                    <TextField
                      name={FormNames.DURATION}
                      control={control as unknown as Control}
                      containerClass="w-full sm:w-80"
                      placeholder="15"
                      inputType={InputType.Number}
                      type={TextFieldTypes.OUTLINED}
                      extraClass="w-full"
                      labelClass="mt-4"
                      error={errors[FormNames.DURATION as keyof typeof errors]}
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
                  )}
                  <p className="mt-4">
                    Test will complete on Tuesday, November 30, 2021
                  </p>

                  <p className="mt-4">
                    Final results will be available on Thursday, December 2,
                    2021 because Youtube Analytics are deolayed 48 hours
                  </p>
                </div>
              </div>
            </CardRadioField>
          </div>
        </div>

        {JSON.stringify(watch(), null, 2)}
        {/* section 3 Select a thumbnail */}
        <div data-section="3" className="mt-4">
          <div className="flex gap-2">
            <SubHeading
              heading="3. Upload a thumbnail"
              extraClass="text-left text-xl mb-4 font-bold"
            />
            <span className="align-sub text-xl text-red-500">*</span>
          </div>

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-6 xl:col-span-4">
              <p className="font-bold text-primary mb-2">Original Thumbnail</p>
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
                "col-span-12 md:col-span-6 xl:col-span-4",
                fileUploads.length === 0 &&
                  "border-dashed border-[2px] rounded-xl border-primary-500 cursor-pointer p-4"
              )}
            >
              <DropzoneField
                ariaLabel="Image"
                fileUploads={fileUploads}
                setFileUploads={setFileUploads}
                showConfirmationOnDelete={false}
                maxFiles={1}
              />
            </div>
          </div>
        </div>

        {/* <Button label="Get list" onClick={handleList} fontColor="text-grey-0" /> */}
        {/* <Button label="Upload" onClick={handleUpload} fontColor="text-grey-0" /> */}
        <div className="flex justify-end mt-10">
          <Button
            label="Create a test"
            fontColor="text-grey-0"
            buttonType={HTMLButtonType.SUBMIT}
            disabled={!isSubmittable}
          />
        </div>

        {/* <Button
          label="Get stats"
          onClick={handleStats}
          fontColor="text-grey-0"
        /> */}
      </form>
    </Layout>
  );
};
export default CreateTest;
