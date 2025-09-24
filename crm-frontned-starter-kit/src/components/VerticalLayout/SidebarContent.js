import PropTypes from "prop-types";
import React, { 
  useEffect, 
  useRef, 
  useCallback, 
  useState 
} from "react";
import { connect, useSelector } from "react-redux";
//Import Icons
import FeatherIcon from "feather-icons-react";
// //Import Scrollbar
import SimpleBar from "simplebar-react";

//i18n
import { withTranslation } from "react-i18next";

// MetisMenu
import MetisMenu from "metismenujs";
import {
  withRouter, Link, useLocation
} from "react-router-dom";

import SidebarMenuItems from "./SideBarMenuItems";

let uploadedMenuItems = {};
let uploadedSubMenuItems = {};

const SidebarContent = (props) => {
  const ref = useRef();
  let matchingMenuItem = null;
  const [menuList, setMenu] = useState(
    SidebarMenuItems.loadMenus(props.t, props.userProfile).filter(
      (menu) => menu.visibility
    ) || []
  );
  const [loadedMenuItems, setMenuItemCount] = useState(0);
  const [currentPath, ] = useState(useLocation().pathname.split("/")[1]);
  const { layoutMode } = useSelector(state => state.Layout);

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
      const ul = document.getElementById("side-menu");
      const items = ul.getElementsByTagName("a");
      for (let i = 0; i < items.length; ++i) {
        if (pathName === items[i].pathname) {
          matchingMenuItem = items[i];
          break;
        }
      }
    };
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

  const MenuSubComponents = useCallback(
    ({ subMenuLinkRef, subMenuItem, index }) => {
      return (
        <li key={`submenu#${index}`}>
          <Link
            ref={(el) => (subMenuLinkRef.current[index] = el)}
            to={subMenuItem.menuItemLink}
            className={subMenuItem.className}
          >
            {subMenuItem.menuItemName}
          </Link>
        </li>
      );
    }
  );

  const MenuComponents = useCallback(({ menuItem, index }) => {
    const menuLinkRef = useRef([]);
    const subMenuLinkRef = useRef([]);
    useEffect(() => {
      if (menuLinkRef && menuLinkRef.current) {
        menuLinkRef.current.forEach((menuLink) => {
          uploadedMenuItems[menuLink.pathname] = menuLink;
        });
      }
    }, [menuLinkRef]);

    useEffect(() => {
      if (subMenuLinkRef && subMenuLinkRef.current) {
        subMenuLinkRef.current.forEach((menuLink) => {
          uploadedSubMenuItems[menuLink.pathname] = menuLink;
        });
      }
    }, [subMenuLinkRef]);

    return (
      <li key={`menu#${index}`}>
        <Link
          ref={(el) => (menuLinkRef.current[index] = el)}
          to={menuItem.menuItemLink}
          className={`${menuItem.className} ${currentPath === menuItem.menuItemLink.split("/")[1] ? "mm-active" : ""}`}
        >
          <FeatherIcon color="#F89622" icon={menuItem.menuItemIcon} style={{
            color: layoutMode === "dark" ? "#F89622" : "",
          }} />
          <span>{menuItem.menuItemName}</span>
        </Link>
        {menuItem.hasSubMenus ? (
          <ul className="sub-menu">
            {(menuItem.subMenus || [])
              .filter((subMenu) => subMenu.visibility)
              .map((subMenuItem, i) => (
                <MenuSubComponents
                  key={i}
                  subMenuItem={subMenuItem}
                  index={i}
                  subMenuLinkRef={subMenuLinkRef}
                />
              ))}
          </ul>
        ) : null}
      </li>
    );
  });

  useEffect(() => {
    if (Object.keys(uploadedMenuItems).length == menuList.length) {
      new MetisMenu("#side-menu");

      setTimeout(() => {
        const pathName = props.location.pathname;

        Object.keys(uploadedSubMenuItems).forEach((key) => {
          const menuLinkRef = uploadedSubMenuItems[key];
          if (pathName == menuLinkRef.pathname) {
            matchingMenuItem = menuLinkRef;
            activateParentDropdown(matchingMenuItem);
          }
        });
      }, 0);
    }
  }, [loadedMenuItems]);

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>
            {SidebarMenuItems.loadMenus(props.t, props.userProfile)
              .filter((menu) => menu.visibility)
              .map((menuItem, index) => (
                <MenuComponents
                  key={`menu#comp#${index}`}
                  menuItem={menuItem}
                  index={index}
                />
              ))}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};
const mapStateToProps = (state) => ({
  userProfile: state.Profile,
});
export default withTranslation()(
  withRouter(connect(mapStateToProps, null)(SidebarContent))
);
