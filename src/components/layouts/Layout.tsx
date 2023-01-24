import { ReactNode, useContext } from "react";
import { ChannelContext } from "../../contexts/ChannelContext";
import Container from "../containers/Container";
import { Footer } from "../Footer";
import LoggedInNav from "../navbars/LoggedInNav";
import LoggedOutNav from "../navbars/LoggedOutNav";
import Navbar from "../navbars/Navbar2";

interface Props {
  children: ReactNode;
  justifyContent?:
    | "justify-start"
    | "justify-end"
    | "justify-center"
    | "justify-between"
    | "justify-around"
    | "justify-evenly";
  alignItems?:
    | ""
    | "items-start"
    | "items-end"
    | "items-center"
    | "items-baseline"
    | "items-stretch";
  extraStyle?: string;
}
const Layout = ({
  children,
  justifyContent = "justify-center",
  alignItems = "",
  extraStyle = "",
}: Props) => {
  const { channel } = useContext(ChannelContext);
  const { channelId } = channel;
  return (
    <div>
      {channelId ? <LoggedInNav /> : <LoggedOutNav />}
      <div className="bg-grey-0 text-grey-900 h-min-screen ">
        <main
          className={`flex-1 h-full w-full ${justifyContent} ${alignItems} ${extraStyle} `}
        >
          <Container>{children}</Container>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
