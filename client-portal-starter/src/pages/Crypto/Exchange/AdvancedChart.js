import {
  useRef, useEffect, useState
} from "react";
import { useSelector } from "react-redux";
import { createChart, CrosshairMode } from "lightweight-charts";
import { useTranslation } from "react-i18next";
import { BigNumber } from "bignumber.js";
import { SMA } from "technicalindicators";
import { fetchOHLCV } from "../../../apis/klines";
const ZEROS = "0000.0000";

const AdvancedChart = ({ klines, symbol, timeframe, socketKlines }) => {
  const { t } = useTranslation();

  const [OHLC, setOHLC] = useState(undefined);
  const [volume, setVolume] = useState(undefined);

  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();
  const appTheme = useSelector((state) => state.Layout.layoutMode);

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: "transparent" }
      },
      width: chartContainerRef.current.clientWidth,
      height: 375,
      crosshair: {
        mode: CrosshairMode.Normal,
        color: "#758696",
      },
      timeScale: {
        timeVisible: true,
      },
      localization: {
        priceFormatter: (price) =>
          price < 1 ? BigNumber(price).toFixed(5) : BigNumber(price).toFixed(3)
      }
    });
  }, []);

  useEffect(() => {
    const candleSeries = chart.current.addCandlestickSeries({
      upColor: "#4bffb5",
      downColor: "#ff4976",
      borderDownColor: "#ff4976",
      borderUpColor: "#4bffb5",
      wickDownColor: "#838ca1",
      wickUpColor: "#838ca1",
    });

    if (klines.length > 0) {
      candleSeries.setData(klines);

      const MASeries = chart.current.addLineSeries({
        lineWidth: 1,
        color: "rgba(4, 111, 232, 1)",
        lastValueVisible: false,
        crosshairMarkerVisible: false,
      });
      let closeVals = [];
      klines.forEach((kline) => {
        closeVals.push(+kline.close);
      });
      const smaVals = SMA.calculate({
        period: 7,
        values: closeVals,
      });
      const sma = klines.map((kline, idx) => {
        return {
          value: smaVals[idx],
          time: kline.time
        };
      });
      MASeries.setData(sma);

      const volumeSeries = chart.current.addHistogramSeries({
        color: "#c3c3c3",
        lastValueVisible: false,
        priceFormat: {
          type: "volume",
        },
        priceScaleId: "",
        scaleMargins: {
          top: 0.8,
          bottom: 0,
        },
      });
      const volume = klines.map((kline) => {
        return {
          time: kline.time,
          value: kline.volume,
          color: kline.close > kline.open ? "rgba(75, 255, 181, 0.7)" : "rgba(255, 73, 118, 0.7)"
        };
      });
      volumeSeries.setData(volume);

      // Get OHLC data on mouse move
      chart.current.subscribeCrosshairMove((param) => {
        setOHLC(param.seriesPrices.get(candleSeries));
        setVolume(param.seriesPrices.get(volumeSeries));
      });

      // Infinite history loading
      const timeScale = chart.current.timeScale();
      let timer = null;
      timeScale.subscribeVisibleLogicalRangeChange(() => {
        if (timer !== null) return;
        // kline time in state is in secs, but backend expects it in ms
        let since = (klines[0].time - 60 * 60 * 24) * 1000;
        timer = setTimeout(async () => {
          var logicalRange = timeScale.getVisibleLogicalRange();
          if (logicalRange !== null) {
            const barsInfo = candleSeries.barsInLogicalRange(logicalRange);
            if (barsInfo !== null && barsInfo.barsBefore < 25 && barsInfo.barsAfter !== 0) {
              let payload = {
                since,
                limit: 500,
                symbol,
                timeframe: timeframe.key,
              };
              const { data } = await fetchOHLCV({ payload });
              if (data?.length > 0) {
                klines = [...data, klines];
                candleSeries.setData(data);
              }
            }
          }
          timer = null;
        }, 50);
      });

      // realtime emulation
      var tick = klines[klines.length - 1].time + timeframe.value;
      if (socketKlines.length > 0) {
        var candleUpdateTime = setInterval(() => {
          const lastCandle = socketKlines[socketKlines.length - 1];
          if (lastCandle.time > tick) {
            tick += timeframe.value;
          }
          lastCandle.time = tick;
          candleSeries.update(lastCandle);
        }, 50);
      }
    }
    return () => clearInterval(candleUpdateTime);
  }, [klines]);

  // chart colors
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

  return (
    <div className="position-relative">
      <p className={`position-absolute end-0 me-2 ${!OHLC ? "text-secondary" : OHLC?.open > OHLC?.close ? "text-danger" : "text-success"}`}
        style={{ top: "-30px" }}>
        {`O: ${OHLC?.open ?? ZEROS} H: ${OHLC?.high ?? ZEROS} L: ${OHLC?.low ?? ZEROS} C: ${OHLC?.close ?? ZEROS} V: ${volume ? BigNumber(volume).toFixed(4) : ZEROS}`}
      </p>
      <div className="col-12 col-lg-9">
        <div className="text-muted">
          <button className="btn p-0 me-3">
            <img src="img/icons/candle-graph.svg"></img>
          </button>
          <button className="btn p-0 me-3">
            <img className="me-1" src="img/icons/plus.svg"></img>
            <span>{t("Compare")}</span>
          </button>
          <button className="btn p-0 me-3">
            <img className="me-1" src="img/icons/fx.svg"></img>
            {t("Indicators")}
          </button>
          <button>
            <div className="btn p-0 me-2">
              <img src="img/icons/left-round-arrow.svg"></img>
            </div>
            <div className="btn p-0">
              <img src="img/icons/right-round-arrow.svg"></img>
            </div>
          </button>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default AdvancedChart;
