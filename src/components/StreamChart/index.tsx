import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    // legend: {
    //   position: 'top' as const,
    // },
    title: {
      display: false,
      text: "Chart.js Line Chart",
    },
  },
};

export const StreamChart = () => {
  const dataDashboardState = useSelector(
    (state: RootState) => state.dashboard.data
  );
  const typeFilterDashboardState = useSelector(
    (state: RootState) => state.dashboard.typeFilter
  );

  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    const convert: { x: number; y: number }[] = [];
    const labels: string[] = [];
    const dataDisplay: number[] = [];
    if (typeFilterDashboardState !== "Tuần") {
      dataDashboardState.forEach(
        (item: { label: string | number | Date; value: any }) => {
          if (typeFilterDashboardState === "Ngày") {
            return convert.push({
              x: new Date(item.label).getDate(),
              y: item.value,
            });
          }
          if (typeFilterDashboardState === "Tháng") {
            return convert.push({
              x: new Date(item.label).getMonth(),
              y: item.value,
            });
          }
        }
      );
    } else {
      dataDashboardState.forEach(
        (item: { month: number; week: number; value: number }) => {
          convert.push({
            x: item.week,
            y: item.value,
          });
        }
      );
    }

    convert.map((item) => {
      labels.push(item.x.toString());
      dataDisplay.push(item.y);
    });

    setLabels(labels);
    setData(dataDisplay);
  }, [dataDashboardState, typeFilterDashboardState]);

  const dataChart = {
    labels,
    datasets: [
      {
        label: "",
        data: data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    // <div>index</div>

    <Line options={options} data={dataChart} />
  );
};
