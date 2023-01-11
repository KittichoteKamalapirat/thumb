import { useEffect, useMemo, useState } from "react";
import {
  Column,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

import dayjs from "dayjs";
import { Action, usePaginatedActionsQuery } from "../../generated/graphql";
import CounterIndicator from "../CounterIndicator";
import { GlobalFilter } from "../EndosSettingTable/GlobalFilter";
import { Error } from "../skeletons/Error";
import RowsSkeleton from "../skeletons/RowsSkeleton";
import PaginationControl from "../Table/PaginationControl";
import Table from "../Table/Table";
import TBody from "../Table/TBody";
import TD from "../Table/TD";
import TH from "../Table/TH";
import THead from "../Table/THead";
import TR from "../Table/TR";
import PageHeading from "../typography/PageHeading";
import { actionColumns } from "./actionColumns";
import SortHeader from "../Table/SortHeader";
import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";

const ActionsTable = () => {
  const [currPage, setCurrPage] = useState(1);
  const navigate = useNavigate();
  const [localPageSize, setLocalPageSize] = useState(10);

  const {
    data: pagActionsData,
    loading,
    error,
    fetchMore,
    refetch,
  } = usePaginatedActionsQuery({
    variables: { input: { page: currPage, limit: localPageSize } },
  });

  // the lib recommedns to use useMemo
  const columns = useMemo<Column[]>(() => actionColumns(), []);

  const data = useMemo(() => {
    if (error || loading || pagActionsData?.paginatedActions.items.length === 0)
      return [];

    const actions = [...(pagActionsData?.paginatedActions.items || [])]; // TODO make this less confusing

    return (
      actions.sort((prev, curr) => {
        const dateSort: number =
          dayjs(curr.createdAt).valueOf() - dayjs(prev.createdAt).valueOf();
        return dateSort || 0;
      }) || []
    );

  }, [loading, pagActionsData, error]);



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
    pagActionsData?.paginatedActions.meta || {};
  const canNextPage = (currentPage || 1) < (totalPages || 1);
  const canPreviousPage = (currentPage || 1) > 1;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,

    setPageSize,
    prepareRow,
    state: { globalFilter },
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
      <PageHeading heading="Activities" />

      <PaginationControl
        nextPage={nextPage}
        previousPage={previousPage}
        canNextPage={canNextPage}
        canPreviousPage={canPreviousPage}
        pageNum={pagActionsData?.paginatedActions.meta.totalPages || 1}
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
              // <Link to={`/session/${(row.original as Action).sessionId}`}>
              <TR
                {...row.getRowProps()}
                key={index}
                onClick={() =>
                  navigate(`/session/${(row.original as Action).sessionId}`, {
                    state: { prev: "/activities" },
                  })
                }
                className={classNames(
                  index % 2 !== 0 ? "bg-grey-50" : "",
                  "hover:font-bold hover:cursor-pointer"
                )}
              >
                {/* <a href={`/session/${(row.original as Action).sessionId}`}> */}
                {row.cells.map((cell: any, index) => (
                  <TD
                    {...cell.getCellProps()}
                    isnumeric={cell.column.isNumeric}
                    key={index}
                  >
                    {cell.render("Cell")}
                  </TD>
                ))}
                {/* </a> */}
              </TR>
              // </Link>
            );
          })}
        </TBody>
      </Table>
    </div>
  );
};

export default ActionsTable;
