import classNames from "classnames";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ACTIVE_PAGE_CLASSNAMES } from "../../theme";

interface NavItemProps {
  to: string;
  currentPath: string;
  icon: ReactNode;
  label: string;
}

const NavItem = ({ to, label, currentPath, icon }: NavItemProps) => {
  return (
    <li data-section="account">
      <Link
        to={to}
        className={classNames(
          "block py-2 pr-4 pl-3 hover:bg-primary-50 hover:cursor-pointer ",
          `${currentPath === to ? ACTIVE_PAGE_CLASSNAMES : "rounded-md"}`
        )}
      >
        <div
          className={classNames(
            "flex gap-1 items-center",
            "flex-col xl:flex-row"
          )}
        >
          {icon}
          <span>{label}</span>
        </div>
      </Link>
    </li>
  );
};

export default NavItem;
