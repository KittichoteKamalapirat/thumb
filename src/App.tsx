import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Channel,
  ChannelContext,
  emptyChannel,
} from "./contexts/ChannelContext";
import Home from "./pages/home";

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
            <Route index path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </ChannelContext.Provider>
    </div>
  );
}

export default App;
