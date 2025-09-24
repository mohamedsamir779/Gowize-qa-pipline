import CardWrapper from "components/Common/CardWrapper";
import Loader from "components/Common/Loader";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Row,
  Input,
  Label,
  Container,
  Button,
} from "reactstrap";
import { updateProfileSettings } from "store/actions";

function NotificationSettings() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isCheckAllNotifications, setIsCheckAllNotifications] = useState(false);
  const [isCheckNotifications, setIsCheckNotifications] = useState([]);

  const {
    clientData,
    settingsLoading,
  } = useSelector(
    (state) => ({
      clientData: state.Profile.clientData,
      settingsLoading: state.Profile.settingsLoading,
    })
  );
  const allNotifications = [];

  clientData?.settings?.pushNotifications && clientData?.settings?.pushNotifications.map((notifKey, notifIndex) => {
    if (clientData?.settings?.pushNotifications[notifIndex].enabled) {
      allNotifications.push(`settings.pushNotifications.${notifIndex}.enabled`);
    }
    clientData?.settings?.pushNotifications[notifIndex] && notifKey.actions.map((actionKey, actionIndex) => {
      if (clientData?.settings?.pushNotifications[notifIndex].actions[actionIndex].enabled) {
        allNotifications.push({ name: `settings.pushNotifications.${notifIndex}.actions.${actionIndex}.enabled` });
      }
    });
  });

  useEffect(() => {
    const checkedNotifs = [];
    clientData?.settings?.pushNotifications && clientData?.settings?.pushNotifications.map((notifKey, notifIndex) => {
      if (clientData?.settings?.pushNotifications[notifIndex].enabled) {
        checkedNotifs.push(`settings.pushNotifications.${notifIndex}.enabled`);
      }
      clientData?.settings?.pushNotifications[notifIndex] && notifKey.actions.map((actionKey, actionIndex) => {
        if (clientData?.settings?.pushNotifications[notifIndex].actions[actionIndex].enabled) {
          checkedNotifs.push(`settings.pushNotifications.${notifIndex}.actions.${actionIndex}.enabled`);
        }
      });
    });
    setIsCheckNotifications([...checkedNotifs]);
  }, [clientData?.settings?.pushNotifications]);

  const handleNotificationClick = e => {
    const { name, checked } = e.target;
    let name2 = "";
    let x = name.split(".");
    if (x.length > 3 && checked) {
      name2 = `${x[0]}.${x[1]}.enabled`;
    }
    setIsCheckNotifications([...isCheckNotifications, name, name2]);
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
    clientData?.settings?.pushNotifications && clientData?.settings?.pushNotifications.map((notifKey, notifIndex) => {
      if (isCheckNotifications.includes(`settings.pushNotifications.${notifIndex}.enabled`)) {
        clientData.settings.pushNotifications[notifIndex].enabled = true;
      } else {
        clientData.settings.pushNotifications[notifIndex].enabled = false;
      }
      clientData?.settings?.pushNotifications[notifIndex] && notifKey.actions.map((actionKey, actionIndex) => {
        if (isCheckNotifications.includes(`settings.pushNotifications.${notifIndex}.actions.${actionIndex}.enabled`)) {
          clientData.settings.pushNotifications[notifIndex].actions[actionIndex].enabled = true;
        } else {
          clientData.settings.pushNotifications[notifIndex].actions[actionIndex].enabled = false;
        }
      });
    });
    values.settings = {
      pushNotifications: [
        ...clientData.settings.pushNotifications
      ]
    };
    dispatch(updateProfileSettings(values));
  };

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {t("Notification Settings")}
        </title>
      </MetaTags>
      <div>
        <CardWrapper className="p-4 glass-card shadow">
          {/* <Row>
            <Col className="d-flex justify-content-between">
              <h3 className="color-primary">{t("Settings")}</h3>
            </Col>
          </Row> */}
          <div className="border rounded-3 mt-4">
            {(!clientData || !clientData?.settings?.pushNotifications) && (
              <div className="text-center p-4">
                <h4 className="color-primary">
                  {t("No notification settings configured, please contact admin.")}
                </h4>
              </div>
            )}
            {
              clientData?.settings?.pushNotifications && clientData?.settings?.pushNotifications.map((notifKey, notifIndex) => (
                <Container key={notifIndex} className="p-4">
                  <Row>
                    <Col lg={3}>
                      <span className="font-size-18 mb-3 me-4">{_.startCase(notifKey.key)}</span>
                    </Col>
                    <Col lg={2}>
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
                  {clientData?.settings?.pushNotifications[notifIndex] && notifKey.actions.map((notificationAction, notificationActionInd) =>
                    <Row className="m-2" key={notificationActionInd}>
                      <Col lg={4}>
                        <span className="font-size-14 mb-3 me-4">{_.startCase(notificationAction.action.toLowerCase())}</span>
                      </Col>
                      <Col lg={2}>
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
          <Button type="button" onClick={(e) => {
            e.preventDefault();
            handlePushNotificationUpdate();
            return false;
          }} className="border-0 color-bg-btn w-100 mt-2">
            {settingsLoading && <Loader />}
            {!settingsLoading && t("Update Push Notification Settings")}
          </Button>
        </CardWrapper>
      </div>
    </React.Fragment>
  );
}

export default NotificationSettings;