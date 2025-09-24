import PropTypes from "prop-types";
import React, { useCallback, useEffect } from "react";
import { withRouter } from "react-router-dom";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
} from "../../store/actions";
import { fetchDictionaryStart } from "store/dictionary/actions";
// eslint-disable-next-line object-curly-newline
import { connect, useSelector, useDispatch } from "react-redux";

// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

import * as content from "content";
import useWindowDimensions from "hooks/useWindowDimensions";

const Layout = (props) => {
  const dispatch = useDispatch();

  const {
    isPreloader,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    leftSideBarTheme,
    layoutMode,
    layoutType,
    leftSidebarTypes,
  } = useSelector((state) => ({
    isPreloader: state.Layout.isPreloader,
    leftSideBarType: state.Layout.leftSideBarType,
    layoutWidth: state.Layout.layoutWidth,
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
    layoutMode: state.Layout.layoutMode,
    layoutType: state.Layout.layoutType,
    leftSidebarTypes: state.Layout.leftSidebarTypes,
  }));

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const { width } = useWindowDimensions();

  const toggleMenuCallback = () => {
    if (leftSideBarType === "default") {
      dispatch(changeSidebarType("condensed", isMobile));
    } else if (leftSideBarType === "condensed") {
      dispatch(changeSidebarType("default", isMobile));
    }
  };

  /*
  layout  settings
  */

  useEffect(() => {
    if (isPreloader === true) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        if (document && document.getElementById("preloader")) {
          document.getElementById("preloader").style.display = "none";
          document.getElementById("status").style.display = "none";
        }
      }, 2500);
    } else {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("status").style.display = "none";
    }
  }, [isPreloader]);

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchDictionaryStart());
  }, []);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
  }, [dispatch]);

  useEffect(() => {
    if (leftSideBarTheme) {
      dispatch(changeSidebarTheme(leftSideBarTheme));
    }
  }, [leftSideBarTheme, dispatch]);

  useEffect(() => {
    if (layoutMode) {
      dispatch(changelayoutMode(layoutMode));
    }
  }, [layoutMode, dispatch]);

  useEffect(() => {
    if (leftSidebarTypes) {
      dispatch(changeSidebarType(leftSidebarTypes));
    }
  }, [leftSidebarTypes, dispatch]);

  useEffect(() => {
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (width < 993) {
      dispatch(changeSidebarType("sm", isMobile));
    } else {
      dispatch(changeSidebarType("lg", isMobile));
    }
  }, [leftSideBarType, dispatch, isMobile]);

  useEffect(() => {
    if (topbarTheme) {
      dispatch(changeTopbarTheme(topbarTheme));
    }
  }, [topbarTheme, dispatch]);

  /*
  call dark/light mode
  */
  const onChangeLayoutMode = (value) => {
    if (changelayoutMode) {
      dispatch(changelayoutMode(value, layoutType));
    }
  };

  const SidebarCallback = useCallback((props) => <Sidebar {...props} />, []);

  useEffect(() => {
    const title = props.location.pathname;
    let currentpage = title.charAt(1).toUpperCase() + title.slice(2);

    document.title = `${currentpage} | CRM Forex - ${content.clientName}`;
  }, [props.location.pathname]);

  return (
    <React.Fragment>
      <div id="preloader">
        <div id="status">
          <div className="spinner-chase">
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
            <div className="chase-dot" />
          </div>
        </div>
      </div>

      <div id="layout-wrapper">
        <Header
          toggleMenuCallback={toggleMenuCallback}
          onChangeLayoutMode={onChangeLayoutMode}
        />
        <SidebarCallback
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
        />
        <div className="main-content">{props.children}</div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

Layout.propTypes = {
  changeLayoutWidth: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  children: PropTypes.object,
  isPreloader: PropTypes.any,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
  changelayoutMode: PropTypes.func,
};

const mapStateToProps = (state) => {
  return { ...state.Layout };
};

export default connect(mapStateToProps, {
  changelayoutMode,
})(withRouter(Layout));
