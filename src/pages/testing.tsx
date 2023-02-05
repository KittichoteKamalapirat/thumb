import dayjs from "dayjs";
import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { HiOutlineExternalLink } from "react-icons/hi";
import { useParams } from "react-router-dom";
import LabelAndData from "../components/LabelAndData";
import Layout from "../components/layouts/Layout";
import PageHeading from "../components/typography/PageHeading";
import { ChannelContext } from "../contexts/ChannelContext";
import { firestore, getStatsOneVid } from "../firebase/client";
import { Testing } from "../firebase/types/Testing.type";

import { primaryColor } from "../theme";
import { StatsResponse } from "../types/StatsResponse";

interface Props {}

export interface ResultForEachThumbnail {
  views: number;
  annotationClickThroughRate: number;
  annotationCloseRate: number;
  annotationClickableImpressions: number;
  averageViewDuration: number;
  comments: number;
  dislikes: number;
  estimatedMinutesWatched: number;
  likes: number;
  shares: number;
  subscribersGained: number;
  subscribersLost: number;
}

const blank = {
  views: 0,
  annotationClickThroughRate: 0,
  annotationCloseRate: 0,
  annotationClickableImpressions: 0,
  averageViewDuration: 0,
  comments: 0,
  dislikes: 0,
  estimatedMinutesWatched: 0,
  likes: 0,
  shares: 0,
  subscribersGained: 0,
  subscribersLost: 0,
};

export interface SummaryItem {
  subject: string;
  videoId: string;
  // metrics
  views: number;
  annotationClickThroughRate: number;
  annotationCloseRate: number;
  annotationClickableImpressions: number;
  averageViewDuration: number;

  comments: number;
  dislikes: number;
  estimatedMinutesWatched: number;
  likes: number;
  shares: number;

  subscribersGained: number;
  subscribersLost: number;
}

const MyTesting = ({}: Props) => {
  const { id } = useParams();
  const { channel, setChannel } = useContext(ChannelContext);
  const channelId = channel.channelId;

  const [summary, setSummary] = useState<SummaryItem[]>([]);

  const [result, setResult] = useState<StatsResponse>();
  const [testing, setTesting] = useState<Testing | null>(null);

  const params = useParams();

  useEffect(() => {
    console.log("id", id);
    console.log("channelId", channel);
    if (!id || !channel.channelId) return;

    const docRef = doc(
      firestore,
      "channels",
      channelId,
      "testings",
      id as string
    );

    const unsubscribe = onSnapshot(docRef, (snap) => {
      // const data = snap.docs.map(doc => doc.data())
      // this.setData(data)
      console.log("snap", snap);
      console.log("snap data", snap.data());
      const testing = snap.data() as Testing;
      setTesting(testing);
    });

    //remember to unsubscribe from your realtime listener on unmount or you will create a memory leak
    return () => unsubscribe();
  }, [id, channel.channelId]);

  // useEffect(() => {
  //   if (!testing?.videoId || !channelId) return;
  //   const handleStats = async () => {
  //     const result = (await getStatsOneVid({
  //       channelId,
  //       // videoId: testing?.videoId,
  //       testingId: testing.id,
  //       date: "2023-01-15",
  //     })) as { data: StatsResponse };
  //     console.log("resultttttt", result);
  //     setResult(result.data);
  //   };

  //   handleStats();
  // }, [testing?.videoId, channelId]);

  useEffect(() => {
    const handleSummary = async () => {
      console.log("channel id", channelId);
      console.log("testing?.videoId", testing?.videoId);

      if (!testing || !channelId) return;
      const summary = await getStatsOneVid(testing);
      console.log("resulttt", result);

      if (!summary) return; // TODO
      setSummary(summary);
    };
    console.log("handle summary 1 ");

    handleSummary();
    console.log("handle summary 2 ");
  }, [testing, channelId]);
  if (!testing) return <div>no testing</div>;

  return (
    <Layout>
      <div className="flex justify-between">
        <PageHeading heading="AB Test Status" />
      </div>

      <h1>vid id: {testing.videoId}</h1>
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
      <LabelAndData
        label="Start Date"
        data={dayjs(testing?.startDate).format("MMMM D, YYYY")}
      />

      {testing.type === "thumb" && (
        <div className="grid grid-cols-2 gap-2">
          <img src={testing.ori} className="w-full col-span-1" />
          {testing.varis.map((vari) => (
            <img src={vari.value} className="w-full  col-span-1" />
          ))}
        </div>
      )}

      <div>
        <PageHeading heading="Result here" />
        <div data-node="result">
          <LabelAndData
            label="Click Through Rate (CTR):"
            data={String(result?.annotationClickThroughRate)}
          />
          <LabelAndData
            label="Average View Duration (AVD):"
            data={String(result?.averageViewDuration)}
          />

          <LabelAndData label="Views:" data={String(result?.views)} />

          <LabelAndData
            label="Impression:"
            data={String(result?.annotationClickableImpressions)}
          />

          <LabelAndData
            label="Subscribers Gained:"
            data={String(result?.subscribersGained)}
          />
        </div>
      </div>

      <div data-note="table">
        <div className="grid grid-cols-6">
          <div className="col-span-1">ThumbUrl</div>
          <div className="col-span-1">CTR</div>
          <div className="col-span-1">AVD</div>
          <div className="col-span-1">Impression</div>

          <div className="col-span-1">New Subs</div>
          <div className="col-span-1">Views</div>
        </div>

        {summary.map((thumbResult) => (
          <div data-note="row" className="grid grid-cols-6">
            <div className="col-span-1"> {thumbResult.subject}</div>
            <div className="col-span-1">
              {thumbResult.annotationClickThroughRate}
            </div>

            <div className="col-span-1">{thumbResult.averageViewDuration}</div>
            <div className="col-span-1">
              {thumbResult.annotationClickableImpressions}
            </div>
            <div className="col-span-1">{thumbResult.subscribersGained}</div>
            <div className="col-span-1">{thumbResult.views}</div>
          </div>
        ))}
      </div>
    </Layout>
  );
};
export default MyTesting;
