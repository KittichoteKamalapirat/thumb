import classNames from "classnames";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { usePaginatedSnapshotsQuery } from "../../generated/graphql";
import CounterIndicator from "../CounterIndicator";
import { GlobalFilter } from "../EndosTable/GlobalFilter";
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
import SubHeading from "../typography/SubHeading";
import { snapshotColumns } from "./snapshotColumns";

const SnapshotsTable = () => {
  const [currPage, setCurrPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(10);

  const {
    data: pagSnapshotsData,
    loading,
    error,
    fetchMore,
    refetch,
  } = usePaginatedSnapshotsQuery({
    variables: { input: { page: currPage, limit: localPageSize } },
  });

  // the lib recommedns to use useMemo
  const columns = useMemo<Column[]>(() => snapshotColumns(), []);

  const data = useMemo(() => {
    if (
      error ||
      loading ||
      pagSnapshotsData?.paginatedSnapshots.items.length === 0
    )
      return [];

    const snapshots = [...(pagSnapshotsData?.paginatedSnapshots.items || [])]; // TODO make this less confusing
    return (
      snapshots.sort((prev, curr) => {
        const dateSort =
          dayjs(curr.createdAt).valueOf() - dayjs(prev.createdAt).valueOf();
        // const colSort =
        //   prev.container.col.charCodeAt(0) - curr.container.col.charCodeAt(0);
        // return dateSort || colSort;
        return dateSort;
      }) || []
    );
  }, [loading, pagSnapshotsData, error]);

  const nextPage = () => {
    const toFetchIndex = currPage + 1;
    fetchMore({
      variables: {
        input: { page: toFetchIndex, limit: localPageSize },
      },
    });
    setCurrPage(toFetchIndex);
  };

  const previousPage = () => {
    const toFetchIndex = currPage - 1;
    fetchMore({
      variables: {
        input: { page: toFetchIndex, limit: localPageSize },
      },
    });
    setCurrPage(toFetchIndex);
  };

  const { totalItems, totalPages, currentPage } =
    pagSnapshotsData?.paginatedSnapshots.meta || {};
  const canNextPage = (currentPage || 1) < (totalPages || 1);
  const canPreviousPage = (currentPage || 1) > 1;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { globalFilter },
    setPageSize,

    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setPageSize(localPageSize); // without this, it only shows 10 by default (react-table)
  }, [setPageSize, localPageSize]);
  if (loading) {
    return <RowsSkeleton />;
  }
  if (error) {
    return <Error text={error?.message} />;
  }

  return (
    <div>
      <SubHeading heading="Snapshots" />

      <PaginationControl
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageNum={pagSnapshotsData?.paginatedSnapshots.meta.totalPages || 1}
        setPageSize={setLocalPageSize}
        setCurrPage={setCurrPage}
        currPage={currPage}
        pageSize={localPageSize}
        totalItemsCount={totalItems}
      />

      <div className="my-4">
        <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
      </div>

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
            return (
              <TR
                {...row.getRowProps()}
                key={index}
                className={classNames(index % 2 !== 0 ? "bg-grey-50" : "")}
              >
                {row.cells.map((cell: any, index) => (
                  <TD
                    {...cell.getCellProps()}
                    isnumeric={cell.column.isNumeric}
                    key={index}
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

export default SnapshotsTable;
