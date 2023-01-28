import React, { useContext } from "react";
import Button from "../components/Buttons/Button";
import LabelAndData from "../components/LabelAndData";
import Layout from "../components/layouts/Layout";
import { ChannelContext, emptyChannel } from "../contexts/ChannelContext";
import { googleLogout } from "../firebase/client";

interface Props {}

const MyAccount = ({}: Props) => {
  const { channel, setChannel } = useContext(ChannelContext);

  const handleLogout = async () => {
    console.log("1");
    // const result = await googleLogout(channel.channelId);
    console.log("2");
    localStorage.clear();
    console.log("3");
    setChannel(emptyChannel);
    console.log("4");
  };

  return (
    <Layout>
      <LabelAndData data={channel.channelId.slice(0, 4)} label="Channel Id: " />

      {channel.channelId ? (
        <Button label="logout" onClick={handleLogout} />
      ) : null}
    </Layout>
  );
};
export default MyAccount;
