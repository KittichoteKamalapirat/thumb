import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import { ICON_SIZE } from "../../constants";

interface Props {
  isSorted: boolean;
  isSortedDesc: boolean | undefined;
}

const SortHeader = ({ isSorted, isSortedDesc }: Props) => {
  return (
    <div>
      {isSorted ? (
        isSortedDesc ? (
          <AiOutlineSortDescending size={ICON_SIZE + 4} />
        ) : (
          <AiOutlineSortAscending size={ICON_SIZE + 4} />
        )
      ) : (
        ""
      )}
    </div>
  );
};
export default SortHeader;
