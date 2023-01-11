interface Props {
  children: React.ReactNode;
}

const Tabs = ({ children }: Props) => {
  const style =
    "flex border-solid border-primary-primary border-2 rounded-l-md rounded-r-md";

  return <div className={style}>{children}</div>;
};

export default Tabs;
