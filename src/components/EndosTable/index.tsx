import classNames from "classnames";
import { useMemo } from "react";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from "react-table";
import {
  Endo, useEndosQuery,
  usePickEndoMutation
} from "../../generated/graphql";

import { useNavigate } from "react-router-dom";
import { useScreenIsLargerThan } from "../../hooks/useScreenIsLargerThan";
import { sortEndosByPosition } from "../../utils/sortEndosByPosition";
import { ENDO_STATUS_VALUES, statusToBgColor } from "../../utils/statusToColor";
import Button, { ButtonTypes } from "../Buttons/Button";
import CounterIndicator from "../CounterIndicator";
import { Error } from "../skeletons/Error";
import RowsSkeleton from "../skeletons/RowsSkeleton";
import PaginationControl from "../Table/PaginationControl";
import SortHeader from "../Table/SortHeader";
import Table from "../Table/Table";
import TBody from "../Table/TBody";
import TD from "../Table/TD";
import TH from "../Table/TH";
import THead from "../Table/THead";
import TR from "../Table/TR";
import PageHeading from "../typography/PageHeading";
import { endoColumns } from "./endoColumns";
import { GlobalFilter } from "./GlobalFilter";

// 1. get the data
// 2. define the columns
// 3. create a table instance
// 4. define a table structure with HTML
// 5. use the table instance and put in HTML
// 6. style

const EndosTable = () => {
  const navigate = useNavigate();
  const { data: endosData, loading, error, refetch } = useEndosQuery();

  const isLargerThanBreakpoint = useScreenIsLargerThan("md")


  const sortedEndos = sortEndosByPosition(endosData?.endos as Endo[])

  // const refetchCounter = useRefetchCounter(refetch);
  const [pickEndo] = usePickEndoMutation();


  // the lib recommedns to use useMemo
  const columns = useMemo<Column[]>(() => {
    return endoColumns({ pickEndo, refetchEndos: refetch, isLargerThanBreakpoint });
  }, [pickEndo, refetch, isLargerThanBreakpoint]);

  const data = useMemo(() => {
    if (error || loading || endosData?.endos.length === 0) return [];
    return sortedEndos || [];
  }, [loading, endosData, error]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // pagination starts
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions, // for getting all pages num
    setPageSize, // for customize pageSize
    // pagination ends

    prepareRow,
    state: { pageIndex, globalFilter, pageSize }, // table state
    setGlobalFilter, // for setting global filter text value
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 50 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  if (loading) {
    return <RowsSkeleton />;
  }
  if (error) {
    return <Error text={error?.message} />;
  }

  return (
    <div>
      <div className="flex justify-between">
        <PageHeading heading="Endoscopes" />
        <Button
          label="Add"
          onClick={() => {
            navigate("/endo/new", {
              state: { prev: `/setting` },
            });
          }}
          type={ButtonTypes.PRIMARY}
        />
      </div>

      <div className="my-4">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>
      <PaginationControl
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageNum={pageOptions.length}
        setPageSize={setPageSize}
        currPage={pageIndex + 1}
        pageSize={pageSize}
        totalItemsCount={endosData?.endos.length}
      />

      {/* only this component will get updated every seconds */}
      <CounterIndicator refetch={refetch} />
      <Table {...getTableProps()}>
        <THead>
          {headerGroups.map((group, index) => (
            <TR {...group.getHeaderGroupProps} key={index}>
              {group.headers.map((col, index) => (
                <TH
                  {...col.getHeaderProps(col.getSortByToggleProps())}
                  key={index}
                >
                  <div className="flex gap-2 items-center">
                    {col.render("Header")}
                    <SortHeader
                      isSorted={col.isSorted}
                      isSortedDesc={col.isSortedDesc}
                    />
                  </div>
                </TH>
              ))}
            </TR>
          ))}
        </THead>
        <TBody {...getTableBodyProps}>
          {page.map((row, index) => {
            prepareRow(row);

            const rowStatus = (page[index].original as Endo)
              .status as ENDO_STATUS_VALUES;
            const rowColor = statusToBgColor[rowStatus];

            return (
              <TR
                {...row.getRowProps()}
                key={index}
                className={classNames(
                  rowColor,
                  "border-b-2 border-solid border-grey-50 hover:font-bold hover:cursor-pointer"
                )}
              >
                {row.cells.map((cell: any, index) => (
                  <TD
                    {...cell.getCellProps()}
                    isnumeric={cell.column.isNumeric}
                    key={index}
                    onClick={
                      // if col is action => don't navigate! (nested links are not allowed)
                      cell.column.Header !== "Action"
                        ? () =>
                          navigate(`/endo/${(row.original as Endo).id}`, {
                            state: { prev: "/" },
                          })
                        : undefined
                    }
                  >
                    {cell.render("Cell")}
                  </TD>
                ))}
              </TR>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
};

export default EndosTable;
