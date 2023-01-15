import classNames from "classnames";
import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Button from "../components/Buttons/Button";
import DropzoneField, { UploadedFile } from "../components/DropzoneField";
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

const CODE_REGEX = new RegExp("(?<=code=)(.*)(?=&scope)");

const CreateTest = ({}: Props) => {
  const [selectedUpload, setSelectedUpload] = useState<MyUpload | null>(null);
  const [uploads, setUploads] = useState<MyUpload[] | null>(null);
  const params = useParams();
  const [fileUploads, setFileUploads] = useState<UploadedFile[]>([]);

  const { channel, setChannel } = useContext(ChannelContext);
  const channelId = channel.channelId;
  const location = useLocation();

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

  const handleStats = async () => {
    const videoIds = uploads?.map((upload) => upload.videoId);
    getStats({ channelId, videoIds });
  };

  console.log("selected upload", selectedUpload);
  console.log("uploads", uploads);

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
      {/* <AuthDisplay /> */}

      <PageHeading heading="Create an AB testing" />

      <SubHeading
        heading="1. Select the video"
        extraClass="text-left text-xl mb-4 font-bold"
      />

      <div className="grid grid-cols-5 gap-2">
        {uploads?.map((upload, index) => {
          const selectedClass =
            selectedUpload?.videoId === upload.videoId ? "bg-primary-50" : "";
          if (selectedUpload?.videoId === upload.videoId) {
            console.log("upload id", upload.videoId);
            console.log("selected id", selectedUpload?.videoId);
            console.log("selected class", selectedClass);
          }

          return (
            <div
              key={index}
              className={classNames(
                "col-span-1 hover:cursor-pointer",
                selectedClass
              )}
              onClick={() => handleSelectUpload(upload.videoId)}
            >
              <img src={upload.thumbnailUrl} className="w-full rounded-xl" />
              <p className="text-lg mt-2">{upload.title.slice(0, 80)}</p>
              <p>{upload.videoId}</p>
            </div>
          );
        })}
      </div>

      <SubHeading
        heading="2. Select duration"
        extraClass="text-left text-xl mb-4 font-bold"
      />

      <SubHeading
        heading="3. Upload a thumbnail"
        extraClass="text-left text-xl mb-4 font-bold"
      />

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
      <Button label="Create a test" fontColor="text-grey-0" />
      <Button label="Get stats" onClick={handleStats} fontColor="text-grey-0" />
    </Layout>
  );
};
export default CreateTest;
