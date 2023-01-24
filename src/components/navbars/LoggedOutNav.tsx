import { AiFillHome } from "react-icons/ai";
import { useLocation } from "react-router-dom";
import { urlResolver } from "../../lib/UrlResolver";
import classNames from "classnames";
import { brandName, ICON_SIZE } from "../../constants";
import { getAuthURLCall } from "../../firebase/client";
import { primaryColor } from "../../theme";
import Button, { ButtonTypes } from "../Buttons/Button";
import NavItem from "./NavItem";
import { useCreateAndSaveToken } from "../../hooks/useCreateAndSaveToken";

enum PATH_ENUM {
  HOME = "/",
}
const LoggedOutNav = () => {
  useCreateAndSaveToken();
  const { pathname } = useLocation();

  const handleCreateURL = async () => {
    const result = await getAuthURLCall();
    const url = result.data as string;
    window.location.replace(url);
  };

  return (
    <nav className="flex flex-col xl:flex-row z-100 bg-grey-0 container px-2 xl:px-10 py-2 justify-between items-center mx-auto top-0">
      <a href={urlResolver.index()} className="mt-4 flex items-center">
        <img src="/logo.svg" className="mr-3 h-8" alt={`${brandName} logo`} />
      </a>

      <div className="w-full xl:w-auto" id="navbar-default">
        <ul className="flex justify-between items-center p-4 mt-4 rounded-lg border-gray-100 xl:flex-row xl:space-x-8 xl:mt-0 xl:font-medium xl:border-0 xl:bg-white text-grey-400">
          <NavItem
            currentPath={pathname}
            to={PATH_ENUM.HOME}
            icon={<AiFillHome size={ICON_SIZE} color={primaryColor} />}
            label="Home"
          />

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
              <Button
                label="Sign in with Google"
                onClick={handleCreateURL}
                type={ButtonTypes.OUTLINED}
                fontColor="text-grey-500"
              />
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default LoggedOutNav;
