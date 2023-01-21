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
    const result = await googleLogout(channel.channelId);
    localStorage.clear();
    setChannel(emptyChannel);
  };

  return (
    <Layout>
      <LabelAndData data={channel.channelId.slice(0, 4)} label="Channel Id: " />

      <Button label="logout" onClick={handleLogout} />
    </Layout>
  );
};
export default MyAccount;
