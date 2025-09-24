import React from "react";
import { connect } from "react-redux";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import ClientStages from "./Stages";
import IbStages from "./IbStages";
import Activities from "./Activities";
import { useParams } from "react-router-dom";

function Logs(props) {
  const { clientId } = useParams();
  return (
    <>
      {props.fx?.isClient && <ClientStages clientId={clientId}/>}
      {props.fx?.isIb && <IbStages clientId={clientId}/>}
      <Activities clientId={clientId}/>
    </>
  );
}

const mapStateToProps = (state) => ({
  fx: state.clientReducer.clientDetails.fx
});

export default connect(mapStateToProps, null)(withTranslation()(Logs));
