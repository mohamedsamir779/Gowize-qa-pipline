import { connect } from "react-redux";
import React from "react";
import ReactApexChart from "react-apexcharts";

const Spinearea = ({ colors, market, ...props }) => {
  const initialData = [
    {
      name: "series1",
      data: [300, 74, 78, 74, 79, 75, 80, 78, 30, 78, 74, 150, 180, 300, 200, 150, 100, 50, 79, 75, 80, 78, 74, 78, 74, 79, 75, 20]
    }
  ];
  const found = props.highKlines.find((x) => x.name === market);
  const series = !props.loading ? [found || initialData] : initialData;
  const extraParams = {
    toolbar: {
      show: false,
      tools: {
        download: false
      }
    },
    sparkline: {
      enabled: true
    }
  };
  const options = {
    grid: {
      show: false,
      padding: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 0
      }
    },
    chart: {
      type: "area",
      ...extraParams,
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: [2, 2],
      curve: "smooth",
      colors: [colors.strokeColor]
    },
    yaxis: {
      show: false,
      // min: 6
    },
    colors: [colors.chartColor],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.7,
        opacityFrom: 0.8,
        opacityTo: 0.9,
        shade: props.theme,
        // stops: [30, 90, 100],
        // gradientToColors: [props.theme === 'dark' ? 'rgba(35, 38, 47, 0.9)' : 'white']
      }
    },
    xaxis: {
      labels: {
        formatter: function () {
          return "";
        },
        beginAtZero: false,
        show: false
      },
      floating: true
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm"
      },
    }
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={props.hover ? "180" : "140"}
    />
  );
};
const mapStateToProps = (state) => {
  return {
    theme: state.Layout.layoutMode,
    loading: state.crypto.klines.loading,
    highKlines: state.crypto.klines.highKlines,
  };
};
export default connect(mapStateToProps, null)(Spinearea);
