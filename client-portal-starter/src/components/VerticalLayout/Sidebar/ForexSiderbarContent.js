import PropTypes from "prop-types";
// eslint-disable-next-line object-curly-newline
import React, { useEffect, useRef, useState } from "react";
import { getIbRequestStatus, toggleCurrentModal } from "store/actions";
// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { JClickHandler } from "components/Journey/handlers";
import * as content from "content";
import menuList from "./forexSidebar";
import classNames from "classnames";
import { getIbDashboardSummary } from "apis/forex/ib";
import { CUSTOMER_SUB_PORTALS } from "common/constants";

const MenuItem = ({ key, item, t }) => {
  return (
    <React.Fragment key={"_menu_" + key}>
      <li
        className={classNames("mx-auto", {
          "mm-active": item?.link === window.location.pathname,
        })}
      >
        <Link to={item?.link}>
          <i >{item.icon}</i>
          <span>{t(item.title)}</span>
        </Link>
      </li>
    </React.Fragment>
  );
};

const SubMenuItem = ({ key, item, t }) => {
  const [subMenuActive, setSubMenuActive] = useState(false);
  const [onHover, setOnHover] = useState(false);
  const toggle = () => setSubMenuActive(!subMenuActive);
  const isDropdownActive =
    item?.subMenu?.findIndex((subItem) => {
      return subItem?.link === window.location.pathname;
    }) > -1;
  return (
    <React.Fragment key={"_submenu_" + key}>
      <li
        className={classNames({
          "mm-active": subMenuActive || isDropdownActive,
        })}
        style={onHover ? { position: "static" } : { position: "relative" }}
        onMouseEnter={() => setOnHover(true)}
        onClick={toggle}
      >
        <Link
          to="#"
          className={classNames("has-arrow", {
            "mm-collapse": !(subMenuActive || isDropdownActive),
          })}
          aria-expanded={false}
        >
          <i >{item.icon}</i>
          <span>{t(item?.title)}</span>
        </Link>
        <ul
          className={classNames(
            "sub-menu",
            { "mm-collapse": !(subMenuActive || isDropdownActive) },
            { "mm-show": subMenuActive || isDropdownActive }
          )}
        >
          {item?.subMenu?.map((subItem, index) => {
            return (
              <li
                key={"_subitem_" + index}
                className={classNames({
                  "mm-active": subItem?.link === window.location.pathname,
                })}
              >
                <Link
                  to={subItem?.link}
                  className={classNames({
                    active: subItem?.link === window.location.pathname,
                  })}
                >
                  <i >{subItem?.icon}</i>
                  <span>{t(subItem?.title)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </li>
    </React.Fragment>
  );
};

const ForexSidebarContent = (props) => {
  const dispatch = useDispatch();

  const ref = useRef();
  const { clientData } = useSelector((state) => state.Profile);
  const { partnershipStatus } = useSelector((state) => ({
    partnershipStatus: state.forex.requests.partnership.status,
  }));
  const { subPortal, layoutMode, portal } = useSelector((state) => ({
    subPortal: state.Layout.subPortal,
    portal: state.Layout.portal,
    layoutMode: state.Layout.layoutMode,
  }));
  const { stages } = clientData;
  const { ibMT5Acc } = useSelector((state) => state.Profile.clientData.fx);
  const [ibAllowTranscation, setIbAllowTransaction] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState({
    label: `MT5${ibMT5Acc?.length > 0 ? ` (${ibMT5Acc[0]})` : ""}`,
    value: "MT5",
  });
  const [state, setState] = useState({
    loading: false,
  });

  useEffect(()=>{
    setIbAllowTransaction((state?.live >= 5));
  }, [state]);
  
  useEffect(() => {
    dispatch(getIbRequestStatus());
  }, []);
  //Get IB Live Accounts
  
  useEffect(() => {
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
      getSummary();
    }
  }, [selectedPlatform]);


  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div
          id="sidebar-menu"
          style={{
            overflow: "hidden",
          }}
        >
          <div className="navbar-brand-box">
            <Link to="/dashboard" className="logo-container">
              <span className="logo-big">
                <img src={
                  layoutMode === "light" ? content.mainLogo : content.darkLogo
                } alt="" style={{width: "75px"}} />
              </span>
              <span className="logo-sm">
                <img src={
                  layoutMode === "dark" ? content.mainLogo : content.mainLogo
                } alt="" />
              </span>
            </Link>
          </div>
          <ul className="metismenu list-unstyled" id="side-menu">
            {menuList(portal, subPortal, clientData, ibAllowTranscation, {
              partnershipStatus,
            }, layoutMode)
              .filter((item) => item)
              .map((item, key) => {
                if (item?.onClick) {
                  return (
                    <li key={key} className="mx-auto">
                      <Link
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          JClickHandler(
                            item.onClick,
                            stages,
                            dispatch,
                            toggleCurrentModal,
                            subPortal,
                            portal,
                          )();
                        }}
                      >
                        {item?.icon && (
                          <i>
                            {item.icon}
                          </i>
                        )}
                        <span>{props.t(item?.title)}</span>
                      </Link>
                    </li>
                  );
                }
                if ((item?.link && item?.link !== "#") || !item?.hasSubMenu) {
                  return <MenuItem key={key} item={item} t={props.t} />;
                }
                return <SubMenuItem key={key} item={item} t={props.t} />;
              })}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

ForexSidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(ForexSidebarContent));
