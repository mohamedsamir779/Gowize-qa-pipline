import moment from "moment-timezone";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { markNotificationRead } from "store/actions";


const NotificationDropdownItem = ({ notification }) => {
  const dispatch = useDispatch();

  const markAsRead = () => {
    dispatch(markNotificationRead({
      notificationIds: [notification._id]
    }));
  };
  return (
    <Link
      className="text-reset notification-item"
      to={notification?.data?.crmClickUrl || ""}
      onClick={markAsRead}
    >
      <div className="d-flex">
        {
          notification.icon ? (
            <img
              className="me-3 rounded-circle avatar-sm"
              src={notification.icon}
              alt=""
            />
          ) : (
            <div className="avatar-xs me-3">
              <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                <i className="font-size-16 bx bx-notification" />
              </span>
            </div>
          )
        }
        <div className="flex-grow-1">
          <h6 className="mb-1">{notification.title}</h6>
          <div className="font-size-12 text-muted">
            <p className="mb-1">{notification.body}</p>
            <p className="mb-0">
              <i className="mdi mdi-clock-outline" /> {moment(notification.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationDropdownItem;