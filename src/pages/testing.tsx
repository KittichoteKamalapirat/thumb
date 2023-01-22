import { doc, onSnapshot } from "firebase/firestore";
import { testing } from "googleapis/build/src/apis/testing";
import React, { useContext, useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import Button, { ButtonTypes } from "../components/Buttons/Button";
import LabelAndData from "../components/LabelAndData";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";
import { ChannelContext } from "../contexts/ChannelContext";
import { firestore } from "../firebase/client";
import {
  Testing,
  ThumbnailTesting,
  TitleTesting,
} from "../firebase/types/Testing.type";
import { primaryColor } from "../theme";

interface Props {}

const MyTesting = ({}: Props) => {
  const { id } = useParams();
  const { channel, setChannel } = useContext(ChannelContext);

  const [testing, setTesting] = useState<ThumbnailTesting | null>(null);

  const params = useParams();

  useEffect(() => {
    console.log("id", id);
    console.log("channelId", channel);
    if (!id || !channel.channelId) return;

    const docRef = doc(
      firestore,
      "channels",
      channel.channelId,
      "testings",
      id as string
    );

    const unsubscribe = onSnapshot(docRef, (snap) => {
      // const data = snap.docs.map(doc => doc.data())
      // this.setData(data)
      console.log("snap", snap);
      console.log("snap data", snap.data());
      const testing = snap.data() as ThumbnailTesting;
      setTesting(testing);
    });

    //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, [id, channel.channelId]);

  if (!testing) return <div>no testing</div>;

  return (
    <Layout>
      <div className="flex justify-between">
        <PageHeading heading="AB Test Status" />
      </div>

      <div className="flex gap-1">
        <HiOutlineExternalLink color={primaryColor} />
        <a href={`https://www.youtube.com/watch?v=${testing.videoId}`}>
          Watch on Youtube
        </a>
      </div>

      <LabelAndData label="Duration" data={String(testing?.duration)} />
      <LabelAndData
        label="Duration Type"
        data={String(testing?.durationType)}
      />
      <LabelAndData label="Status" data={String(testing?.status)} />
      <LabelAndData label="Start Date" data={String(testing?.startDate)} />

      {testing.type === "thumbnail" && (
        <div className="grid grid-cols-2 gap-2">
          <img src={testing.originalThumbUrl} className="w-full col-span-1" />
          <img src={testing.variationThumbUrl} className="w-full  col-span-1" />
        </div>
      )}

      <div>
        <PageHeading heading="Result here" />
      </div>
    </Layout>
  );
};
export default MyTesting;
