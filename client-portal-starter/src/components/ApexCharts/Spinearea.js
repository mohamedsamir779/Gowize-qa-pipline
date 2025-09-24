import React from "react";
import ReactApexChart from "react-apexcharts";

const Spinearea = ({ colors }) => {
  const series = [
    {
      name: "series1",
      data: [34, 40, 28, 52, 42, 109, 100],
    },
  ];

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },

    colors: [...colors],
    grid: {
      borderColor: "#f1f1f1",
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height="100%"
    />
  );
};

export default Spinearea;
