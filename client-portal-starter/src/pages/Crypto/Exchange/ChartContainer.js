/* eslint-disable object-property-newline */
import {
  useState, useEffect, useContext
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";

import CardWrapper from "components/Common/CardWrapper";
import Loader from "components/Common/Loader";
import Chart from "./Chart";

import { fetchOHLCV } from "store/actions";
import SocketContext from "../../../context/context";

const TIMEFRAMES = [
  { key: "1m", value: 60 },
  { key: "5m", value: 300 },
  { key: "15m", value: 900 },
  { key: "30m", value: 1800 },
  { key: "1h", value: 3600 },
  { key: "4h", value: 14400 },
  { key: "6h", value: 21600 },
  { key: "12h", value: 43200 },
  { key: "1d", value: 86400 },
  { key: "1w", value: 604800 },
  { key: "1M", value: 241920 }
];

const ChartContainer = ({ selectedMarket }) => {
  const { state, setState } = useContext(SocketContext);
  const { klines, loading } = useSelector(state => state.crypto.klines);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  const [timeframe, setTimeframe] = useState(TIMEFRAMES[2]); // 15m

  // init socket state symbol with selected symbol
  useEffect(() => {
    setState({
      ...state,
      klines: {
        symbol: selectedMarket,
        data: []
      }
    });
  }, [selectedMarket]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOHLCV({
      symbol: selectedMarket,
      timeframe: timeframe.key
    }));
  }, [selectedMarket, timeframe]);

  return (
    <CardWrapper className="p-2">
      {/* <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" href="#original" aria-controls="original" data-toggle="tab">{t("Original")}</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#depth" aria-controls="depth" data-toggle="tab">{t("Depth")}</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#advanced" aria-controls="advanced" data-toggle="tab">{t("Advanced")}</a>
        </li>
      </ul> */}
      {loading ? <Loader /> : <>
        <div className="p-1 d-inline-block">
          <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down" className="border">
            <DropdownToggle color="white" caret size="sm">
              Timeframe ({timeframe.key})
            </DropdownToggle>
            <DropdownMenu>
              {TIMEFRAMES.map((timeframe) => {
                return <DropdownItem key={timeframe.key}
                  onClick={() => setTimeframe(timeframe)}
                >
                  {timeframe.key}
                </DropdownItem>;
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="tab-content">
          <div role="tabpanel" id="original" className="tab-pane active">
            <Chart klines={klines.data} socketKlines={state.klines.data} symbol={selectedMarket} timeframe={timeframe} />
          </div>
          {/* <div role="tabpanel" id="depth" className="tab-pane">
            <div>{t("depth")}</div>
          </div>
          <div role="tabpanel" id="advanced" className="tab-pane">
            <AdvancedChart klines={klines.data} socketKlines={state.klines.data} symbol={selectedMarket} timeframe={timeframe} />
          </div> */}
        </div>
      </>}
    </CardWrapper>
  );
};

export default ChartContainer;