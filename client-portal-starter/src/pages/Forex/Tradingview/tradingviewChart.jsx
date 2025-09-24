
import {  
	React, useEffect, useRef 
} from "react";
import "./style.css";
import { widget } from "../../../charting_library";
import datafeedTest from "./datafeed";

function getLanguageFromURL() {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(window.location.search);
  return results === null
    ? null
    : decodeURIComponent(results[1].replace(/\+/g, " "));
}

export const TVChartContainer = () => {
  const chartContainerRef = useRef();

  const defaultProps = {
    symbol: "ETH/USDT",
    interval: "15",
    datafeedUrl: "https://demo_feed.tradingview.com",
    library_path: "./charting_library/",
    chartsStorageUrl: "https://saveload.tradingview.com",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
    timezone: "Etc/UTC",
	has_intraday: false
  };

  useEffect(() => {
    const widgetOptions = {
		symbol: defaultProps.symbol,
		datafeed: datafeedTest,
		interval: defaultProps.interval,
		container: chartContainerRef.current,
		library_path: defaultProps.library_path,
		debug: true,
		locale: getLanguageFromURL() || "en",
		disabled_features: ["use_localstorage_for_settings"],
		enabled_features: ["study_templates"],
		charts_storage_url: defaultProps.chartsStorageUrl,
		charts_storage_api_version: defaultProps.chartsStorageApiVersion,
		client_id: defaultProps.clientId,
		user_id: defaultProps.userId,
		fullscreen: defaultProps.fullscreen,
		autosize: defaultProps.autosize, 
		"has-intraday": true,
		"has_intraday": true,
		has_daily: false,
		has_weekly_and_monthly: false,
		studies_overrides: defaultProps.studiesOverrides,
    };

    const tvWidget = new widget(widgetOptions);
    tvWidget.onChartReady(() => {
      console.log("Chart has loaded");
    });

    return () => {
      tvWidget.remove();
    };
  });

  return <div ref={chartContainerRef} className={"TVChartContainer"} />;
};