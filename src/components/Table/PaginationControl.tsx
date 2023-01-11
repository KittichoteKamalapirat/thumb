import classNames from "classnames";
import { BsFillCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import Button, { ButtonTypes } from "../Buttons/Button";

interface Props {
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageNum: number;
  setPageSize: (pageSize: number) => void;
  currPage: number;
  pageSize: number;
  setCurrPage?: React.Dispatch<React.SetStateAction<number>>;
  totalItemsCount?: number;
}

const PaginationControl = ({
  nextPage,
  previousPage,
  canNextPage,
  canPreviousPage,
  pageNum,
  setPageSize,
  currPage,
  pageSize,
  setCurrPage,
  totalItemsCount,
}: Props) => {
  return (
    <div className="flex justify-between mb-2">
      <div className="flex items-center gap-4">
        <Button
          label=""
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          type={ButtonTypes.TEXT}
          startIcon={<BsFillCaretLeftFill />}
        />

        <div id="page-indicator">
          <span className="font-bold">{currPage} </span> / {pageNum}
        </div>

        <Button
          label=""
          onClick={() => nextPage()}
          disabled={!canNextPage}
          type={ButtonTypes.TEXT}
          endIcon={<BsFillCaretRightFill />}
        />
      </div>

      <div className="flex flex-col items-end">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrPage && setCurrPage(1); // reset to 1 so it doesn't exceed (ex. 14/10)
          }}
          className="p-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
        >
          {[10, 50, 100, 200].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
        {totalItemsCount ? (
          <p className={classNames("text-grey-500 text-sm")}>
            No. of results: {totalItemsCount}
          </p>
        ) : null}
      </div>
    </div>
  );
};
export default PaginationControl;
