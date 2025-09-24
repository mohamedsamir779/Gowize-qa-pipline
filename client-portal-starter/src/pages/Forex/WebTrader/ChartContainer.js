import classNames from "classnames";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonGroup } from "reactstrap";
import Chart from "./Chart";

function ChartContainer() {
  const { t } = useTranslation();
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };
  return (<div>
    <div className="d-flex justify-content-between flex-wrap mb-4 row">
      <div className="col-12 col-lg-9">
        <div className="d-flex justify-content-between align-items-center flex-wrap text-muted">
          <button className="btn btn-link p-0">
              1h
          </button>
          <button className="btn btn-link p-0">
            <img src="img/icons/candle-graph.svg"></img>
          </button>
          <button className="btn btn-link p-0">
            <img src="img/icons/plus.svg"></img>
            <span className="ms-2">{t("Compare")}</span>
          </button>
          <button className="btn btn-link p-0">
            <img src="img/icons/fx.svg"></img>
          </button>
          <button className="btn btn-link p-0">
            {t("Indicators")}
          </button>
          <button>
            <div className="btn btn-link p-0">
              <img src="img/icons/left-round-arrow.svg"></img>
            </div>
            <div className="btn btn-link p-0">
              <img src="img/icons/right-round-arrow.svg"></img>
            </div>
          </button>
          <button className="btn btn-link p-0">
            <img src="img/icons/setting.svg"></img>
          </button>
        </div>
      </div>
      <div className="nav-tab-custom col-12 col-lg-3 text-center">
        <ButtonGroup>
          <button
            className={classNames("btn btn-light", {
              "blue-gradient-color": customActiveTab === "1",
            })}
            onClick={() => {
              toggleCustom("1");
            }}>
            {t("Trade")}
          </button>
          <button
            className={classNames("btn btn-light", {
              "blue-gradient-color": customActiveTab === "2",
            })}
            onClick={() => {
              toggleCustom("2");
            }}>
            {t("History")}
          </button>
          <button
            className={classNames("btn btn-light", {
              "blue-gradient-color": customActiveTab === "3",
            })}
            onClick={() => {
              toggleCustom("3");
            }}>
            {t("Journey")}
          </button>
        </ButtonGroup>
      </div>
    </div>    
    <div>
      <div className="d-flex justify-content-between">
        <div>
          {t("BTC/USD")}
        </div>
        <div className="form-check form-check-right mb-3">
          <input className="form-check-input" type="radio" name="formRadiosRight" id="formRadiosRight1" checked=""/>
          <label className="form-check-label" htmlFor="formRadiosRight1">1
          </label>
        </div>
        <div>
          0
          <span className="color-green">{t("38032.68")}</span>
        </div>
        <div>
          H
          <span className="color-green">{t("38032.68")}</span>
        </div>
        <div>
          L
          <span className="color-green">{t("38032.68")}</span>
        </div>
        <div>
          C
          <span className="color-green">{t("38032.68")}</span>
        </div>
        <div>
          <span className="color-green">{t("38032.68")}</span>
        </div>
        <div>
          <span className="color-green">{t("(0.00)%")}</span>
        </div>
      </div>
    </div> 
    <Chart></Chart> 
  </div>);
}

export default ChartContainer;