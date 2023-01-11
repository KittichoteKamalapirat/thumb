import classNames from "classnames";
import { useMemo } from "react";
import { Column, useTable } from "react-table";
import { useContainersQuery } from "../../generated/graphql";
import CounterIndicator from "../CounterIndicator";
import { Error } from "../skeletons/Error";
import RowsSkeleton from "../skeletons/RowsSkeleton";
import Table from "../Table/Table";
import TBody from "../Table/TBody";
import TD from "../Table/TD";
import TH from "../Table/TH";
import THead from "../Table/THead";
import TR from "../Table/TR";
import SubHeading from "../typography/SubHeading";
import { containerColumns } from "./containerColumns";

const ContainersTable = () => {
  const {
    data: containersData,
    loading,
    error,
    refetch,
  } = useContainersQuery();

  // the lib recommedns to use useMemo
  const columns = useMemo<Column[]>(() => containerColumns(), []);

  const data = useMemo(() => {
    if (error || loading || containersData?.containers.length === 0) return [];

    const containers = [...(containersData?.containers || [])]; // TODO make this less confusing
    return (
      containers.sort((prev, curr) => {
        return prev.col.charCodeAt(0) - curr.col.charCodeAt(0) || 0;
      }) || []
    );
  }, [loading, containersData, error]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  if (loading) {
    return <RowsSkeleton />;
  }
  if (error) {
    return <Error text={error?.message} />;
  }

  return (
    <div>
      <SubHeading heading="Current Status" />
      <CounterIndicator refetch={refetch} />

      <Table {...getTableProps()}>
        <THead>
          {headerGroups.map((group, index) => (
            <TR {...group.getHeaderGroupProps} key={index}>
              {group.headers.map((col, index) => (
                <TH {...col.getHeaderProps()} key={index}>
                  {col.render("Header")}
                </TH>
              ))}
            </TR>
          ))}
        </THead>
        <TBody {...getTableBodyProps}>
          {rows.map((row, index) => {
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

export default ContainersTable;
