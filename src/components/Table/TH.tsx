import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const TH = ({ children, ...props }: Props) => {
  return (
    <th {...props} className="py-3 px-6">
      {children}
    </th>
  );
};
export default TH;
