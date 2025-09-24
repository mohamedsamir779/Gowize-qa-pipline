import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Dropdown, DropdownToggle, DropdownMenu, Row, Col
} from "reactstrap";
import SimpleBar from "simplebar-react";

//Import Icons
import FeatherIcon from "feather-icons-react";

//i18n
import { useTranslation, withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markNotificationRead } from "store/notifications/actions";
import NotificationDropdownItem from "./NotificationDropdownItem";
import TableLoader from "components/Common/Loader";

const NotificationDropdown = props => {
  const { t } = useTranslation();
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const dispatch = useDispatch();
  const {
    notifications,
    totalUnreadNotifications,
    loading,
  } = useSelector(state => ({
    notifications: state.notificationsReducer?.unreadNotifications?.docs || [],
    totalUnreadNotifications: state.notificationsReducer?.unreadNotifications?.totalDocs || 0,
    loading: state.notificationsReducer?.loading || false,
  }));

  useEffect(() => {
    dispatch(fetchNotifications({
      page: 1,
      limit: 10,
      read: false,
    }));
  }, []);

  const markAsRead = () => {
    dispatch(markNotificationRead({
      all: true
    }));
  };

  const { layoutMode } = props;

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <FeatherIcon
            icon="bell"
            className="icon-lg"
            color={layoutMode === "dark" ? "#F89622" : ""}
          />
          {totalUnreadNotifications !== 0 && (
            <span className="badge bg-danger rounded-pill">{totalUnreadNotifications}</span>
          )}
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {t("Notifications")} </h6>
              </Col>
              {
                !loading && totalUnreadNotifications !== 0 && (
                  <div className="col-auto">
                    <Link
                      to="#"
                      className="small"
                      onClick={markAsRead}
                    >
                      {" "}
                      <i className="mdi mdi-read me-1"></i>
                      {" "}
                      {t("Mark all as read")}
                    </Link>
                  </div>
                )
              }
            </Row>
          </div>
          <SimpleBar style={{ height: "300px" }}>
            {
              loading && <TableLoader />
            }
            {
              !loading && totalUnreadNotifications === 0 && (
                <div className="text-center w-100 mt-4">
                  {t("You have read all your notifications!")}
                </div>
              )
            }
            {
              !loading && notifications?.map((notification, key) => (
                <NotificationDropdownItem key={key} notification={notification} />
              ))
            }
          </SimpleBar>
          <div className="p-2 border-top d-grid">
            <Link
              className="btn btn-sm btn-link font-size-14 btn-block text-center"
              to="/notifications"
            >
              <i className="mdi mdi-arrow-right-circle me-1"></i>
              {" "}
              {t("View all")}{" "}
            </Link>
          </div>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
