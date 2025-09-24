import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

//import drawer
import ReactDrawer from "react-drawer";
import "react-drawer/lib/react-drawer.css";

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import RightSidebar from "../CommonForBoth/RightSidebar";
import LightDark from "../CommonForBoth/Menus/LightDark";

// import images

//i18n
import { withTranslation } from "react-i18next";

// Redux Store
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  changelayoutMode
} from "../../store/actions";
import PortalEntryPoint from "./PortalEntryPoint";
import { PORTALS } from "common/constants";
import {
  enableFX,
  enableCrypto,
  ENABLE_DARK_MODE,
  ENABLE_GLOBAL_SEARCH
} from "config";
import useWindowDimensions from "hooks/useWindowDimensions";

const Header = props => {
  const { onChangeLayoutMode, onChangePortal } = props;
  const [isClick, setClick] = useState(true);
  const [position] = useState();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const onDrawerClose = () => {
    setOpen(false);
  };
  const {
    width
  } = useWindowDimensions();

  useEffect(() => {
    if (width < 993) {
      dispatch(changeSidebarType("sm", isMobile));
    } else {
      dispatch(changeSidebarType("lg", isMobile));
    }
  }, [width]);

  /*** Sidebar menu icon and default menu set */
  function tToggle() {
    let body = document.body;
    body.classList.toggle("sidebar-enable");
    body.classList.toggle("sidebar-hidden");
    setClick(!isClick);
  }

  return (
    <React.Fragment>
      <PortalEntryPoint />
      <header id="page-topbar">
        <div className="navbar-header shadow-sm"
          style={{
            padding: "0",
          }}
        >
          <div className="d-flex justify-content-between">
            <button
              onClick={() => {
                tToggle();
              }}
              type="button" className="btn btn-sm px-3 font-size-16 header-item" id="vertical-menu-btn">
              {props.layoutMode === "dark" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 12H3" stroke="#ffffff"></path>
                <g stroke="#ffffff">
                  <path d="M22 4H13"></path>
                  <path opacity=".301" d="M22 20H13"></path>
                </g>
                <path d="M7 7l-5 5 5 5" stroke="#ffffff"></path>
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M22 12H3" stroke="#11142d"></path>
                <g stroke="#808191">
                  <path d="M22 4H13"></path>
                  <path opacity=".301" d="M22 20H13"></path>
                </g>
                <path d="M7 7l-5 5 5 5" stroke="#11142d"></path>
              </svg>}
            </button>
            {
              ENABLE_GLOBAL_SEARCH &&
              (
                <form className="app-search d-none d-lg-block">
                  <div className="position-relative">
                    <input type="text" className="form-control" placeholder="Search..." />
                    <button className="btn fs-4 d-flex align-items-center" type="button">
                      <i className="bx bx-search-alt-2 align-middle" />
                    </button>
                  </div>
                </form>
              )
            }
          </div>
          <div className="d-flex">
            {
              enableFX && enableCrypto && (
                <>
                  <div className="my-auto me-2">
                    {props.t("Forex")}
                  </div>
                  <div className="form-check form-switch form-switch-md my-auto">
                    <input type="checkbox" className="form-check-input" id="customSwitchsizemd" checked={/*props.portal === PORTALS.CRYPTO ? true :*/ false} onChange={(e) => {
                      history.replace("/dashboard");
                      onChangePortal(e.target.checked);
                    }} />
                  </div>
                  <div className="my-auto">
                    {props.t("Crypto")}
                  </div>
                </>
              )
            }

            <LanguageDropdown />

            {/* light / dark mode */}
            {/* {ENABLE_DARK_MODE ? <LightDark layoutMode={props["layoutMode"]} onChangeLayoutMode={onChangeLayoutMode} /> : null} */}

            <NotificationDropdown />
            <ProfileMenu />

          </div>
        </div>
      </header>
      <ReactDrawer
        open={open}
        position={position}
        onClose={onDrawerClose}
      >
        <RightSidebar onClose={onDrawerClose} onChangeLayoutMode={onChangeLayoutMode} />
      </ReactDrawer>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  changelayoutMode: PropTypes.func,
  layoutMode: PropTypes.any,
};

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    layoutMode,
    portal
  } = state.Layout;
  return {
    layoutType,
    showRightSidebar,
    leftMenu,
    layoutMode,
    portal
  };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  changelayoutMode,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
