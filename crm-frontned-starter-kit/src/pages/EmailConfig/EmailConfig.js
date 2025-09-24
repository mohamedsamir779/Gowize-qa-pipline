/* eslint-disable indent */
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
// eslint-disable-next-line object-curly-newline
import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { emailConfigs } from "./configs";
import { useDispatch, useSelector } from "react-redux";
import {
  changeActiveEmailConfigurationStart,
  fetchEmailConfiguration,
  saveEmailConfigurationStart,
  testEmailConfigurationStart,
} from "store/systemEmailConfig/actions";
import NotificationsForm from "./NotificationsForm";

export default function EmailConfig() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState(0);

  const toggleTab = (tab) => setCurrentTab(tab);
  const CurrentComponent = emailConfigs[currentTab].component;

  const { currentProvider, loading } = useSelector(
    (state) => state.systemEmailConfigReducer
  );

  useEffect(() => {
    dispatch(fetchEmailConfiguration());
  }, []);

  return (
    <React.Fragment>
      <MetaTags>
        <title>{t("Email Settings")}</title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2 className="color-primary">{t("Email Settings")}</h2>
          {
            <>
              <Row>
                <Col className="col-12">
                  <Card>
                    <CardTitle className="p-3">
                      <h4 className="card-title color-primary">{t("Email Configuration")}</h4>
                    </CardTitle>
                    <CardBody>
                      <Row className="px-5 py-2">
                        <Col md={3}>
                          <div className="my-3 mx-5 mx-md-2 mx-xl-5">
                            {emailConfigs.map((config, index) => (
                              <Card
                                key={index}
                                className={`mx-3 py-1 text-center ${
                                  currentTab === index
                                    ? "border-primary"
                                    : "border-info-subtle"
                                }`}
                                onClick={() => toggleTab(index)}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <h4 className="card-title color-primary">
                                  {t(config.title)}
                                </h4>
                              </Card>
                            ))}
                          </div>
                        </Col>
                        <Col md={6}>
                          <div>
                            {CurrentComponent && (
                              <CurrentComponent
                                submitHandler={(values, type) => {
                                  if (type === "save") {
                                    dispatch(
                                      saveEmailConfigurationStart({
                                        ...values,
                                        type: emailConfigs[currentTab].title,
                                      })
                                    );
                                  } else if (type === "test") {
                                    dispatch(
                                      testEmailConfigurationStart({
                                        ...values,
                                        type: emailConfigs[currentTab].title,
                                        isTest: true,
                                      })
                                    );
                                  } else if (type === "active") {
                                    dispatch(
                                      changeActiveEmailConfigurationStart({
                                        ...values,
                                        type: emailConfigs[currentTab].title,
                                        isActivate: true,
                                      })
                                    );
                                  }
                                }}
                              />
                            )}
                          </div>
                        </Col>
                        <Col md={3}>
                          <div className="border-info-subtle my-3 p-2">
                            {!loading &&
                            (!currentProvider || currentProvider === "") ? (
                              <Card className="p-2 border-danger">
                                <h4 className="text-center">
                                  {t("No Provider Configured")}
                                </h4>
                                {/* Show message that you're not able to send messages */}
                                <h6 className="text-center">
                                  {t("Please configure a provider")}
                                </h6>
                              </Card>
                            ) : (
                              <Card className="p-2 p-md-0 p-xl-2">
                                <h4 className="text-center">
                                  {"Current Provider:"}
                                </h4>
                                <h5 className="text-center">
                                  {t(currentProvider)}
                                </h5>
                              </Card>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          }
          <NotificationsForm t={t} />
        </div>
      </div>
    </React.Fragment>
  );
}
