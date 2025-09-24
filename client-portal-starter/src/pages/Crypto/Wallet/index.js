import React, { useEffect, useState } from "react";
import BigNumber from "bignumber.js";
import CustomTable from "../../../components/Common/CustomTable";
import CardWrapper from "../../../components/Common/CardWrapper";
import {
  Button, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";

import { fetchWallets, toggleCurrentModal } from "../../../store/actions";
//i18n
import { withTranslation } from "react-i18next";
import { getAssetImgSrc } from "../../../helpers/assetImgSrc";

const TradeDropDown = (props)=> {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [marketsRelated, setMarketRelated] = useState([]);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const dispatch = useDispatch();
  const { markets } = useSelector(state=>state.crypto.markets);

  useEffect(()=>{
    const found = markets.filter((market)=>(market.marketId?.baseAsset === props.wallet.asset
       || market.marketId?.quoteAsset === props.wallet.asset));
    setMarketRelated(found);
  }, [props.wallet]);

  return   <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="end">
    <DropdownToggle color="primary" caret>
      Trade
    </DropdownToggle>
    <DropdownMenu className="dropdown-menu-end">
      {marketsRelated.map((market, index)=> {return <DropdownItem key={index} onClick={()=>{
        dispatch(toggleCurrentModal("quickBuy", market));
      }}>
        <img className="me-2" src={getAssetImgSrc(market.marketId.baseAssetId)} width="25" height="25"></img>
        {market.pairName}
      </DropdownItem>;})}
    </DropdownMenu>
  </Dropdown>;
};

function Wallet(props) {
  const dispatch = useDispatch();
  const markets = useSelector(state => state.crypto.markets.markets);
  const wallets = useSelector(state => state.crypto.wallets);
  const convert = useSelector(state=>state.crypto.convert);
  const [, setTotalFiat] = useState({
    usdValue: 0,
    btcValue: 0
  });
  const [, setTotalSpot] = useState({
    usdValue: 0,
    btcValue: 0
  });
  const [totalBalances, setTotalBalances] = useState({
    usdValue: 0,
    btcValue: 0
  });

  const getMarketPrice = (asset) => {
    const marketFound = markets.find((market) => market.pairName === `${asset}/USDT`);
    if (marketFound) {
      const marketPrice = marketFound.marketPrice.$numberDecimal ? marketFound.marketPrice.$numberDecimal : marketFound.marketPrice; 
      return parseFloat(marketPrice);
    } else
      return 1;
  };

  const loadWallets = (page, limit) => {
    dispatch(fetchWallets(
      {
        limit,
        page
      }
    ));
  };
  useEffect(() => {
    loadWallets();
  }, []);
  useEffect(() => {
    if (convert.result === "Successfully converted")
      loadWallets();
  }, [convert.result]);
  // useEffect(() => {
  //     loadWallets(1, sizePerPage)
  // }, [sizePerPage])

  useEffect(() => {
    if (wallets.wallets?.length > 0) {
      let fiat = {
        usdValue: 0,
        btcValue: 0,
      };
      let spot = {};
      for (let index = 0; index < wallets.wallets.length; index++) {
        const element = wallets.wallets[index];
        if (element.isCrypto) {
          spot.usdValue = parseFloat(new BigNumber(spot.usdValue || 0).plus(element.usdValue).toString()).toFixed(4);
          spot.btcValue = parseFloat(new BigNumber(spot.btcValue || 0).plus(element.btcValue).toString()).toFixed(4);
        } else {
          fiat.usdValue = parseFloat(new BigNumber(fiat.usdValue || 0).plus(element.usdValue).toString()).toFixed(4);
          fiat.btcValue = parseFloat(new BigNumber(fiat.btcValue || 0).plus(element.btcValue).toString()).toFixed(4);
        }
      }
      setTotalFiat(fiat);
      setTotalSpot(spot);
      setTotalBalances({
        usdValue: parseFloat(new BigNumber(fiat.usdValue).plus(spot.usdValue)).toFixed(4),
        btcValue: parseFloat(new BigNumber(fiat.btcValue).plus(spot.btcValue)).toFixed(4),
      });
    }
  }, [wallets.wallets]);

  const columns = [
    {
      text: "",
      formatter: () => <i className="bx bx-star"></i>

    },
    {
      text: props.t("Asset"),
      formatter: (val) => {
        return <div className="balances__company">
          <div className="balances__logo">
            <img src={getAssetImgSrc(val.assetId)} alt="" />
          </div>
          <div className="balances__text">{val.asset}</div>
        </div>;},
    },
    // {
    //     text: "Earn",
    //     formatter: (val) => <span className="me-2 bg-success badge badge-secondary p-2 px-4">{val.precentage}</span>
    // },
    {
      text: props.t("On Orders"),
      formatter: (val) => {
        val.marketPrice = getMarketPrice(val.asset);
        return <>
          <div className="balances__number">{val.freezeAmount}</div>
          <div className="balances__price">{(val.marketPrice * val.freezeAmount).toFixed(4)} USDT</div>
        </>;
      }
    },
    {
      text: props.t("Available Balance"),
      formatter: (val) => <>
        <div className="balances__number">{val.amount}</div>
        <div className="balances__price">{(val.marketPrice * val.amount).toFixed(4)} USDT</div>
      </>
    },
    {
      text: props.t("Total Balance"),
      formatter: (val) => <>
        <div className="balances__number">{`${val.freezeAmount + val.amount}`}</div>
        <div className="balances__price">{(val.marketPrice * (val.freezeAmount + val.amount)).toFixed(4)} USDT</div>
      </>
    },
    {
      text:props.t(""),
      formatter:(val) => {
        return <TradeDropDown wallet={val}></TradeDropDown>;
      }
    }
  ];

  return (
    <div className="page-content">
      <MetaTags>
        <title>{props.t("Wallets")}</title>
      </MetaTags>
      <Container>
        <div className="mt-5">
          <div className="wallet-page">
            <h1 className="mb-3">{props.t("Overview")}</h1>
            <CardWrapper className='mb-5 total-balance'>
              <Row className="align-items-center justify-content-between">
                <Col lg={4}>
                  <div className="wallets__total">
                    <div className="wallets__title h6">{props.t("Total Balance")}</div>
                    <div className="total-balance-container">
                      <div className="wallets__number h3">{totalBalances.btcValue}</div>
                      <img src="img/logo/bitcoin.png" alt="bitcoinlogo"></img>
                    </div>
                    <div className="balance-price">{totalBalances.usdValue} {props.t("USD")}</div>
                  </div>
                </Col>
                <Col lg={7} className="wallet-btns">
                  <Button type="button" className='btn-danger w-lg' onClick={() => { dispatch(toggleCurrentModal("selectWithdrawalMethodModal")) }}>{props.t("Withdraw")}</Button>
                  <Button type="button" className='btn-success w-lg' onClick={() => { dispatch(toggleCurrentModal("selectDepositMethodModal")) }}>{props.t("Deposit")}</Button>
                  <Button type="button" className='blue-gradient-color w-lg' onClick={() => { dispatch(toggleCurrentModal("transfer")) }}>{props.t("Convert")}</Button>
                </Col>
              </Row>
            </CardWrapper>
            {/*
          <h1 className="mb-3">{props.t("Account Balances")}</h1>
          <CardWrapper className='mb-5'>
            <Row>
              {/* <Col xl={3} md={6}>
                                <div className="balance-item">
                                    <div className="mb-4">
                                        <div className="balance-item-container">
                                            <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="8" stroke="#6C5DD3" strokeWidth="8" strokeLinecap="round" strokeDasharray="330 149" />
                                            </svg>
                                            <span className="text-muted mb-3 ms-3">Margin</span>
                                        </div>
                                        <div className="text-end">
                                            <h5>0.256567545 BTC</h5>
                                            <div className="text-muted">3,700.96 USD</div>
                                        </div>
                                    </div>
                                    <div className="balance-buttons">
                                        <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal('fiatDeposit')) }}>Deposit</button>
                                        <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal('transfer')) }}>Transfer</button>
                                    </div>
                                </div>
                            </Col> */}
            {/* <Col md={6} xl={3}>
            <div className="balance-item">
              <div className="mb-4">
                <div className="balance-item-container">
                  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" stroke="#3f8cff" strokeWidth="8" strokeLinecap="round" strokeDasharray="330 149" />
                  </svg>
                  <span className="text-muted mb-3 ms-3">{props.t("Fiat")}</span>
                </div>
                <div className="text-end">
                  <h5>{totalFiat.btcValue} {props.t("BTC")}</h5>
                  <div className="text-muted">{totalFiat.usdValue} {props.t("USD")}</div>
                  <div>{0}</div>
                </div>
              </div>
              <div className="balance-buttons">
                <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal("fiatDeposit")) }}>{props.t("Deposit")}</button>
                <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal("transfer")) }}>{props.t("Transfer")}</button>
              </div>
            </div>

          </Col>
          <Col md={6} xl={3}>
            <div className="balance-item">
              <div className="mb-4">
                <div className="balance-item-container">
                  <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" stroke="#f7a23b" strokeWidth="8" strokeLinecap="round" strokeDasharray="330 149" />
                  </svg>
                  <span className="text-muted mb-3 ms-3">{props.t("SPOT")}</span>
                </div>
                <div className="text-end">
                  <h5>{totalSpot.btcValue} BTC</h5>
                  <div className="text-muted">{totalSpot.usdValue} {props.t("USD")}</div>
                  <div>{0}</div>
                </div>
              </div>
              <div className="balance-buttons">
                <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal("fiatDeposit")) }}>{props.t("Deposit")}</button>
                <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal("transfer")) }}>{props.t("Transfer")}</button>
              </div>
            </div>
          </Col> */}
            {/* <Col xl={3} md={6}>
                                <div className="balance-item">
                                    <div className="mb-4">
                                        <div className="balance-item-container">
                                            <svg className="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="8" stroke="#20ab72" strokeWidth="8" strokeLinecap="round" strokeDasharray="330 149" />
                                            </svg>
                                            <span className="text-muted mb-3 ms-3">Futures</span>
                                        </div>
                                        <div className="text-end">
                                            <h5>0.256567545 BTC</h5>
                                            <div className="text-muted">3,700.96 USD</div>
                                        </div>
                                    </div>
                                    <div className="balance-buttons">
                                        <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal('fiatDeposit')) }}>Deposit</button>
                                        <button type="button" className="btn btn-outline-secondary waves-effect btn-rounded btn-sm w-sm" onClick={() => { dispatch(toggleCurrentModal('transfer')) }}>Transfer</button>
                                    </div>
                                </div>
                            </Col> 
            </Row>
          </CardWrapper>
          */}
            <h1 className="mb-3">{props.t("Asset Balances")}</h1>
            <CardWrapper className="mb-5">
              <CustomTable
                columns={columns}
                rows={wallets.wallets}
              ></CustomTable>
              {/* <CustomPagination
                            {...wallets}
                            setSizePerPage={setSizePerPage}
                            sizePerPage={sizePerPage}
                            onChange={loadWallets}
                            docs={wallets.docs}
                        /> */}
              <Button type="button" className='blue-gradient-color w-100' onClick={() => { props.history.push("/quick-buy") }}>{props.t("Quick Buy")}</Button>
            </CardWrapper>
          </div>
        </div>
      </Container>

    </div>
  );
}
export default withTranslation()(Wallet); 