interface Props {
  heading: string;
  fontSize: string;
  fontStyle: string;
  fontColor: string;
  extraClass: string;
  fontWeight: string;
  title: string;
}

const SubHeading = ({
  heading,
  fontSize,
  fontStyle,
  fontColor,
  extraClass,
  title,
  fontWeight,
}: Props) => (
  <h2
    className={`${fontSize} ${fontStyle} ${fontColor} ${fontWeight} ${extraClass}`}
    title={title}
  >
    {heading}
  </h2>
);

SubHeading.defaultProps = {
  heading: "",
  fontSize: "text-xl",
  fontStyle: "font-nunito",
  fontColor: "",
  fontWeight: "font-bold",
  extraClass: "",
  title: "",
};

export default SubHeading;
