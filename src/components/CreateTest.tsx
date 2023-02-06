import { zodResolver } from "@hookform/resolvers/zod";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

import { ChannelContext } from "../contexts/ChannelContext";
import { getVidList } from "../firebase/client";
import { createTesting } from "../firebase/createTesting";
import { urlResolver } from "../lib/UrlResolver";
import { debounce } from "../utils/debounce";
import CreateTestEditor from "./CreateTestEditor";
import { UploadedFile } from "./DropzoneField";

interface Props {}

export interface MyUpload {
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

const SharedSchema = z.object({
  videoId: z.string().min(1, { message: "Please select a video" }),
  duration: z.number(),
  durationType: z.literal("specific"),
  ori: z.string(),
});
const CreateThumbTestSchema = SharedSchema.extend({
  type: z.literal("thumb"),
});

const CreateTitleTestSchema = SharedSchema.extend({
  variationTitles: TitleSchema,
  type: z.literal("title"),
});

// const CreateThumbTestSpecificSchema = SharedSchema.extend({
//   originalThumb: z.string(),
//   durationType: z.literal("specific"),
//   type: z.literal("thumb"),
// });

export const FormSchema = z.discriminatedUnion("type", [
  CreateThumbTestSchema,
  CreateTitleTestSchema,
]);

type CreateThumbTestFormValues = z.infer<typeof CreateThumbTestSchema>;
type CreateTitleTestFormValues = z.infer<typeof CreateTitleTestSchema>;

export type FormValues = z.infer<typeof FormSchema>;

export type CreateTitleTestInput = FormValues;

enum FormNames {
  VIDEO_ID = "videoId",
  DURATION_TYPE = "durationType",
  DURATION = "duration",
  VARI_TITLE = "variationTitles",
  ORI = "ori", // could be thumb url or title
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
  [FormNames.ORI]: "original title or thumbnail url",
  [FormNames.TYPE]: "title",
};

const CreateTest = ({}: Props) => {
  // const [selectedUpload, setSelectedUpload] = useState<MyUpload>();
  const [uploads, setUploads] = useState<MyUpload[]>([]);
  const [fileUploads, setFileUploads] = useState<UploadedFile[]>([]);
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

  const useFormData = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(FormSchema),
    shouldUnregister: true, // TODO uncomment
  });

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

  const handleList = async () => {
    const result = await getVidList(channelId);
    const myUploads = result;
    setUploads(myUploads);
    setFilteredUploads(myUploads);
  };

  const selectedVideo = uploads?.find(
    (upload) => upload.videoId === useFormData.watch("videoId")
  );

  useEffect(() => {
    if (channelId) handleList();
  }, [channelId]);

  useEffect(() => {
    if (!selectedVideo) return;
    useFormData.setValue(FormNames.ORI, selectedVideo?.title);
  }, [selectedVideo]);

  useEffect(() => {
    useFormData.setValue(FormNames.TYPE, "title");
  }, []);

  return (
    <div>
      {/* <Navbar /> */}
      <CreateTestEditor
        uploads={uploads}
        setUploads={setUploads}
        useFormData={useFormData}
        handleSearch={handleSearch}
        filteredUploads={filteredUploads}
        onSubmit={onSubmit}
        selectedVideo={selectedVideo}
        fileUploads={fileUploads}
        setFileUploads={setFileUploads}
      />
    </div>
  );
};
export default CreateTest;
