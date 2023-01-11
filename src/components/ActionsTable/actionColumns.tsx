import { pgDateToReadable } from "../../utils/pgDateToReadable";

export const actionColumns = () => {
  return [
    {
      Header: "Passed",
      accessor: "passed",
      Cell: ({ value }: { value: boolean }) => {
        const content = value ? "Passed" : "Failed";
        return <div>{content}</div>;
      },
    },
    {
      Header: "Activity Type",
      accessor: "type",
    },
    {
      Header: "Timestamp",
      accessor: "createdAt",
      Cell: ({ value }: { value: string }) => {
        return <div>{pgDateToReadable(value)}</div>;
      },
    },
    {
      Header: "Brand",
      accessor: "session.endo.brand",
    },
    {
      Header: "Model",
      accessor: "session.endo.model",
    },
    {
      Header: "Type",
      accessor: "session.endo.type",
    },
    {
      Header: "Serial",
      accessor: "session.endo.serialNum",
    },
    {
      Header: "Position",
      accessor: "session.endo.position",
    },
    {
      Header: "Patient",
      accessor: "session.patient.hosNum",
    },
    {
      Header: "Officer",
      accessor: "officer.officerNum",
    },
  ];
};
