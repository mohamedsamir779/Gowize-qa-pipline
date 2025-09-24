import React from "react";
import LatestActivities from "./LatestActivities";
import WalletCard from "./WalletCard";
import { Col, Container } from "reactstrap";
import { withTranslation } from "react-i18next";

const RightContent = props => {
  return (
    <Col xs={12} xl={3} className="right-col pt-5">
      <Container className='balance-card'>
        <WalletCard history={props.history}/>
        <h5 className='d-flex justify-content-between mb-4'>{props.t("Latest Activities")} <i className='bx bx-dots-horizontal-rounded'></i>
        </h5>
        <LatestActivities />
      </Container>
    </Col>
  );
};
export default withTranslation()(RightContent); 