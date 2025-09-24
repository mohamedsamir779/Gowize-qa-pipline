import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { 
  Container, Input, Row, Col, Label 
} from "reactstrap";
import Select from "react-select";
import moment from "moment";

import { withTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";
import { fetchMarkets } from "../../../../store/actions";
import CustomSelect from "components/Common/CustomSelect";
import { getAssetImgSrc } from "helpers/assetImgSrc";

function OrderFilter(props) {
  const dispatch = useDispatch();
  const [type, setType] = useState();
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [side, setSide] = useState();
  const [status, setStatus] = useState();
  const [selectedMarket, setSelectedMarket] = useState();
  const [markets, setMarkets] = useState();
  const {
    markets: m,
    wallets,
  } = props;

  const marketOptions = props.markets.map((market) => {
    return (
      {
        value: market.marketId?.pairName,
        label: market.marketId?.pairName,
        image: market.marketId?.baseAssetId ? getAssetImgSrc(market.marketId?.baseAssetId) : ""
      }
    );
  });

  const typeOptions = [
    {
      label: "Market",
      value: "market"
    },
    {
      label: "Limit",
      value: "limit"
    }
  ];

  const statusOptions = [
    {
      label: "Initialized",
      value: "initialized"
    },
    {
      label: "Open",
      value: "open"
    },
    {
      label: "Cloased",
      value: "cloased"
    },
    {
      label: "Rejected",
      value: "rejected"
    }
  ];

  const sideOptions = [
    {
      label: "Sell",
      value: "sell"
    },
    {
      label: "Buy",
      value: "buy"
    }
  ];

  useEffect(() => {
    props.filterHandler({
      type,
      fromDate,
      toDate,
      status,
      side,
      selectedMarket
    });

  }, [type, fromDate, toDate, side, status, selectedMarket]);

  useEffect(() => {
    if (!markets || markets.length === 0)
      dispatch(fetchMarkets({ markupId: "aas23e2weq" }));
  }, []);

  useEffect(() => {
    if (wallets) {
      let filtered = wallets ? m.filter((market) => {
        if (wallets.find((x) => x?.assetId?.symbol === market?.pairName.split("/")[0])) {
          return market;
        }
      }) : m;
      setMarkets(filtered);
    }
  }, [wallets, m]);
  
  return (
    <>
      <CardWrapper className="mb-2">
        <Container>
          <h4 className="mb-4">
            {props.t("Filter by")}
          </h4>
          <Row className="mb-2">
            {/* type */}
            <Col>
              <Label>{props.t("Type")}</Label>
              <Select
                isClearable={true}
                isSearchable={true}
                options={typeOptions}
                onChange={(e) => {setType(e?.value)}}
              />
            </Col>

            {/* status */}
            <Col>
              <Label>{props.t("Status")}</Label>
              <Select
                isClearable={true}
                isSearchable={true}
                options={statusOptions}
                onChange={(e) => {setStatus(e?.value)}}
              />
            </Col>

            {/* side */}
            <Col>
              <Label>{props.t("Side")}</Label>
              <Select
                isClearable={true}
                isSearchable={true}
                options={sideOptions}
                onChange={(e) => {setSide(e?.value)}}
              />
            </Col>

            {/* market */}
            <Col>
              <Label>{props.t("Market")}</Label>
              <div>
                <CustomSelect
                  isClearable={true}
                  isSearchable={true}
                  options={marketOptions}
                  onChange={(e) => {
                    setSelectedMarket(e?.value);
                  }}
                />
              </div>
            </Col>
          </Row>

          <Row>
            {/* fromDate */}
            <Col>
              <Label>{props.t("From Date")}</Label>
              <Input
                className="form-control"
                type="date"
                id="toDate"
                placeholder={props.t("From date")}
                onChange={(e) => {setFromDate(e.target.value)}}
                max={toDate ? moment(toDate).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
              />
            </Col>

            {/* toDate */}
            <Col>
              <Label>{props.t("To Date")}</Label>
              <Input
                className="form-control"
                type="date"
                id="toDate"
                placeholder={props.t("To date")}
                onChange={(e) => {setToDate(e.target.value)}}
                max={moment().format("YYYY-MM-DD")}
                min={fromDate && moment(fromDate).format("YYYY-MM-DD")}
              />
            </Col>
          </Row>
        </Container>
      </CardWrapper>
    </>
  );
}

const mapStateToProps = (state) => ({
  withdrawalGateWays: state.crypto.historyReducer.withdrawalGateWays,
  marketsLoading: state.crypto.markets.loading || false,
  markets: state.crypto.markets.markets || [],
  orderBooks: state.crypto.orderBooks.orderBooks || [],
  wallets: state.crypto.wallets.wallets
});

export default connect(mapStateToProps, null)(withTranslation()(OrderFilter)); 