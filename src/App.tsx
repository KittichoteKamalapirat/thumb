import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Channel,
  ChannelContext,
  emptyChannel,
} from "./contexts/ChannelContext";
import CreateTest from "./pages/create-test";
import Home from "./pages/create-test";
import Testing from "./pages/testing";
import Testings from "./pages/testings";

function App() {
  const [channel, setChannel] = useState<Channel>(emptyChannel);

  // populate data
  useEffect(() => {
    const channelId = localStorage.getItem("channelId");
    if (channelId) setChannel({ channelId });
  }, []);
  return (
    <div className="App">
      <ChannelContext.Provider value={{ channel, setChannel }}>
        <BrowserRouter>
          <Routes>
            <Route index path="/" element={<Testings />} />
            <Route index path="/create-test" element={<CreateTest />} />
            <Route index path="/" element={<Testing />} />
          </Routes>
        </BrowserRouter>
      </ChannelContext.Provider>
    </div>
  );
}

export default App;
