import { useState, useEffect } from "react";
import {
  useSelector, useDispatch
} from "react-redux";
import {
  ButtonGroup, Button,
  Nav, NavItem, NavLink,
  Input,
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";

import { makeOrder } from "../../../store/crypto/orders/actions";
import { showErrorNotification } from "store/general/notifications/actions";
import { fetchWallets } from "store/actions";

import { withTranslation } from "react-i18next";
import CardWrapper from "../../../components/Common/CardWrapper";

import { getAssetImgSrc } from "../../../helpers/assetImgSrc";
import calculateFee from "../../../helpers/calculateFee";

const NewOrder = (props) => {
  const dispatch = useDispatch();
  const [selectedMarket, setSelectedMarket] = useState("ETH/USDT");
  const handleMarketSelect = (value) => {
    setSelectedMarket(value);
    props.handleMarketSelect(value);
  };

  const markets = useSelector(state => state.crypto.markets.markets);
  const wallets = useSelector(state => state.crypto.wallets);
  const feeGroupDetails = useSelector(state => state.Profile.clientData?.tradingFeeId);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);

  const [tradeSide, setTradeSide] = useState("buy");
  const [tradeType, setTradeType] = useState("market");
  const [amount, setAmount] = useState(0);
  const [userSelectedPrice, setUserSelectedPrice] = useState(0);

  const [baseAsset, setBaseAsset] = useState(selectedMarket.split("/")[0]);
  const [quoteAsset, setQuoteAsset] = useState(selectedMarket.split("/")[1]);

  const [baseAssetAmount, setBaseAssetAmount] = useState(0);
  const [quoteAssetAmount, setQuoteAssetAmount] = useState(0);

  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);

  const [currency, setCurrency] = useState(baseAsset);
  const [totalAmount, setTotalAmount] = useState(quoteAssetAmount);
  const [fee, setFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(amount - fee);

  useEffect(() => {
    dispatch(fetchWallets());
  }, []);


  useEffect(() => {
    setBaseAsset(selectedMarket.split("/")[0]);
    setQuoteAsset(selectedMarket.split("/")[1]);
    setBuyPrice(markets.find((market) => market.pairName === selectedMarket)?.buyPrice?.$numberDecimal || 0);
    setSellPrice(markets.find((market) => market.pairName === selectedMarket)?.sellPrice?.$numberDecimal || 0);
  }, [selectedMarket, markets]);

  useEffect(() => {
    setBaseAssetAmount(wallets.wallets.find((wallet) => wallet.asset === baseAsset)?.amount || 0);
    setQuoteAssetAmount(wallets.wallets.find((wallet) => wallet.asset === quoteAsset)?.amount || 0);
  }, [wallets, baseAsset, quoteAsset]);

  useEffect(() => {
    setCurrency(tradeSide === "buy" ? baseAsset : quoteAsset);
  }, [tradeSide, baseAsset, quoteAsset]);

  useEffect(() => {
    setTotalAmount(tradeSide === "buy" ? quoteAssetAmount : baseAssetAmount);
  }, [tradeSide, quoteAssetAmount, baseAssetAmount]);

  useEffect(() => {
    setTotalPrice(tradeSide === "buy" ? amount - fee : amount * sellPrice + fee);
  }, [tradeSide, amount, fee]);

  useEffect(() => {
    setFee(feeGroupDetails ? calculateFee(feeGroupDetails, amount) : 0);
  }, [feeGroupDetails, amount]);

  const handleOrder = () => {
    const market = markets.find(m => m.pairName === selectedMarket);
    let vals = {
      market,
      symbol: selectedMarket,
      orderType: tradeType,
      type: tradeSide,
    };
    let tradePrice = buyPrice;
    if (tradeType === "limit") {
      tradePrice = userSelectedPrice;
      vals = {
        ...vals,
        quoteAmount: userSelectedPrice
      };
    }
    const amountAfterFee = amount;
    if (tradeSide === "buy") {
      if (quoteAssetAmount <= amount * tradePrice)
        return dispatch(showErrorNotification(`You don't have enough ${quoteAsset} to buy.`));
      vals = {
        ...vals,
        baseAmount: amountAfterFee,
        quoteAmount: buyPrice * amount,
      };
    } else { // sell
      if (baseAssetAmount <= amount)
        return dispatch(showErrorNotification(`You don't have enough ${baseAsset} to sell.`));
      vals = {
        ...vals,
        baseAmount: amount,
        quoteAmount: sellPrice * amount,
      };
    }
    dispatch(makeOrder(vals));
  };
  return (
    <CardWrapper className="full-height">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down" className="border">
        <DropdownToggle caret color="white"  className="w-100 text-start form-select">
          <img className="mx-1" src={getAssetImgSrc({ symbol: baseAsset })} width="25" height="25"></img> {selectedMarket}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {markets.map((market) => {
            return <DropdownItem key={market._id}
              onClick={() => handleMarketSelect(market.pairName)}
            >
              <img className="me-2" src={getAssetImgSrc(market.marketId.baseAssetId)} width="25" height="25"></img>
              {market.pairName}
            </DropdownItem>;
          })}
        </DropdownMenu>
      </Dropdown>
      <h5 className="my-3">{props.t("New Order")}</h5>
      <ButtonGroup className="d-flex m-auto">
        <Button color="success" className={tradeSide === "buy" ? "buysell" : ""}
          onClick={() => setTradeSide("buy")}
        >
          {props.t("Buy")}</Button>
        <Button color="danger" className={tradeSide === "sell" ? "buysell" : ""}
          onClick={() => setTradeSide("sell")}
        >
          {props.t("Sell")}</Button>
      </ButtonGroup>
      <Nav tabs className="my-3 justify-content-lg-center">
        <NavItem>
          <NavLink
            href="#"
            className={tradeType === "market" ? "active" : ""}
            onClick={() => {
              setTradeType("market");
            }}
          >
            {props.t("Market")}</NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            href="#"
            className={tradeType === "limit" ? "active" : ""}
            onClick={() => {
              setTradeType("limit");
            }}
          >
            {props.t("Limit")}</NavLink>
        </NavItem>
      </Nav>
      <AvForm
        className="input-group"
        onValidSubmit={() => {
          handleOrder();
        }}
      >
        {
          tradeType === "limit" && <AvField
            name="enteredPrice"
            label={`Price (${quoteAsset})`}
            value={userSelectedPrice}
            className="form-control"
            placeholder="Select a price"
            type="number"
            onChange={(e) => {
              setUserSelectedPrice(e.target.value);
            }}
            onKeyPress={(e) => { if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault(); }}
            required
          />
        }
        <AvField
          name="amount"
          label={`${props.t("Amount")} (${baseAsset})`}
          value={amount}
          className="form-control"
          placeholder={baseAsset}
          type="number"
          errorMessage={"Invalid amount"}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          max={quoteAssetAmount && tradeSide === "buy" ? quoteAssetAmount / buyPrice : baseAssetAmount}
          min="0"
          onKeyPress={(e) => { if (!/^\d*\.?\d*$/.test(e.key)) e.preventDefault(); }}
          required
        />
        <Input type="range" className="form-range mt-3"
          min="0" max={quoteAssetAmount && tradeSide === "buy" ? quoteAssetAmount / buyPrice : baseAssetAmount} step="1"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
        <div className="mt-3 w-100">
          <div className="d-flex justify-content-between">
            <div>
              <span>{props.t("Fee")} </span>
              <span className="small">({currency})</span>
            </div>
            <span>{fee.toString()}</span>
          </div>
          <div className="d-flex justify-content-between">
            <div>
              <span>{props.t("Total")} </span>
              <span className="small">({currency})</span>
            </div>
            <span>{totalPrice}</span>
          </div>
        </div>
        <ButtonGroup className="d-flex justify-contennt-center mt-3 w-100">
          <Button type="submit" disabled={!totalAmount || !wallets.wallets?.some((x) => x?.assetId?.symbol === selectedMarket.split("/")[0])}
            color={tradeSide === "buy" ? "success" : "danger"}
          >
            {tradeSide === "buy" ? "Buy" : "Sell"}</Button>
        </ButtonGroup>
      </AvForm>
      <div>
        <p className="d-flex justify-content-between text-center mt-3">
          {
          }
        </p>
        <p className="d-flex justify-content-between text-center mt-3">
          {
            !wallets.wallets?.some((x) => x?.assetId?.symbol === selectedMarket.split("/")[0])
              ? <span className="w-100">{props.t("No wallet for this market.")}</span>
              : totalAmount
                ? <><span className="d-inline-block text-truncate w-50">{totalAmount}&nbsp;</span><span>{tradeSide === "buy" ? quoteAsset : baseAsset}</span></>
                : <span className="w-100">{props.t("Deposit funds into your account")}</span>
          }
        </p>
      </div>
      <div className="my-3">
        <div className="d-flex justify-content-between">
          <span>{props.t("My Aseets")}</span>
          <span>{props.t("Value")}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>{baseAsset}</span>
          <span className="text-truncate text-end w-50">{baseAssetAmount}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>{quoteAsset}</span>
          <span className="text-truncate text-end w-50">{quoteAssetAmount}</span>
        </div>
      </div>
      <ButtonGroup className="d-flex justify-contennt-center">
        <Button>{props.t("Add/Withdraw Funds")}</Button>
      </ButtonGroup>
    </CardWrapper >
  );
};

export default withTranslation()(NewOrder);