import dayjs from "dayjs";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";

import { useContext, useState } from "react";
import Button from "../components/Buttons/Button";
import DropzoneField, { UploadedFile } from "../components/DropzoneField";
import { YOUTUBE_DATA_API_DATE_FORMAT } from "../constants";
import { ChannelContext } from "../contexts/ChannelContext";
import { firestore, updateThumbnail } from "../firebase/client";

interface Props {}

// a mock page to update thumbnail for a video
const UploadThumbnail = ({}: Props) => {
  const [videoId, setVideoId] = useState("");
  const [testId, setTestId] = useState("");
  const [fileUploads, setFileUploads] = useState<UploadedFile[]>([]);
  const { channel } = useContext(ChannelContext);

  const { channelId } = channel;

  const handleUpload = async () => {
    // upload a thumbnail
    // when upload a thumbnail => also update history in testing
    try {
      console.log("1");
      const result = await updateThumbnail({
        videoId,
        thumbUrl: fileUploads[0].url,
        channelId,
      });
      console.log("2");
      // successfully uploaded to youtube
      if (result.data) {
        console.log("3");
        // push to history
        const newHistory = {
          date: dayjs(Date.now()).format(YOUTUBE_DATA_API_DATE_FORMAT),
          url: fileUploads[0].url,
        };
        const docRef = doc(
          firestore,
          "channels",
          channelId,
          "testings",
          testId
        );

        console.log("4");
        await updateDoc(docRef, {
          history: arrayUnion(newHistory),
        });
        console.log("5");
      }
    } catch (error) {
      console.log("error in handleUpload thumbnail");
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 mt-10">
      <div>ChannelId: {channelId}</div>

      <input
        type="text"
        value={testId}
        onChange={(e) => setTestId(e.target.value)}
        placeholder="Test id"
      />

      <input
        type="text"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="Insert a video id"
      />

      <DropzoneField
        ariaLabel="Image"
        fileUploads={fileUploads}
        setFileUploads={setFileUploads}
        showConfirmationOnDelete={false}
        maxFiles={1}
      />

      <Button label="Upload" onClick={handleUpload} fontColor="text-grey-500" />
    </div>
  );
};
export default UploadThumbnail;
