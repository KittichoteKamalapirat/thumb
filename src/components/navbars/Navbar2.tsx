import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";

import classNames from "classnames";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { urlResolver } from "../../lib/UrlResolver";

import { useContext } from "react";
import { brandName, ICON_SIZE } from "../../constants";
import { ChannelContext, emptyChannel } from "../../contexts/ChannelContext";
import { getAuthURLCall, googleLogout } from "../../firebase/client";
import { ACTIVE_PAGE_CLASSNAMES, primaryColor } from "../../theme";
import Button, { ButtonTypes } from "../Buttons/Button";

enum PATH_ENUM {
  ACTIVITIES = "/activities",
  CONTAINERS = "/containers",
  HOME = "/",
  // SNAPSHOTS = "/snapshots",
  SETTING = "/setting",
}
const Navbar = () => {
  const { pathname } = useLocation();
  const { channel, setChannel } = useContext(ChannelContext);

  const handleCreateURL = async () => {
    const result = await getAuthURLCall();
    const url = result.data as string;
    window.location.replace(url);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await googleLogout(channel.channelId);
    localStorage.clear();
    setChannel(emptyChannel);

    console.log("resultttt", result);
    // const logoutUrl = urlResolver.googleLogout("http://localhost:5173/");
    // window.location.replace(logoutUrl);
  };

  return (
    <nav className="flex flex-col xl:flex-row z-100 bg-grey-0 container px-2 xl:px-10 py-2 justify-between items-center mx-auto top-0">
      <a href={urlResolver.index()} className="mt-4 flex items-center">
        <img src="/logo.svg" className="mr-3 h-8" alt={`${brandName} logo`} />
        {/* <span className="self-center text-xl font-semibold whitespace-nowrap hover:underline">
          {brandName}
        </span> */}
      </a>

      <div className="w-full xl:w-auto" id="navbar-default">
        <ul className="flex justify-between items-center p-4 mt-4 rounded-lg border-gray-100 xl:flex-row xl:space-x-8 xl:mt-0 xl:font-medium xl:border-0 xl:bg-white text-grey-400">
          <li>
            <Link
              to={PATH_ENUM.HOME}
              className={classNames(
                "block py-2 pr-4 pl-3 hover:bg-primary-50 hover:cursor-pointer ",
                `${
                  pathname === PATH_ENUM.HOME
                    ? ACTIVE_PAGE_CLASSNAMES
                    : "rounded-md"
                }`
              )}
            >
              <div
                className={classNames(
                  "flex gap-1 items-center",
                  "flex-col xl:flex-row"
                )}
              >
                <AiFillHome size={ICON_SIZE} color={primaryColor} />
                <span>Home</span>
              </div>
            </Link>
          </li>

          <li>
            <Link
              to={PATH_ENUM.SETTING}
              className={classNames(
                "block py-2 pr-4 pl-3 hover:bg-primary-50 hover:cursor-pointer ",
                `${
                  pathname === PATH_ENUM.SETTING
                    ? ACTIVE_PAGE_CLASSNAMES
                    : "rounded-md"
                }`
              )}
            >
              <div
                className={classNames(
                  "flex gap-1 items-center",
                  "flex-col xl:flex-row"
                )}
              >
                <AiFillSetting size={ICON_SIZE} color={primaryColor} />
                <span>Setting</span>
              </div>
            </Link>
          </li>

          <li
            className={classNames(
              "block py-2 pr-4 pl-3 hover:bg-primary-50 hover:cursor-pointer rounded-md"
            )}
          >
            <div
              className={classNames(
                "flex gap-1 items-center",
                "flex-col xl:flex-row"
              )}
            >
              <FiLogOut size={ICON_SIZE} color={primaryColor} />

              <Button
                label="Logout"
                onClick={handleLogout}
                type={ButtonTypes.TEXT}
                fontColor="text-grey-500"
              />
            </div>
          </li>
          <li
            className={classNames(
              "block py-2 pr-4 pl-3 hover:bg-primary-50 hover:cursor-pointer rounded-md"
            )}
          >
            <div
              className={classNames(
                "flex gap-1 items-center",
                "flex-col xl:flex-row"
              )}
            >
              <FiLogOut size={ICON_SIZE} color={primaryColor} />
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
              )}
            </div>
          </li>
        </ul>

        {/* <AuthDisplay /> */}
      </div>
    </nav>
  );
};

export default Navbar;
