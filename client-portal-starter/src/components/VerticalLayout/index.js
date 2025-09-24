import PropTypes from "prop-types";
import React, { useEffect } from "react";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  changeTopbarTheme,
  changeLayoutWidth,
  changelayoutMode,
  changePortal,
} from "../../store/actions";
import bgImg2 from "../../assets/images/bg/2.png";
import bgImg3 from "../../assets/images/bg/3.png";
import { PORTALS } from "common/constants";
// Layout Related Components
import Header from "./Header";
import Sidebar from "./Sidebar";

//redux
import { useSelector, useDispatch } from "react-redux";
import Modals from "../Modals/";
import ForexFooter from "./ForexFooter";
import CryptoFooter from "./CryptoFooter";
import useWindowDimensions from "hooks/useWindowDimensions";
const Layout = props => {
  const dispatch = useDispatch();
  const {
    width 
  } = useWindowDimensions();
  const {
    isPreloader,
    layoutWidth,
    leftSideBarType,
    topbarTheme,
    leftSideBarTheme,
    layoutMode,
    layoutType,
    leftSidebarTypes,
    portal,
    subPortal
  } = useSelector(state => ({
    isPreloader: state.Layout.isPreloader,
    leftSideBarType: state.Layout.leftSideBarType,
    layoutWidth: state.Layout.layoutWidth,
    topbarTheme: state.Layout.topbarTheme,
    leftSideBarTheme: state.Layout.leftSideBarTheme,
    layoutMode: state.Layout.layoutMode,
    layoutType: state.Layout.layoutType,
    leftSidebarTypes: state.Layout.leftSidebarTypes,
    portal: state.Layout.portal,
    subPortal: state.Layout.subPortal
  }));

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
    if (isPreloader === true && document.getElementById("preloader")) {
      document.getElementById("preloader").style.display = "block";
      document.getElementById("status").style.display = "block";

      setTimeout(function () {
        if (document.getElementById("preloader")) {
          document.getElementById("preloader").style.display = "none";
          document.getElementById("status").style.display = "none";
        }
      }, 2500);
    } else {
      if (document.getElementById("preloader")) {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }
    }
  }, [isPreloader]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    dispatch(changeLayout("vertical"));
  }, []);

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
    if (layoutWidth) {
      dispatch(changeLayoutWidth(layoutWidth));
    }
  }, [layoutWidth, dispatch]);

  useEffect(() => {
    if (width < 425){
      dispatch(changeSidebarType("sm", isMobile));
    } else if (width < 992){
      dispatch(changeSidebarType("md", isMobile));
    } else {
      dispatch(changeSidebarType("lg", isMobile));
    }
  }, [width]);

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

  const backgroundImage = layoutMode === "dark" ? `url(${bgImg2}), url(${bgImg3})` : undefined;

  const onChangePortal = (value) => {
    localStorage.setItem("PORTAL", PORTALS.FOREX);
    dispatch(changePortal(PORTALS.FOREX));
    // if (value) {
    //   localStorage.setItem("PORTAL", PORTALS.CRYPTO);
    //   dispatch(changePortal(PORTALS.CRYPTO));
    // } else {
    //   localStorage.setItem("PORTAL", PORTALS.FOREX);
    //   dispatch(changePortal(PORTALS.FOREX));
    // }
  };

  return (
    <React.Fragment>
      <div id="" className={/*portal === PORTALS.CRYPTO ? "page" :*/ "forex page"}>
        <Header
          toggleMenuCallback={toggleMenuCallback}
          onChangeLayoutMode={onChangeLayoutMode}
          onChangePortal={onChangePortal}
          subPortal={subPortal}
        />
        <Sidebar
          theme={leftSideBarTheme}
          type={leftSideBarType}
          isMobile={isMobile}
          portal={portal}
          subPortal={subPortal}
        />
        <div className="main-content" style={{
          // backgroundImage: backgroundImage,
          minHeight: "100vh"
        }}>
          <Modals></Modals>
          {props.children}
          {/* {portal === PORTALS.FOREX ? <ForexFooter /> : <CryptoFooter />} */}
          <ForexFooter /> 
        </div>
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


export default Layout;
