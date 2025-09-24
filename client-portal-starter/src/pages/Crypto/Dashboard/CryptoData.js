import React, { useEffect } from "react";
import Widgets from "../../../components/Common/Widgets";
import CryptoCard from "../../../components/Common/CryptoCard";
import { Col, Row } from "reactstrap";
import {
  connect, useDispatch,
} from "react-redux";
//i18n
import { withTranslation } from "react-i18next";
import { fetchHighKlines, fetchWallets } from "store/actions";
import Loader from "components/Common/Loader";

const dropdownItems = [
  {
    title:"24 hours",
    value:"24h"
  },
  {
    title:"7 days",
    value:"7d" 
  },
  {
    title:"30 days",
    value:"30d" 
  }
];

const CryptoData = (props) => {  
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(fetchWallets());
  }, [fetchWallets]);
  const {
    markets,
    hover,
    wallets
  } = props;
  return (
    <Widgets tabs={["Core Assets", "Top Gainers", "Top Losers", "New"]} 
      dropdownProps={{
        className:"dropdown-end", 
        dropdownItems:dropdownItems,
        handleClick:(item)=>{dispatch(fetchHighKlines(item.value))},
        defaultValue:dropdownItems[0].title
      }}  className="mb-3">
      {!markets && wallets.length == 0 && <Loader/>}
      {markets && wallets && (
        <Row className='d-flex'>
          {
            markets?.map((market, index) => (
              <Col md={6} lg={4} key={index}>
                <CryptoCard
                  hover={hover}
                  isInWallets={wallets.some((x) => x?.assetId?.symbol === market.pairName.split("/")[0])}
                  cryptoFooter={true}
                  colors={{
                    strokeColor: "rgba(255, 167, 52,1)",
                    chartColor: "rgba(255, 167, 52, 0.5)" 
                  }}
                  cryptoDetails={{
                    iconSrc: `images/logo/${market ? market.pairName.split("/")[0] : "BTC"}.svg`,
                    coinTitle: `${market.pairName}`,
                    precent: market?.percentage,
                    marketCap: market?.close?.$numberDecimal ? market.close?.$numberDecimal : market.close,
                  }}
                  history={props.history}>
                </CryptoCard>
              </Col>
            ))
          }
        </Row>
      )}
    </Widgets>
  );
};
const mapStateToProps = (state) => ({
  marketsLoading: state.crypto.markets.loading || false,
  markets: state.crypto.markets.markets || [],
  marketNames: state.crypto.markets.marketNames,
  wallets: state.crypto.wallets.wallets,
});
export default connect(mapStateToProps, null)(withTranslation()(CryptoData)); 