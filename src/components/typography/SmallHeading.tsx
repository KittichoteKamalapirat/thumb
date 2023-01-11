interface Props {
  heading: string;
  fontSize: string;
  fontStyle: string;
  fontColor: string;
  spacing: string;
  extraClass?: string;
}

const SmallHeading = ({
  heading,
  fontSize,
  fontStyle,
  fontColor,
  spacing,
  extraClass,
}: Props) => (
  <h6
    className={`${fontSize} ${fontStyle} ${fontColor} ${spacing} ${extraClass}`}
  >
    {heading}
  </h6>
);

SmallHeading.defaultProps = {
  heading: "",
  fontSize: "text-lg",
  fontStyle: "font-TRegular font-bold",
  fontColor: "",
  spacing: "",
  extraClass: "",
};

export default SmallHeading;
