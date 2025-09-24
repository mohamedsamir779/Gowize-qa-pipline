import { useEffect, useState } from "react";
import {
  Col, Container, Row,
} from "reactstrap";
import CryptoCard from "../../../components/Common/CryptoCard";
import Widgets from "../../../components/Common/Widgets";
import {
  useDispatch, connect
} from "react-redux";
import { fetchMarkets, fetchWallets } from "../../../store/actions";
import MetaTags from "react-meta-tags";
//i18n
import { withTranslation } from "react-i18next";
import { fetchHighKlines } from "store/actions";
import CustomDropDown from "components/Common/CustomDropDown";
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

function QuickBuy(props) {
  const dispatch = useDispatch();
  const [markets, setMarkets] = useState([]);
  const {
    markets: m,
    marketsLoading,
    wallets,
  } = props;

  useEffect(() => {
    if (!markets || markets.length === 0)
      dispatch(fetchMarkets({ markupId: "aas23e2weq" }));
    if (!wallets || wallets.length === 0)
      dispatch(fetchWallets());
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

  return (<>
    <div className='page-content quick-buy'>
      <MetaTags>
        <title>{props.t("Quick Buy")}</title>
      </MetaTags>
      <Container>
        <div className="mt-5">
          <h1 className='mb-3'>
            {props.t("Buy and sell cryptocurrencies in a click!")}
          </h1>
          <Widgets tabs={["Core Assets", "Top Gainers", "Top Losers"]} >
            <Row className="mb-4">
              <div className="d-flex justify-content-between">
                <Col xs={4}>
                  <form className="quickbuy-search">
                    <div className="position-relative">
                      <input type="text" className="form-control" placeholder={props.t("Search") + "..."} />
                      <button className="btn fs-4 d-flex align-items-center" type="button">
                        <i className="bx bx-search-alt-2 align-middle" />
                      </button>
                    </div>
                  </form>
                </Col>
                <div>
                  <CustomDropDown  dropdownItems={dropdownItems}
                    handleClick={(item)=>{
                      dispatch(fetchHighKlines(item.value));
                    }}
                    defaultValue={dropdownItems[0].title}>

                  </CustomDropDown>
                </div>                
              </div>
            </Row>
            {marketsLoading && <Loader/>}
            {!marketsLoading && (
              <Row>
                {
                  markets.map((market, index) => (
                    <Col key={index} md={6} lg={3}>
                      <CryptoCard
                        market={market}
                        colors={{
                          strokeColor: "rgba(255, 167, 52,1)",
                          chartColor: "rgba(255, 167, 52, 0.5)"
                        }}
                        cryptoDetails={{
                          iconSrc: `images/logo/${market ? market.pairName.split("/")[0] : "BTC"}.svg`,
                          coinTitle: `${market.pairName}`,
                          precent: market?.percentage,
                          marketCap: market?.close.$numberDecimal ? market.close.$numberDecimal : market.close,
                        }}>
                      </CryptoCard>
                    </Col>
                  ))
                }
              </Row>
            )}
          </Widgets>
        </div>
      </Container>
    </div>
  </>);
}

const mapStateToProps = (state) => ({
  marketsLoading: state.crypto.markets.loading || false,
  markets: state.crypto.markets.markets || [],
  orderBooks: state.crypto.orderBooks.orderBooks || [],
  wallets: state.crypto.wallets.wallets,
});
export default connect(mapStateToProps, null)(withTranslation()(QuickBuy)); 