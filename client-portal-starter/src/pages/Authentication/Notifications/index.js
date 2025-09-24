import React, { useState } from "react";
import { MetaTags } from "react-meta-tags";
import {
  Button,
  Container,
  Spinner
} from "reactstrap";
import { useTranslation } from "react-i18next";
import Widgets from "components/Common/Widgets";
import NotificationList from "./NotificationList";
import NotificationSettings from "./NotificationSettings";
import { useDispatch, useSelector } from "react-redux";
import * as rdd from "react-device-detect";
import { subscribeUserToPush, unsubscribeFromPushNotification } from "serviceWorkerRegistration";
import { subscribePushNotification, unsubscribePushNotifications } from "store/general/subscriptions/actions";

function Notifications() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setTab] = useState(0);

  const {
    subscriptionLoading,
    settings,
  } = useSelector((state) => ({
    subscriptionLoading: state.subscriptionsReducer.loading,
    settings: state.Profile.clientData.settings || {},
  }));

  const getEnableDisableButton = (
    buttonAction = () => { },
    loading = false
  ) => {
    let buttonText = settings.localAndClientPushNotifications ? t("Disable") : t("Enable");
    let buttonClass = settings.localAndClientPushNotifications ? "btn-danger" : "btn-success";
    return (
      <Button
        className={`border-0 mb-4 ${buttonClass}`}
        onClick={buttonAction}
        disabled={loading}
      >
        <i className="bx bx-bell font-size-16 align-middle me-1" />{loading ? <Spinner /> : buttonText}
      </Button>
    );
  };

  const subAndSaveSubscription = async (e) => {
    if (settings.localAndClientPushNotifications) {
      const unsubData = await unsubscribeFromPushNotification();
      dispatch(unsubscribePushNotifications(unsubData.endpoint));
    } else {
      e.preventDefault();
      let subs = await subscribeUserToPush();
      subs = JSON.parse(JSON.stringify(subs));
      const data = {
        endpoint: subs.endpoint,
        expirationTime: subs.expirationTime,
        keys: subs.keys,
        deviceDetails: {
          browserName: rdd?.browserName || "Not Found",
          browserVersion: rdd?.browserVersion || "Not Found",
          deviceType: rdd?.deviceType || "Not Found",
          osName: rdd?.osName || "Not Found",
          osVersion: rdd?.osVersion || "Not Found",
          mobileVendor: rdd?.mobileVendor || "Not Found",
          mobileModel: rdd?.mobileModel || "Not Found",
          userAgent: rdd?.getUA || "Not Found",
          engineName: rdd?.engineName || "Not Found",
          engineVersion: rdd?.engineVersion || "Not Found",
          fullBrowserVersion: rdd?.fullBrowserVersion || "Not Found",
        }
      };
      dispatch(subscribePushNotification(data));
    }
  };

  return (
    <>
      <div className="page-content">
        <MetaTags>
          <title>{t("Notifications")}</title>
        </MetaTags>
        <Container className="mb-5 mt-5">
          <div className="d-flex flex-row">
            <h1 className="mb-4 me-4">
              {t("Push Notifications")}
            </h1>
            <div className="my-auto">
              {getEnableDisableButton(subAndSaveSubscription, subscriptionLoading)}
            </div>
          </div>
          <Widgets
            setTab={setTab}
            tabs={["Notifications List", "Notification Settings"]}
          >
            <Container>
              {activeTab === 0 && <NotificationList />}
              {activeTab === 1 && <NotificationSettings />}
            </Container>
          </Widgets>
        </Container>
      </div>
    </>
  );
}

export default Notifications;