import React, { useCallback, useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import { RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { getOnlyDate } from "../../utils";
import {
  updateDataDashboard,
  updateFilterDashboard,
} from "../../store/reducers/dashboardSlice";
import { Dropdown } from "../../components/Dropdown";
import { StreamChart } from "../../components/StreamChart";

export const Dashboard = () => {
  const numberLevelsState = useSelector(
    (state: RootState) => state.numberLevel.numberLevels
  );

  const dispatch = useDispatch<any>();
  const [watchType, setWatchType] = useState<string>("Ngày");
  const [displayDate, setDisplayDate] = useState<string>("");

  const handleDisplayDate = (value: string) => {
    const date = new Date();
    let res: string = "";
    if (value === "Tháng") res = `Năm ${date.getFullYear()}`;
    if (value === "Tuần" || value === "Ngày")
      res = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
    setDisplayDate(res);
    setWatchType(value);
  };

  const checkExist = (
    list: { label: string; value: number }[],
    value: string
  ) => {
    let status: boolean = false;
    list.forEach((item) => {
      const date = new Date(item.label);
      if (
        item.label === value &&
        date.getMonth() === new Date(value).getMonth()
      ) {
        item.value++;
        return (status = true);
      }
      return;
    });

    if (status === false)
      list.push({
        label: value,
        value: 1,
      });
    return;
  };

  const checkExistTest = (
    list: { label: string; value: number }[],
    value: string
  ) => {
    let status: boolean = false;
    const currentDate = new Date();

    list.forEach((item) => {
      const date = new Date(item.label);
      if (date.getMonth() === new Date(value).getMonth()) {
        item.value++;
        status = true;
      }
      return;
    });

    if (
      status === false &&
      new Date(value).getFullYear() === currentDate.getFullYear()
    )
      list.push({
        label: value,
        value: 1,
      });
    return;
  };

  const filterDatesByWeekAndMonth = (
    dates: Date[]
  ): { [month: number]: { [weekNumber: number]: Date[] } } => {
    const weeksByMonth: { [month: number]: { [weekNumber: number]: Date[] } } =
      {};

    dates.forEach((date) => {
      const d = new Date(date);
      const month = d.getMonth();
      const weekNumber = Math.ceil((d.getDate() + (d.getDay() + 1)) / 7);

      if (!weeksByMonth[month]) {
        weeksByMonth[month] = {};
      }

      if (!weeksByMonth[month][weekNumber]) {
        weeksByMonth[month][weekNumber] = [];
      }

      weeksByMonth[month][weekNumber].push(date);
    });

    return weeksByMonth;
  };

  const getMonthAndNumberOfWeeks = (filteredDates: {
    [month: number]: { [weekNumber: number]: Date[] };
  }) => {
    const result: { month: number; week: number; value: number }[] = [];
    const entries = Object.entries(filteredDates);
    entries.map((item) => {
      const month = parseInt(item[0]);
      let week = 0;
      let value = 0;
      const getWeek = Object.entries(item[1]);
      return getWeek.map((item) => {
        week = parseInt(item[0]);
        value = item[1].length;
        return result.push({ month, week, value });
      });
    });

    return result;
  };

  const displayWithWatchType = useCallback(() => {
    const result: { label: string; value: number }[] = [];
    const currentDate = new Date();

    if (watchType !== "Tuần") {
      numberLevelsState.forEach((item) => {
        const date = getOnlyDate(item.timeuse, "ahourAndDAte");
        if (date !== undefined) {
          if (result.length === 0 && watchType === "Ngày") {
            if (
              date.getFullYear() !== currentDate.getFullYear() &&
              date.getMonth() !== currentDate.getMonth() + 1
            )
              return;
            return result.push({
              label: date.toUTCString(),
              value: 1,
            });
          }
          if (result.length === 0 && watchType === "Tháng") {
            if (date.getFullYear() !== currentDate.getFullYear()) return;
            return result.push({
              label: date.toUTCString(),
              value: 1,
            });
          }
          if (watchType === "Tháng") {
            dispatch(updateFilterDashboard("Tháng"));
            return checkExistTest(result, date.toUTCString());
          }
          dispatch(updateFilterDashboard("Ngày"));
          checkExist(result, date.toUTCString());
        }
      });
      if (watchType === "Ngày") {
        result.sort((a, b) => {
          const aDate = new Date(a.label);
          const bDate = new Date(b.label);
          return aDate.getDate() - bDate.getDate();
        });
      }
      if (watchType === "Tháng") {
        result.sort((a, b) => {
          const aDate = Date.parse(a.label);
          const bDate = Date.parse(b.label);
          console.log(aDate);

          if (isNaN(aDate) || isNaN(bDate)) {
            return 0;
          }
          return aDate - bDate;
        });
      }
      return dispatch(updateDataDashboard(result));
    }
    const dates: Date[] = [];
    numberLevelsState.forEach((item) => {
      const date = getOnlyDate(item.timeuse, "ahourAndDAte");
      if (date === undefined) return;
      return dates.push(date);
    });
    const filteredDates: { [month: number]: { [weekNumber: number]: Date[] } } =
      filterDatesByWeekAndMonth(dates);

    const entries = getMonthAndNumberOfWeeks(filteredDates);
    const getValueAccordingToCurrentMonth = entries.filter((item) => {
      return item.month === currentDate.getMonth() + 1;
    });
    dispatch(updateDataDashboard(getValueAccordingToCurrentMonth));
    dispatch(updateFilterDashboard("Tuần"));
  }, [numberLevelsState, dispatch, watchType]);

  useEffect(() => {
    displayWithWatchType();
  }, [displayWithWatchType]);

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.top}>
          <div>
            <p>Bảng thống kê theo {watchType.toLocaleLowerCase()}</p>
            <p>{displayDate}</p>
          </div>

          <div>
            <p>Xem theo</p>
            <Dropdown
              data={["Ngày", "Tuần", "Tháng"]}
              setWidth={"106"}
              value={""}
              text="Ngày"
              onClick={(value) => handleDisplayDate(value)}
            />
          </div>
        </div>

        <div className={styles.chart}>
          <StreamChart />
        </div>
      </div>
    </div>
  );
};
