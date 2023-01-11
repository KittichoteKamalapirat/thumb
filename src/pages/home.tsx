import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Button from "../components/Buttons/Button";
import DropzoneField, { UploadedFile } from "../components/DropzoneField";
import Layout from "../components/layouts/Layout";
import { ChannelContext } from "../contexts/ChannelContext";
import {
  createAndSaveTokensCall,
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

const CODE_REGEX = new RegExp("(?<=code=)(.*)(?=&scope)");

const Home = ({}: Props) => {
  const [selectedUpload, setSelectedUpload] = useState<MyUpload | null>(null);
  const [uploads, setUploads] = useState<MyUpload[] | null>(null);
  const params = useParams();
  const [fileUploads, setFileUploads] = useState<UploadedFile[]>([]);

  const { channel, setChannel } = useContext(ChannelContext);
  const location = useLocation();
  console.log("params 2", params);
  console.log("location", location);

  const handleList = async () => {
    const channelId = channel.channelId;
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
      videlId: selectedUpload?.videoId,
      thumbUrl: fileUploads[0].url,
    });
  };

  useEffect(() => {
    const codes = location.search.match(CODE_REGEX);
    const code = codes?.[0];
    console.log("code", code);

    const ano = async () => {
      console.log("create and save token");
      if (!code) return;
      const result = await createAndSaveTokensCall(code);

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
      <div className="text-lg text-grey-500">Home</div>

      <div className="grid grid-cols-5 gap-2">
        {uploads?.map((upload, index) => (
          <div key={index} className="col-span-1">
            <img src={upload.thumbnailUrl} className="w-full rounded-xl" />
            <p className="text-lg mt-2">{upload.title.slice(0, 80)}</p>
          </div>
        ))}
      </div>
      <DropzoneField
        ariaLabel="Image"
        inputClass="w-full h-60 mt-10"
        fileUploads={fileUploads}
        setFileUploads={setFileUploads}
        showConfirmationOnDelete={false}
        maxFiles={1}
      >
        Drop images here
      </DropzoneField>

      <div className="text-lg text-grey-500">Home</div>
      <div className="text-lg">Home 2</div>
      <Button label="Get list" onClick={handleList} fontColor="text-grey-0" />
      <Button label="Upload" onClick={handleUpload} fontColor="text-grey-0" />
    </Layout>
  );
};
export default Home;
