import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const THead = ({ children, ...props }: Props) => {
  return (
    <thead {...props} className="text-md text-gray-700 uppercase bg-gray-50 ">
      {children}
    </thead>
  );
};
export default THead;
