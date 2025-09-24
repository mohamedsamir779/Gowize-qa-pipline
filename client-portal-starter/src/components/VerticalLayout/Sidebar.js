import PropTypes from "prop-types";
import React from "react";
import { connect, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import bgImg from "../../assets/images/bg/1.png";

//i18n
import { withTranslation } from "react-i18next";
import { PORTALS } from "common/constants";
import CryptoSidebarContent from "./CryptoSidebarContent";
import ForexSideBarContent from "./Sidebar/ForexSiderbarContent";

const Sidebar = props => {
  const { layoutMode } = useSelector(state => state.Layout);
  const backgroundImage = layoutMode === "dark" ? bgImg : undefined;
  return (
    <React.Fragment>
      <div className="vertical-menu shadow-sm" style={
        {
          zIndex: 99,
          ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}),
        }
      } >
        <div data-simplebar className="h-100">
          <ForexSideBarContent />
          {/* {props.portal === PORTALS.CRYPTO ? <CryptoSidebarContent /> : <ForexSideBarContent />} */}
        </div>
      </div>
    </React.Fragment>
  );
};

Sidebar.propTypes = {
  type: PropTypes.string,
};

const mapStatetoProps = state => {
  return {
    layout: state.Layout,
  };
};
export default connect(
  mapStatetoProps,
  {}
)(withRouter(withTranslation()(Sidebar)));
