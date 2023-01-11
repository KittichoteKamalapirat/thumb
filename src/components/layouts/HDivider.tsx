import classNames from "classnames";

interface Props {
  extraClass?: string;
}
const HDivider = ({ extraClass }: Props) => {
  return (
    <div
      className={classNames(
        "border-b-2 border-solid border-grey-50",
        extraClass
      )}
    />
  );
};
export default HDivider;
