import { useMemo } from "react";
import { useAppContext } from "../../context/appContext";
import "./index.scss";

const hoursToNumber = (hours: string) => {
  const [h, m] = hours.split(":");
  return Number(h) + Number(m) / 60;
};

const Stats = () => {
  const { state } = useAppContext();
  const totalHours = useMemo(
    () =>
      state.tableData.reduce(
        (acc, curr) => acc + hoursToNumber(curr.duration),
        0
      ),
    [state.tableData]
  );

  const remainingHours = useMemo(
    () =>
      Number(state.config.workDays) * Number(state.config.hoursPerDay) -
      totalHours,
    [state.config.workDays, state.config.hoursPerDay, totalHours]
  );

  const totalWorkload = useMemo(
    () => Number(state.config.workDays) * Number(state.config.hoursPerDay),
    [state.config.workDays, state.config.hoursPerDay, totalHours]
  );
  return (
    <table className="stats__table">
      <thead>
        <tr>
          <th>Rows imported</th>
          <th>Total hours</th>
          <th>Work days</th>
          <th>Work hours</th>
          <th>Work load</th>
          <th>Remaining hours</th>
          <th>Extra hours</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{state.update ? state.tableData.length : 0}</td>
          <td>{isNaN(totalHours) ? 0 : totalHours}</td>
          <td>{state.config.workDays}</td>
          <td>{state.config.hoursPerDay}</td>
          <td>
            {totalHours < remainingHours ? totalWorkload - remainingHours : 0}
          </td>
          <td>{isNaN(remainingHours) ? 0 : remainingHours}</td>
          <td>
            {totalHours > remainingHours ? totalHours - remainingHours : 0}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export { Stats };
