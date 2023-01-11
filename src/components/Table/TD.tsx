import classNames from "classnames";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}
const TD = ({ children, className, ...props }: Props) => {
  return (
    <td {...props} className={classNames("py-4 px-6", className)}>
      {children}
    </td>
  );
};
export default TD;
