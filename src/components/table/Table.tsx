import { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import "./index.scss";

export const Table = ({ data }: { data: any }) => {
  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData,
    className,
  }: any) => {
    const [value, setValue] = useState(initialValue);

    const onChange = (e: { target: { value: any } }) => {
      setValue(e.target.value);
    };

    const onBlur = () => {
      updateMyData(index, id, value);
    };

    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    return (
      <input
        className={className}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-date" }} />
        ),
      },
      {
        Header: "Issue",
        accessor: "issue",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-issue" }} />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-name" }} />
        ),
      },
      {
        Header: "Comment",
        accessor: "comment",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col" }} />
        ),
      },
      {
        Header: "Project",
        accessor: "project",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-project" }} />
        ),
      },
      {
        Header: "Start",
        accessor: "start",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-start" }} />
        ),
      },
      {
        Header: "End",
        accessor: "end",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-end" }} />
        ),
      },
      {
        Header: "Duration",
        accessor: "duration",
        Cell: (props: any) => (
          <EditableCell {...{ ...props, className: "col col-time" }} />
        ),
      },
      {
        Header: "Loaded",
        accessor: "loaded",
        Cell: (props: any) => {
          const { value } = props;
          return (
            <input
              type="checkbox"
              className="col col-loaded"
              checked={value}
              disabled
              onChange={() => {}}
            />
          );
        },
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

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
