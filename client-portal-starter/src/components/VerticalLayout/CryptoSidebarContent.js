import PropTypes from "prop-types";
import React, {
  useEffect, useRef, useCallback 
} from "react";

//Import Icons
import Icofont from "react-icofont";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter, Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const CryptoSidebarContent = props => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const pathName = props.location.pathname;

    const initMenu = () => {
      new MetisMenu("#side-menu");
      let matchingMenuItem = null;
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
      if (matchingMenuItem) {
        activateParentDropdown(matchingMenuItem);
      }
    };
    initMenu();
  }, [props.location.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  });

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/dashboard" className="">
                <svg className="icon icon-home">
                  <use xlinkHref="img/sprite.svg#icon-home"></use>
                </svg>
                <span>{props.t("Dashboard")}</span>
              </Link>
            </li>
            <li>
              <Link to="/wallet" className="">
                <svg className="icon icon-wallet">
                  <use xlinkHref="img/sprite.svg#icon-wallet"></use>
                </svg>
                <span>{props.t("Wallets")}</span>
              </Link>
            </li>

            <li>
              <Link to="/quick-buy" className="">
                <svg className="icon icon-document">
                  <use xlinkHref="img/sprite.svg#icon-document"></use>
                </svg>
                <span>{props.t("Quick Buy")}</span>
              </Link>
            </li>

            <li>
              <Link to="/exchange" className="">
                <svg className="icon icon-chart">
                  <use xlinkHref="img/sprite.svg#icon-chart"></use>
                </svg>
                <span>{props.t("Exchange")}</span>
              </Link>
            </li>

            <li>
              <Link to="/documents" className="">
                <i className="icofont-file-document"></i>
                <span>{props.t("Documents")}</span>
              </Link>
            </li>            
            <li>
              <Link to="/referral" className="">
                <i className="bx bx-fast-forward-circle"/>
                <span>{props.t("Referral")}</span>
              </Link>
            </li>
            <li>
              <Link to="/history" className="">
                <Icofont icon="history" />
                <span>{props.t("History")}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow">
                <svg className="icon icon-settings">
                  <use xlinkHref="img/sprite.svg#icon-settings"></use>
                </svg>
                <span>{props.t("Settings")}</span>
              </Link>
              <ul className="sub-menu">
                <li className="">
                  <Link to="/profile">{props.t("Profile")}</Link>
                </li>
                <li className="">
                  <Link to="/activities">{props.t("Activities")}</Link>
                </li>
                <li className="">
                  <Link to="/bank-account">{props.t("Bank Account")}</Link>
                </li>
                <li className="">
                  <Link to="/two-fa">
                    {props.t("2FA")}
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

CryptoSidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(CryptoSidebarContent));
