interface Props {
  text: string;
}
export const Error = ({ text }: Props) => {
  return (
    <div className="flex items-center justify-center">
      <div>{text}</div>
    </div>
  );
};
