import dayjs from "dayjs";
import { collection, onSnapshot } from "firebase/firestore";
import { docs_v1 } from "googleapis";
import React, { useContext, useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Buttons/Button";
import LabelAndData from "../components/LabelAndData";
import Layout from "../components/layouts/Layout";
import { snapshotColumns } from "../components/SnapshotsTable/snapshotColumns";
import PageHeading from "../components/typography/PageHeading";
import { ChannelContext } from "../contexts/ChannelContext";
import { firestore } from "../firebase/client";
import { ThumbnailTesting } from "../firebase/types/Testing.type";
import { urlResolver } from "../lib/UrlResolver";
import { primaryColor } from "../theme";

interface Props {}

const Testings = ({}: Props) => {
  const { channel, setChannel } = useContext(ChannelContext);

  const [testings, setTestings] = useState<ThumbnailTesting[]>([]);

  useEffect(() => {
    console.log("1");
    if (!channel.channelId) return;
    console.log("2");

    const colRef = collection(
      firestore,
      "channels",
      channel.channelId,
      "testings"
    );

    const unsubscribe = onSnapshot(colRef, (snap) => {
      const testings = snap.docs.map((doc) => doc.data());
      console.log("testings", testings);
      setTestings(testings as ThumbnailTesting[]);
    });

    //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, [channel.channelId]);

  return (
    <Layout>
      <div className="flex justify-between">
        <PageHeading heading="Manage AB Tests" />

        <Button label="Create AB Tests" href="/create-test" />
      </div>
      {testings.map((testing) => (
        <div className="border p-4 rounded-md my-4">
          <div className="flex gap-1">
            <HiOutlineExternalLink color={primaryColor} />
            <a
              href={`https://www.youtube.com/watch?v=${testing.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch on Youtube
            </a>
          </div>

          <Link
            data-note="link"
            to={urlResolver.myTest(testing.id)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LabelAndData label="Duration" data={String(testing?.duration)} />
            <LabelAndData
              label="Duration Type"
              data={String(testing?.durationType)}
            />
            <LabelAndData label="Status" data={String(testing?.status)} />
            <LabelAndData
              label="Start Date"
              data={dayjs(testing?.startDate).format("MMMM D, YYYY")}
            />

            {testing.type === "thumbnail" && (
              <div className="grid grid-cols-2 gap-2">
                <img
                  src={testing.originalThumbUrl}
                  className="w-full col-span-1"
                />
                <img
                  src={testing.variationThumbUrl}
                  className="w-full  col-span-1"
                />
              </div>
            )}
          </Link>
        </div>
      ))}
    </Layout>
  );
};
export default Testings;
