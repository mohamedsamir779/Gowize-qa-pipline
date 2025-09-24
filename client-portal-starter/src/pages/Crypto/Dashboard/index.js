import React, { useState } from "react";
import { connect } from "react-redux";
import MetaTags from "react-meta-tags";
import Widgets from "../../../components/Common/Widgets";
import {
  Col, Container, Row
} from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import CardWrapper from "components/Common/CardWrapper";

import CryptoData from "./CryptoData";
import Slider from "./Slider";
import Journey from "../../../components/Journey";
import RightContent from "./RightContent";
import { withTranslation, useTranslation } from "react-i18next"; 

import Deposit from "./Deposits";
import Withdrawal from "./Withdrawals";
import { getAssetImgSrc } from "helpers/assetImgSrc";

const Dashboard = (props) => {
  const { t } = useTranslation();

  const [showSlider] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const columns = [
    {
      dataField: "",
      text: ""
    },
    {
      text: t("Asset"),
      dataField: "walletId",
      formatter: (item) => <div className="balances__company">
        <div className="balances__logo">
          <img src={getAssetImgSrc(item.walletId?.assetId)} alt="" />
        </div>
        <div className="balances__text">{item?.walletId?.asset ? item.walletId.asset : ""}</div>
      </div>
    },
    {
      text: t("Type"),
      dataField: "type"
    },
    {
      text: t("Date"),
      dataField: "createdAt",
      formatter: (item) => {
        let d = new Date(item.createdAt);
        d = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
        return d;
      }
    },
    {
      text: t("Amount"),
      dataField: "amount",
      formatter: (item) => (
        item.amount && item.amount["$numberDecimal"] ? parseFloat(item.amount["$numberDecimal"]) : parseFloat(item.amount)
      )
    },
    {
      text: t("Status"),
      dataField: "status"
    },
    // {
    //   text: "",
    //   formatter: () => <>
    //     <TableDropDown />
    //   </>
    // }
  ];

  return (
    <React.Fragment>
      <div className="dashboard page-content">
        <div className="container-fluid">
          <MetaTags>
            <title>{props.t("Dashboard")}</title>
          </MetaTags>
          <Row>
            <Col xs={12} xl={9} className="left-col pb-5">
              <Container className="px-3">
                <div className="pt-4">
                  {showSlider && <Slider />}
                  <Journey history={props.history}/>
                  <CryptoData history={props.history} hover={true}/>
                  <Widgets 
                    tabs={["Deposits", "Withdrawals"]} 
                    className="mb-3"
                    setTab = {setActiveTab}
                  >
                    <CardWrapper>
                      {
                        activeTab === 0 && 
                        <Deposit columns={columns} />
                      }
                      {
                        activeTab === 1 && 
                        <Withdrawal columns={columns} />
                      }
                    </CardWrapper>                                 
                  </Widgets>
                </div>
              </Container>
            </Col>
            <RightContent history={props.history} />
          </Row>
        </div>
      </div>
    </React.Fragment >
  );
};

const mapStateToProps = (state) => ({
  marketsLoading: state.crypto.markets.loading || false,
  markets: state.crypto.markets.markets || [],
  marketNames: state.crypto.markets.marketNames,
  profile: state.Profile.clientData
});

export default connect(mapStateToProps, null)(withTranslation()(Dashboard));
