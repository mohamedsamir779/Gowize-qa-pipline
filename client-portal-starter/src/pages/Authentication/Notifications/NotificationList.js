import CustomPagination from "components/Common/CustomPagination";
import React, { useEffect, useState } from "react";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
} from "reactstrap";
import { fetchNotifications } from "store/actions";
import { useTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";
import Loader from "components/Common/Loader";

function NotificationList() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const {
    notificationsData,
    loading,
  } = useSelector(
    (state) => ({
      notificationsData: state.notificationsReducer?.notifications || [],
      loading: state.notificationsReducer?.loading || false,
      markReadLoading: state.notificationsReducer?.markReadLoading || false,
    })
  );
  const {
    docs: notifications,
  } = notificationsData;

  const fetchData = (page = 1) => {
    dispatch(fetchNotifications({
      page,
      limit,
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [limit, 1]);

  function dateFormatter(val) {
    let d = new Date(val.createdAt);
    d = `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
    return d;
  }

  function renderNotificationRows() {
    return notifications.map((notification, index) =>
      <tr key={index} className="border-top">
        <td className="text-start">{notification.recordId}</td>
        <td className="text-start">{dateFormatter(notification)}</td>
        <td className="text-start">{notification.title}</td>
        <td className="text-start">{notification.body}</td>
      </tr>
    );
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {t("Notifications")}
        </title>
      </MetaTags>
      <div>
        <CardWrapper className="p-4 glass-card shadow">
          <div className="border rounded-3 mt-4">
            <Table borderless responsive className="text-center mb-0" >
              <thead>
                <tr className="color-primary">
                  <th >{t("Record Id")}</th>
                  <th >{t("Date")}</th>
                  <th >{t("Title")}</th>
                  <th >{t("Message")}</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="100%" className="my-2"><Loader /></td></tr>}
                {!loading && notifications.length === 0 && (
                  <tr><td colSpan="100%" className="my-2">{t("No recent notifications.")}</td></tr>
                )}
                {!loading && notifications.length !== 0 && renderNotificationRows()}
              </tbody>
            </Table>
          </div>
          <div className="mt-4">
            <CustomPagination
              {...notificationsData}
              docs={notifications}
              setSizePerPage={setLimit}
              sizePerPage={limit}
              onChange={fetchData}
            />
          </div>
        </CardWrapper>
      </div>
    </React.Fragment>
  );
}

export default NotificationList;