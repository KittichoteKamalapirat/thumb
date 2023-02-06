import { createContext, Dispatch } from "react";

export interface Channel {
  channelId: string;
  isPremium: boolean;
}
export interface ChannelContext {
  channel: Channel;
  setChannel: Dispatch<React.SetStateAction<Channel>>;
}

export const emptyChannel: Channel = {
  channelId: "",
  isPremium: false,
};

const initialValue = {
  channel: emptyChannel,
  setChannel: null as any,
};
export const ChannelContext = createContext<ChannelContext>(initialValue);
