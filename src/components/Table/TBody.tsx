import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}
const TBody = ({ children, ...props }: Props) => {
  return <tbody {...props}>{children}</tbody>;
};
export default TBody;
