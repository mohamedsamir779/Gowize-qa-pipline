import React, {
  useContext, useEffect, useRef, useState
} from "react";
import {
  Card, CardBody, Button
} from "reactstrap";
import { connect, useDispatch } from "react-redux";
import BigNumber from "bignumber.js";
import SplineArea from "./SplineArea";
import SocketContext from "../../context/context";
import { toggleCurrentModal } from "../../store/actions";
//i18n
import { withTranslation } from "react-i18next";
function CryptoCard({ cryptoFooter, cryptoDetails, market, isInWallets, history, ...props }) {
  const dispatch = useDispatch();
  const {
    state
  } = useContext(SocketContext);
  const {
    markets,
    orderBooks,
  } = state;
  const [positive, setPositive] = useState(false);
  const [sellButtonClass, setSellButtonClass] = useState("");
  const [buyButtonClass, setBuyButtonClass] = useState("");
  const [colors, setColors] = useState({
    strokeColor: "rgba(207, 48, 74, 0.6)",
    chartColor: "rgba(207, 48, 74, 0.4)"
  });
  const prevBP = useRef();
  const prevSP = useRef();
  const foundMarket = markets && markets.find(x => x.pairName === cryptoDetails.coinTitle);
  const foundOrderBook = orderBooks && orderBooks.find(x => x.pairName === cryptoDetails.coinTitle);
  const buyPrice = (foundOrderBook && foundOrderBook.asks[0] && foundOrderBook.asks[0][0]) || 0;
  const sellPrice = (foundOrderBook && foundOrderBook.bids[0] && foundOrderBook.bids[0][0]) || 0;

  if (market) {
    market.buyPrice = buyPrice;
    market.sellPrice = sellPrice;
  }
  useEffect(() => {
    const p = (new BigNumber(foundMarket?.percentage || cryptoDetails.precent).isPositive());
    if (p !== positive) {
      setPositive(p);
      if (p) {
        setColors({
          strokeColor: "rgba(3, 166, 109, 0.69)",
          chartColor: "rgba(3, 166, 109, 0.5)"
        });
      } else {
        setColors({
          strokeColor: "rgba(207, 48, 74, 0.6)",
          chartColor: "rgba(207, 48, 74, 0.4)"
        });
      }
    }
  }, [foundMarket?.percentage, cryptoDetails?.precent]);

  useEffect(() => {
    const buyP = prevBP.current || 0;
    const sellP = prevSP.current || 0;
    const BP = buyPrice;
    const SP = sellPrice;
    if (BP >= buyP) {
      //set green flash
      setBuyButtonClass("positive-back");
      setTimeout(() => {
        setBuyButtonClass("");
      }, 700);
    } else {
      //set red flash
      setBuyButtonClass("negative-back");
      setTimeout(() => {
        setBuyButtonClass("");
      }, 700);
    }
    if (SP >= sellP) {
      //set green flash
      setSellButtonClass("positive-back");
      setTimeout(() => {
        setSellButtonClass("");
      }, 700);
    } else {
      //set red flash
      setSellButtonClass("negative-back");
      setTimeout(() => {
        setSellButtonClass("");
      }, 700);
    }
  }, [buyPrice, sellPrice]);

  useEffect(() => {
    prevBP.current = buyPrice;
  }, [buyPrice]);

  useEffect(() => {
    prevSP.current = sellPrice;
  }, [sellPrice]);

  return (<>
    <Card className="text-center crypto-card mb-4">
      <CardBody className="p-0">
        <div className="crypto-card-head">
          <div className="crypto-title">
            <div className="title-left">
              <img src={cryptoDetails.iconSrc} alt="" />
              <div className="fw-bold">{cryptoDetails.coinTitle.split("/")[0]}</div>
            </div>
            {/* <div>
                          {foundMarket?.close || cryptoDetails.marketCap}
                        </div> */}
            <div className="title-right">
              <div className={`${positive ? "positive" : "negative"} fw-bold`}>
                {positive
                  ? <i className="mdi mdi-arrow-up"></i>
                  : <i className="mdi mdi-arrow-down"></i>}{foundMarket?.percentage || cryptoDetails.precent}%
              </div>
              <div className={`${positive ? "positive" : "negative"} price`}>
                ${foundMarket?.close || cryptoDetails.marketCap}
              </div>
            </div>
          </div>
        </div>
        <div className="crypto-card-body p-0">
          <SplineArea colors={colors} market={cryptoDetails.coinTitle} hover={props.hover} />
          {/* <div className="crypto-card-body-content">
                        <div className="d-block fs-6" style={{ color: colors.strokeColor, fontWeight: "bold" }}>
                            {foundMarket?.percentage || cryptoDetails.precent}
                            <i className="mdi mdi-arrow-up"></i>
                            <i className="mdi mdi-arrow-down"></i>
                        </div>
                        <div className="fs-4 fw-500">{foundMarket?.close || cryptoDetails.marketCap}</div>
                        <div className="text-muted">Market Cap</div>
                    </div> */}
        </div>
      </CardBody>
      <div className={`btn-group crypto-footer w-100 ${props.hover ? "crypto-card-btn-hover" : "crypto-card-btn"}`} role="group">
        {/* {cryptoFooter} */}
        {cryptoFooter ? <Button type="button" className="blue-gradient-color dashboard-button"
          onClick={() => { isInWallets && history.push("/quick-buy") }}
        >{isInWallets ? props.t("Quick Buy") : props.t("No wallet for this market.")}
        </Button> : (
          <>
            <Button type="button" className={`btn btn-light btn-sm waves-effect waves-light py-2 quick-buy-button ${buyButtonClass}`} onClick={() => {
              dispatch(toggleCurrentModal("quickBuy", market));
            }}>
              <div className='text-center'>
                {props.t("Buy")}
                <p style={{ fontSize: "10px" }}>
                  {buyPrice || "22.79USD"}
                </p>
              </div>
            </Button>
            <Button type="button" className={`btn btn-light btn-sm waves-effect waves-light py-2 quick-buy-button ${sellButtonClass}`} onClick={() => {
              dispatch(toggleCurrentModal("quickSell", market));
            }}>
              <div className='text-center'>
                {props.t("Sell")}
                <p style={{ fontSize: "10px" }}>
                  {sellPrice || "22.79USD"}
                </p>
              </div>
            </Button>
          </>
        )}
      </div>
    </Card>
  </>);
}
const mapStateToProps = (state) => {
  return {
    theme: state.Layout.layoutMode,
    highKlinesLoading: state.crypto.klines.loading,
  };
};
export default connect(mapStateToProps, null)(withTranslation()(CryptoCard));