import { AiFillHome } from "react-icons/ai";
import { MdAccountCircle } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { urlResolver } from "../../lib/UrlResolver";
import { TbTestPipe } from "react-icons/tb";
import { brandName, ICON_SIZE } from "../../constants";
import { primaryColor } from "../../theme";
import NavItem from "./NavItem";

const PathObj = {
  HOME: urlResolver.home(),
  TESTS: urlResolver.myTests(),
  CREATE_TEST: urlResolver.createTest(),
  ACCOUNT: urlResolver.myAccount(),
};

const LoggedInNav = () => {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-col xl:flex-row z-100 bg-grey-0 container px-2 xl:px-10 py-2 justify-between items-center mx-auto top-0">
      <a href={urlResolver.index()} className="mt-4 flex items-center">
        <img src="/logo.svg" className="mr-3 h-8" alt={`${brandName} logo`} />
      </a>

      <div className="w-full xl:w-auto" id="navbar-default">
        <ul className="flex justify-between items-center p-4 mt-4 rounded-lg border-gray-100 xl:flex-row xl:space-x-8 xl:mt-0 xl:font-medium xl:border-0 xl:bg-white text-grey-400">
          <NavItem
            currentPath={pathname}
            to={PathObj.HOME}
            icon={<AiFillHome size={ICON_SIZE} color={primaryColor} />}
            label="Home"
          />

          <NavItem
            currentPath={pathname}
            to={PathObj.TESTS}
            icon={<TbTestPipe size={ICON_SIZE + 2} color={primaryColor} />}
            label="Manage Tests"
          />

          <NavItem
            currentPath={pathname}
            to={PathObj.ACCOUNT}
            icon={<MdAccountCircle size={ICON_SIZE + 2} color={primaryColor} />}
            label="My Account"
          />
        </ul>

        {/* <AuthDisplay /> */}
      </div>
    </nav>
  );
};

export default LoggedInNav;
