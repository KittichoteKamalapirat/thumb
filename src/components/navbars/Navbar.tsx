import { Suspense, useContext } from "react";
import { brandName } from "../constants";
import { ChannelContext } from "../contexts/ChannelContext";

import AuthDisplay from "./AuthDisplay";

import { ButtonTypes } from "./Buttons/Button";
import LinkButton from "./Buttons/LinkButton";
import { Loading } from "./skeletons/Loading";

interface Props {}

const Navbar = ({}: Props) => {
  const { channel } = useContext(ChannelContext);

  return (
    <div className="flex justify-center py-2 px-10 w-full top-0 fixed bg-primary-primary text-grey-0 z-50">
      <div className="flex justify-between items-center md:max-w-7xl w-full ">
        <div className="flex">
          {/* <div className="mr-4">logo image</div> */}
          <a className="text-xl" href="/">
            <div className="flex gap-2 items-center">
              <img src="/logo/white-logo.png" alt="Logo" className="w-8 h-8" />
              <div>{brandName}</div>
            </div>
          </a>
        </div>
        <div>
          <ul className="flex gap-4">
            {/* <Link>Contact</Link> */}
            {!channel ? (
              <LinkButton
                href="/pricing"
                type={ButtonTypes.TEXT}
                extraClass="text-grey-0"
                label="Pricing"
              />
            ) : null}

            <Suspense fallback={<Loading />}>
              <AuthDisplay />
            </Suspense>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
