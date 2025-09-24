import Loader from "components/Common/Loader";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Row,
  Input,
  Label,
  Container,
  Button,
  Card,
  CardTitle,
  CardBody,
  Spinner,
} from "reactstrap";
import { editProfileSettingsStart } from "store/actions";
import * as rdd from "react-device-detect";
import { subscribeUserToPush, unsubscribeFromPushNotification } from "serviceWorkerRegistration";
import { subscribePushNotification, unsubscribePushNotifications } from "store/subscriptions/actions";

function PushNotificationSettings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCheckAllNotifications, setIsCheckAllNotifications] = useState(false);
  const [isCheckNotifications, setIsCheckNotifications] = useState([]);

  const {
    settings,
    settingsLoading,
    subscriptionLoading,
    loading,
  } = useSelector(
    (state) => ({
      settings: state.Profile.settings,
      loading: state.Profile.loading,
      settingsLoading: state.Profile.settingsLoading,
      subscriptionLoading: state.subscriptionsReducer.loading,
    })
  );
  const allNotifications = [];

  settings?.pushNotifications && settings?.pushNotifications.map((notifKey, notifIndex) => {
    if (settings?.pushNotifications[notifIndex].enabled) {
      allNotifications.push(`settings.pushNotifications.${notifIndex}.enabled`);
    }
    settings?.pushNotifications[notifIndex] && notifKey.actions.map((actionKey, actionIndex) => {
      if (settings?.pushNotifications[notifIndex].actions[actionIndex].enabled) {
        allNotifications.push({ name: `settings.pushNotifications.${notifIndex}.actions.${actionIndex}.enabled` });
      }
    });
  });

  useEffect(() => {
    const checkedNotifs = [];
    settings?.pushNotifications && settings?.pushNotifications.map((notifKey, notifIndex) => {
      if (settings?.pushNotifications[notifIndex].enabled) {
        checkedNotifs.push(`settings.pushNotifications.${notifIndex}.enabled`);
      }
      settings?.pushNotifications[notifIndex] && notifKey.actions.map((actionKey, actionIndex) => {
        if (settings?.pushNotifications[notifIndex].actions[actionIndex].enabled) {
          checkedNotifs.push(`settings.pushNotifications.${notifIndex}.actions.${actionIndex}.enabled`);
        }
      });
    });
    setIsCheckNotifications([...checkedNotifs]);
  }, [settings?.pushNotifications]);

  const handleNotificationClick = e => {
    const { name, checked } = e.target;
    let name2 = "";
    let x = name.split(".");
    if (x.length > 3 && checked) {
      name2 = `${x[0]}.${x[1]}.enabled`;
      setIsCheckNotifications([...isCheckNotifications, name, name2]);
    }
    if (!checked) {
      setIsCheckNotifications(isCheckNotifications.filter(item => item !== name));
      if (name2 !== "") {
        setIsCheckNotifications(isCheckNotifications.filter(item => item !== name2));
      }
    }
  };

  const handlePushNotificationUpdate = () => {
    let values = {};
    // assigning checked and unchecked check boxes before submitting
    settings?.pushNotifications && settings?.pushNotifications.map((notifKey, notifIndex) => {
      if (isCheckNotifications.includes(`settings.pushNotifications.${notifIndex}.enabled`)) {
        settings.pushNotifications[notifIndex].enabled = true;
      } else {
        settings.pushNotifications[notifIndex].enabled = false;
      }
      settings?.pushNotifications[notifIndex] && notifKey.actions.map((actionKey, actionIndex) => {
        if (isCheckNotifications.includes(`settings.pushNotifications.${notifIndex}.actions.${actionIndex}.enabled`)) {
          settings.pushNotifications[notifIndex].actions[actionIndex].enabled = true;
        } else {
          settings.pushNotifications[notifIndex].actions[actionIndex].enabled = false;
        }
      });
    });
    values.settings = {
      pushNotifications: [
        ...settings.pushNotifications
      ]
    };
    dispatch(editProfileSettingsStart(values));
  };

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
    <Card>
      <CardTitle className="p-3">
        <div className="d-flex flex-row mt-4">
          <h4 className="mb-4 me-4">
            {t("Push Notifications")} *
          </h4>
          <div className="my-auto">
            {getEnableDisableButton(subAndSaveSubscription, subscriptionLoading)}
          </div>
        </div>
      </CardTitle>
      <CardBody className="pt-0">
        <div>
          {(loading) && <Loader />}
          {(!settings?.pushNotifications && !loading) && (
            <div className="text-center p-4">
              <h4 className="color-primary">
                {t("No notification settings configured, please contact admin.")}
              </h4>
            </div>
          )}
          {
            settings?.pushNotifications && settings?.pushNotifications.map((notifKey, notifIndex) => (
              <Container key={notifIndex} className="p-4">
                <Row >
                  <Col xs={12} sm={8} md={6} lg={5}>
                    <span className="font-size-18 mb-3 me-4">{_.startCase(notifKey.key)}</span>
                  </Col>
                  <Col xs={12} sm={3} md={5} lg={3}>
                    <Input
                      type="checkbox"
                      id={`settings.pushNotifications.${notifIndex}.enabled`}
                      name={`settings.pushNotifications.${notifIndex}.enabled`}
                      switch="none"
                      onChange={handleNotificationClick}
                      checked={isCheckNotifications.includes(`settings.pushNotifications.${notifIndex}.enabled`)}
                    />
                    <Label
                      className="me-1"
                      htmlFor={`settings.pushNotifications.${notifIndex}.enabled`}
                      data-on-label="On"
                      data-off-label="Off">
                    </Label>
                  </Col>
                </Row>
                {settings?.pushNotifications[notifIndex] && notifKey.actions.map((notificationAction, notificationActionInd) =>
                  <Row className="m-2" key={notificationActionInd}>
                    <Col xs={12} sm={9} md={7} lg={6}>
                      <span className="font-size-14 mb-3 me-4">{_.startCase(notificationAction.action.toLowerCase())}</span>
                    </Col>
                    <Col xs={12} sm={3} md={5} lg={2}>
                      <Input
                        type="checkbox"
                        name={`settings.pushNotifications.${notifIndex}.actions.${notificationActionInd}.enabled`}
                        id={`settings.pushNotifications.${notifIndex}.actions.${notificationActionInd}.enabled`}
                        switch="none"
                        onChange={handleNotificationClick}
                        checked={isCheckNotifications.includes(`settings.pushNotifications.${notifIndex}.actions.${notificationActionInd}.enabled`)}
                      />
                      <Label
                        className="me-1"
                        htmlFor={`settings.pushNotifications.${notifIndex}.actions.${notificationActionInd}.enabled`}
                        data-on-label="On"
                        data-off-label="Off">
                      </Label>
                    </Col>
                  </Row>
                )}
              </Container>
            ))
          }
        </div>
        <div>
          * {<i>{t("These notifications are subject to the role you are assigned")}</i>}
        </div>
        <Button type="button" onClick={(e) => {
          e.preventDefault();
          handlePushNotificationUpdate();
          return false;
        }} className="border-0 color-bg-btn w-100 mt-2">
          {settingsLoading && <Loader />}
          {!settingsLoading && t("Update Push Notification Settings")}
        </Button>
      </CardBody>
    </Card>
  );
}

export default PushNotificationSettings;