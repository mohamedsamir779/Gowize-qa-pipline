import React, {
  useEffect,
  useRef, useState
} from "react";
import {
  Modal,
  Col,
} from "reactstrap";
import classnames from "classnames";
import { useTranslation, withTranslation } from "react-i18next";
import BuyTab from "./BuyTab";
import SellTab from "./SellTab";
import { useSelector } from "react-redux";

function QuickBuySellModal({ isOpen, toggleOpen, market, type }) {
  const [activeTab1, setactiveTab1] = useState(type);
  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };
  const { loading } = useSelector(state => state.crypto.orders);
  const [, setShowError] = useState(false);
  const [currentMarket, setCurrentMarket] = useState(market);
  const buySubmitButtonRef = useRef(null);
  const sellSubmitButtonRef = useRef(null);
  const { t } = useTranslation();
  useEffect(()=>{
    setCurrentMarket(market);
  }, [market]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggleOpen}
      centered={true}
      className='custom-modal'
    >
      <div className="modal-header">
        <button
          type="button"
          className="close btn btn-soft-dark waves-effect waves-light btn-rounded m-4"
          data-dismiss="modal"
          aria-label="Close"
          onClick={toggleOpen}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        {activeTab1 === "buy" && currentMarket && <BuyTab
          activeTab1={activeTab1}
          toggle1={toggle1}
          setCurrentMarket={setCurrentMarket}
          currentMarket={currentMarket}
          submitButtonRef={buySubmitButtonRef}>
        </BuyTab>}

        {activeTab1 === "sell" && currentMarket && <SellTab 
          activeTab1={activeTab1} 
          toggle1={toggle1}
          currentMarket={currentMarket}
          setCurrentMarket={setCurrentMarket}
          submitButtonRef={sellSubmitButtonRef}>
        </SellTab>}
        
        <Col>
          <div className='modal-nav-tabs mt-3'>
            <button
              type="submit"
              disabled={loading}
              className={classnames({ "btn-outline-success": activeTab1 !== "buy" }, { "btn-success active": activeTab1 === "buy" }, "nav-button btn ")}
              onClick={(e) => {
                if (activeTab1 === "buy") {
                  if (sellSubmitButtonRef)
                    buySubmitButtonRef.current.click();
                } else {
                  e.preventDefault();
                  toggle1("buy");
                  setShowError(false);
                }
              }}>
              {activeTab1 === "buy" ? `Buy ${currentMarket.marketId.baseAsset}` : <>
                <div style={{ fontSize: "10px" }}>{t("Switch To")}</div>
                <div>
                  {t("Buy")}
                </div>
              </>}
            </button>
            <button
              type="submit"
              disabled={loading}
              className={classnames({ "btn-outline-danger": activeTab1 !== "sell" }, { "active btn-danger": activeTab1 === "sell" }, "nav-button btn")}
              onClick={(e) => {
                if (activeTab1 === "sell") {
                  if (sellSubmitButtonRef)
                    sellSubmitButtonRef.current.click();
                } else {
                  e.preventDefault();
                  toggle1("sell");
                  setShowError(false);
                }
              }}>
              {activeTab1 === "sell" ? `Sell ${currentMarket.marketId.baseAsset}` : <>
                <div style={{ fontSize: "10px" }}>{t("Switch To")}</div>
                <div>
                  {t("Sell")}
                </div>
              </>}
            </button>
          </div>
        </Col>
      </div>
    </Modal>
  );
}
export default withTranslation()(QuickBuySellModal);