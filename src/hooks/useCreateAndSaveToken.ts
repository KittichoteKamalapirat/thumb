import { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ChannelContext } from "../contexts/ChannelContext";
import { createAndSaveTokens } from "../firebase/client";

const GOOGLE_AUTH_CODE_REGEX = new RegExp("(?<=code=)(.*)(?=&scope)");

export const useCreateAndSaveToken = () => {
  const { setChannel } = useContext(ChannelContext);

  const location = useLocation();

  useEffect(() => {
    const codes = location.search.match(GOOGLE_AUTH_CODE_REGEX);
    const code = codes?.[0];

    const createAndSaveTokenAsync = async () => {
      if (!code) return;
      const result = await createAndSaveTokens(code);

      const { channelId } = result;

      localStorage.setItem("channelId", channelId);
      const channel = { channelId };
      setChannel(channel);
    };

    createAndSaveTokenAsync();
  }, [location]);
};
