import React, { useEffect, useState } from "react";
// eslint-disable-next-line object-curly-newline
import { Button, Col, Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import MetaTags from "react-meta-tags";

// import { fetchWallets, toggleCurrentModal } from "src/store/actions";
//i18n
import { withTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";
import CustomTable from "components/Common/CustomTable";
import { getAssetImgSrc } from "helpers/assetImgSrc";
import { fetchWallets, toggleCurrentModal } from "store/actions";
import Loader from "components/Common/Loader";
import { JClickHandler } from "components/Journey/handlers";
import { CUSTOMER_SUB_PORTALS } from "common/constants";
import { getIbDashboardSummary } from "apis/forex/ib";
function Wallet(props) {
  const dispatch = useDispatch();
  const { wallets, loading } = useSelector((state) => state?.walletReducer);
  const { clientData } = useSelector((state) => state?.Profile);
  const { subPortal, portal } = useSelector((state) => ({
    subPortal: state.Layout.subPortal,
    portal: state.Layout.portal,
  }));
  const { ibMT5Acc } = useSelector((state) => state.Profile.clientData.fx);
  const [selectedPlatform, setSelectedPlatform] = useState({
    label: `MT5${ibMT5Acc?.length > 0 ? ` (${ibMT5Acc[0]})` : ""}`,
    value: "MT5",
  });
  const [state, setState] = useState({
    loading: false,
  });

  const loadWallets = () => {
    dispatch(fetchWallets());
  };
  useEffect(() => {
    loadWallets({
      isCrypto: false,
      isInventory: false,
    });
  }, []);

  if (subPortal === CUSTOMER_SUB_PORTALS.IB ){
    const getSummary = async () => {
      setState({
        ...state,
        loading: true,
      });
      const result = await getIbDashboardSummary({
        platform: selectedPlatform.value,
      });
      if (result.status)
        setState({
          ...state,
          loading: false,
          ...result.result,
        });
      else
        setState({
          ...state,
          loading: false,
        });
      };
        useEffect(() => {
          getSummary();
        }, [selectedPlatform]);
        
  }
  const filteredWallets = (subPortal != CUSTOMER_SUB_PORTALS.IB) 
      ? wallets?.filter((wallet) => !wallet?.isCrypto && !wallet?.isInventory && !wallet?.isIb)
      : wallets?.filter((wallet) => !wallet?.isCrypto && !wallet?.isInventory && wallet?.isIb); 
      
  const walletWithBalance = () => {
    const wallet = filteredWallets?.find((wallet) => {wallet?.amount > 0});
    if (!wallet && filteredWallets?.length) {
      return filteredWallets[0];
    }
    return wallet;
  };

  const columns = [
    {
      text: props.t("Asset"),
      formatter: (val) => {
        return (
          <div className="balances__company">
            <div className="balances__logo">
              <img src={getAssetImgSrc(val.assetId)} alt="" />
            </div>
            <div className="balances__text">{val.asset}</div>
          </div>
        );
      },
    },
    {
      text: props.t("Available Balance"),
      formatter: (val) => (
        <>
          <div className="balances__number">{val.amount?.toFixed(2)}</div>
        </>
      ),
    },
    {
      text: props.t("Total Balance"),
      formatter: (val) => (
        <>
          <div className="balances__number">{`${(
            parseFloat(val.freezeAmount) + parseFloat(val.amount)
          )?.toFixed(2)}`}</div>
        </>
      ),
    },
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
            <CardWrapper className="mb-5 total-balance glass-card shadow">
              {loading ? (
                <Loader />
              ) : (
                <>
                  {!filteredWallets?.length ? (
                    <div className="text-center">{props.t("No data")}</div>
                  ) : (
                    <>
                      <Row className="align-items-center justify-content-between">
                        <Col lg={4}>
                          <div className="wallets__total">
                            <div className="wallets__title h6">
                              {props.t("Total Balance")}
                            </div>
                            <div className="total-balance-container">
                              <div className="wallets__number h3">
                                {(
                                  parseFloat(walletWithBalance().freezeAmount) +
                                  parseFloat(walletWithBalance().amount)
                                )?.toFixed(2)}
                              </div>
                              {/* <img src="img/logo/bitcoin.png" alt="bitcoinlogo"></img> */}
                            </div>
                            <div className="balance-price">
                              {walletWithBalance().amount?.toFixed(2)}{" "}
                              {walletWithBalance()?.asset}
                            </div>
                          </div>
                        </Col>
                        <Col lg={7} className="wallet-btns">
                          <Button disabled={(subPortal === CUSTOMER_SUB_PORTALS.IB && state?.live <= 4)}  
                            type="button" 
                            className='btn-danger w-lg' 
                            onClick={() => { JClickHandler("fiatWithdraw", clientData?.stages, dispatch, toggleCurrentModal, subPortal === CUSTOMER_SUB_PORTALS.IB /*portal,  true*/)() }}
                            >
                            {props.t("Withdraw")}
                          </Button>
                          <Button type="button" 
                            className='btn-success w-lg' 
                            onClick={() => { JClickHandler("fiatDeposit", clientData?.stages, dispatch, toggleCurrentModal, subPortal === CUSTOMER_SUB_PORTALS.IB /* portal, portal*/)() }}
                          >
                            {props.t("Deposit")}
                          </Button>
                          <Button type="button" disabled={(subPortal === CUSTOMER_SUB_PORTALS.IB && state?.live <= 4)}
                            className='color-bg-btn border-0 w-lg' 
                            onClick={() => { JClickHandler("Transfer", clientData?.stages, dispatch, toggleCurrentModal, subPortal === CUSTOMER_SUB_PORTALS.IB /*portal, portal*/)() }}
                          >
                            {props.t("Internal Transfer")}
                          </Button>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
            </CardWrapper>
            <h1 className="mb-3">{props.t("Asset Balances")}</h1>
            <CardWrapper className="mb-5 glass-card shadow">
              <CustomTable
                columns={columns}
                rows={filteredWallets}
              ></CustomTable>
            </CardWrapper>
          </div>
        </div>
      </Container>
    </div>
  );
}
export default withTranslation()(Wallet);
