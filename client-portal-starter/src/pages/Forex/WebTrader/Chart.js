import { createChart, CrosshairMode } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { priceData } from "./priceData";
import { volumeData } from "./volumeData";
import { BigNumber } from "bignumber.js";
import { useSelector } from "react-redux";

function Chart() {
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();
  const appTheme = useSelector((state) => state.Layout.layoutMode);

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 375,
      layout: {
        background: { color: "transparent" }
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: "#485c7b",
      },
      timeScale: {
        borderColor: "#485c7b",
      },
      localization: {
        priceFormatter: (price) =>
          price < 1 ? BigNumber(price).toFixed(5) : BigNumber(price).toFixed(3)
      }
    }, []);
  
    const candleSeries = chart.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });
  
    candleSeries.setData(priceData);
  
    const volumeSeries = chart.current.addHistogramSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
      lineWidth: 2,
      priceFormat: {
        type: "volume",
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
  
    volumeSeries.setData(volumeData);
  }, []);
  
  useEffect(() => {
    const theme = {
      light: {
        layout: {
          textColor: "rgb(89, 98, 105)",
        },
        grid: {
          vertLines: {
            color: "#ced4da",
          },
          horzLines: {
            color: "#ced4da",
          },
        },
        priceScale: {
          borderColor: "#ced4da",
        },
        timeScale: {
          borderColor: "#ced4da",
        },
      },
      dark: {
        layout: {
          textColor: "rgb(113, 122, 134)",
        },
        grid: {
          vertLines: {
            color: "#44494f",
          },
          horzLines: {
            color: "#44494f",
          },
        },
        priceScale: {
          borderColor: "#44494f",
        },
        timeScale: {
          borderColor: "#44494f",
        },
      },
    };
    chart.current.applyOptions(appTheme === "light" ? theme.light : theme.dark);
  }, [appTheme]);


  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({
        width,
        height 
      });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

  
    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);
  
  return ( <>
    <div ref={chartContainerRef} className="chart-container" />
  </> );
}

export default Chart;