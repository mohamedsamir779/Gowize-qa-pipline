import React from "react";
import { Button, Container } from "reactstrap";
import {
  connect,
} from "react-redux";
import MetaTags from "react-meta-tags";
import { withTranslation } from "react-i18next";

import CardWrapper from "../../../components/Common/CardWrapper";
import * as content from "content";

function Referral(props) {
  const getRefferalLink = () => {
    return `${content.cpUrl}/register/crypto/live?rec=${props.Profile.clientData && props.Profile.clientData.recordId}`;
  };
  return (
    <>
      <div className="referral page-content">
        <MetaTags>
          <title>{props.t("Referral")}</title>
        </MetaTags>
        <Container>
          <h1 className="mb-3 mt-5">{props.t("Your Referral")}</h1>
          <CardWrapper className='mb-5'>
            <p className="mb-3 fs-5">{props.t("Invite your friends to Exinitic and Earn 5$")}</p>
            <Button type="button" className="btn btn-sm btn-success w-lg waves-effect waves-light mt-3">{props.t("Your Referral Link")}</Button>
            <div className="mt-3 border p-4 d-flex align-items-center justify-content-between rounded">
              <div>
                {getRefferalLink()}
              </div>
              <div className="cursor-pointer" onClick={()=>{
                navigator.clipboard.writeText(getRefferalLink());
              }}>
                <i className="mdi mdi-file-document-multiple-outline"></i>
              </div>
            </div>
          </CardWrapper>
          <h1 className="mb-3">{props.t("Rewards")}</h1>
          <CardWrapper className='mb-5'>
            <p className="fs-4">
              {props.t("Total Rewards")}
            </p>
            <div className="d-flex pb-4">
              <span className="fs-1 me-3">
                {props.Profile.clientData.totalRewards} USDT
              </span>
              <span className="rewards-usdt-badge">{props.t("USDT")}</span>
            </div>
            <div className="py-4 d-flex align-items-center justify-content-between border-bottom border-top">
              <div>
                <p className="fs-4">
                  {props.t("Invite Rewards")}
                </p>
                <p>
                  {props.t("Earn 5$ of the trading fees your referrals pay")}
                </p>
              </div>
              <div>
                {props.Profile.clientData.totalRewards} USDT
              </div>
            </div>
            <div className="py-4 d-flex align-items-center justify-content-between">
              <div className="fs-4">
                {props.t("Total Invited")}
              </div>
              <div>
                {props.Profile.clientData.totalInvited}
              </div>
            </div>
          </CardWrapper>
        </Container>
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    Profile: state.Profile
  };
};
export default connect(mapStateToProps, null)(withTranslation()(Referral)); 