import classNames from "classnames";

interface Props {
  content: string;
  extraClass?: string;
}

const Badge = ({ content, extraClass }: Props) => {
  const commonClassName = "font-bold text-primary-primary text-sm py-[1px] px-1 border-[1px] border-solid rounded-md border-primary-primary"
  return (
    <div
      role="badge"
      aria-label={`badge-${content}`}

    >
      <span className={classNames(commonClassName, extraClass)}>
        {content}
      </span>

    </div>
  );
};

export default Badge;
