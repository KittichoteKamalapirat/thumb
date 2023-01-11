import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}
const TR = ({ children, className, onClick, ...props }: Props) => {
  return (
    <tr {...props} className={className} onClick={onClick}>
      {children}
    </tr>
  );
};
export default TR;
