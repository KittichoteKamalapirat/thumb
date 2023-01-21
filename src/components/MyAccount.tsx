import React, { useContext } from "react";
import { ChannelContext, emptyChannel } from "../contexts/ChannelContext";
import { googleLogout } from "../firebase/client";
import Button from "./Buttons/Button";
import Layout from "./layouts/Layout";

interface Props {}

const MyAccount = ({}: Props) => {
  const { channel, setChannel } = useContext(ChannelContext);

  const handleCreateURL = async () => {
    const result = await getAuthURLCall();
    const url = result.data as string;
    window.location.replace(url);
  };

  const handleLogout = async () => {
    const result = await googleLogout(channel.channelId);
    localStorage.clear();
    setChannel(emptyChannel);
  };

  return (
    <Layout>
      <Button label="logout" onClick={handleLogout} />
      {channel.channelId ? (
        <Button
          label={channel.channelId.slice(0, 4)}
          onClick={handleCreateURL}
          type={ButtonTypes.TEXT}
          fontColor="text-grey-500"
        />
      ) : (
        <Button
          label="Sign in 2"
          onClick={handleCreateURL}
          type={ButtonTypes.TEXT}
          fontColor="text-grey-500"
        />
      )}{" "}
    </Layout>
  );
};
export default MyAccount;
