interface Props {
  heading: string;
  fontSize: string;
  fontStyle: string;
  fontWeight: string;
  fontColor: string;
}

const PageHeading = ({
  heading,
  fontSize,
  fontStyle,
  fontColor,
  fontWeight,
}: Props) => (
  <h1 className={`${fontSize} ${fontStyle} ${fontWeight} ${fontColor}`}>
    {heading}
  </h1>
);

PageHeading.defaultProps = {
  heading: "",
  fontSize: "text-2xl",
  fontStyle: "font-TRegular",
  fontWeight: "font-bold",
  fontColor: "",
};

export default PageHeading;
