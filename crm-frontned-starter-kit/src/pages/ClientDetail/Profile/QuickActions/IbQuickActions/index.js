import React from "react";
import {
  connect
} from "react-redux";
import { CardBody } from "reactstrap";
import LinkClient from "../LinkClient";
import LinkIb from "../LinkIb";
import UnLinkIb from "../unLinkIb";
import UnLinkClients from "../unLinkClients";
import ConvertToIb from "../ConvertToIb";
import AddSharedAgreement from "../AddSharedAgreement";
import AddMasterAgreement from "../AddMasterAgreement";

const IbQuickActions = (props) => {
  const {
    clientDetails,
    clientId,
    ibAgrementPermissions,
  } = props;
  return (
    <CardBody className="quick-actions-card">
      <p className="quick-actions-heading">IB</p>
      <div className="btn-container">
        {clientDetails.fx?.isIb && <LinkClient clientId={clientId} />}
        <LinkIb
          clientId={clientId}
          isClient={clientDetails.fx?.isClient}
          isIb={clientDetails.fx?.isIb}
          isLead={clientDetails.isLead}
        />
        {clientDetails.parentId?._id && <UnLinkIb
          link={clientDetails.parentId}
          clientId={clientId}
          isLead={clientDetails.isLead}
        />}
        {clientDetails.fx?.isIb && <UnLinkClients clientId={clientId} />}
        {clientDetails.fx?.isIb && ibAgrementPermissions?.create &&
          <>
            <AddSharedAgreement clientId={clientId} />
            <AddMasterAgreement clientId={clientId} />
          </>}
        {!clientDetails.fx?.isIb && (
          <ConvertToIb
            convertToIbDetails={props?.convertToIb}
            id={props?.clientDetails?._id}
            kyc={props?.clientDetails?.stages?.kycApproved}
            isLead={props.clientDetails.isLead}
            isIb={props.clientDetails.fx?.isIb}
          />
        )}
      </div>
    </CardBody>
  );
};

const mapStateToProps = (state) => ({
  ibAgrementPermissions: state.Profile.ibAgrementPermissions || {},
});

export default connect(mapStateToProps, null)(IbQuickActions);