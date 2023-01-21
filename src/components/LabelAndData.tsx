import React, { ReactNode } from "react";

interface Props {
  icon?: ReactNode;
  label?: string;
  data: string;
}

const LabelAndData = ({ icon, label, data }: Props) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div className="font-bold">{label}</div>
      <div> {data}</div>
    </div>
  );
};
export default LabelAndData;
