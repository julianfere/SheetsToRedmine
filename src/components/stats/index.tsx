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
    [state.config.workDays, state.config.hoursPerDay]
  );

  const totalWorkload = useMemo(
    () => Number(state.config.workDays) * Number(state.config.hoursPerDay),
    [state.config.workDays, state.config.hoursPerDay]
  );
  return (
    <footer className="stats">
      <ul className="stats__list">
        <li>
          <span className="stats__label">
            <span className="label__key">Rows imported</span>:{" "}
            {state.update ? state.tableData.length : 0}
          </span>
        </li>
        <li>
          <span className="stats__label">
            <span className="label__key">Total hours</span>:{" "}
            {isNaN(totalHours) ? 0 : totalHours}
          </span>
        </li>
        <li>
          <span className="stats__label">
            <span className="label__key">Work days</span>:{" "}
            {state.config.workDays}
          </span>
        </li>
        <li>
          <span className="stats__label">
            <span className="label__key">Work hours</span>:{" "}
            {state.config.hoursPerDay}
          </span>
        </li>
        <li>
          <span className="stats__label">
            <span className="label__key">Work load</span>:{" "}
            {totalHours > remainingHours ? totalWorkload - remainingHours : 0}
          </span>
        </li>
        <li>
          <span className="stats__label">
            <span className="label__key">Remaining hours</span>:{" "}
            {isNaN(remainingHours) ? 0 : remainingHours}
          </span>
        </li>
        <li>
          <span className="stats__label">
            <span className="label__key">Extra hours</span>:{" "}
            {isNaN(remainingHours) ? 0 : -remainingHours}
          </span>
        </li>
      </ul>
    </footer>
  );
};

export { Stats };
