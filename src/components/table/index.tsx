import { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import "./index.scss";

export const Table = ({ data }: { data: any }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
      },
      {
        Header: "Issue",
        accessor: "issue",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Comment",
        accessor: "comment",
      },
      {
        Header: "Project",
        accessor: "project",
      },
      {
        Header: "Start",
        accessor: "start",
      },
      {
        Header: "End",
        accessor: "end",
      },
      {
        Header: "Duration",
        accessor: "duration",
      },
      {
        Header: "Loaded",
        accessor: "loaded",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  console.log(data);

  return (
    <section className="table-container">
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
