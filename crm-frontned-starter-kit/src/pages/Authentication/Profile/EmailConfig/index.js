import React from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { emailConfigs } from "./configs";
import { useDispatch } from "react-redux";
import {
  changeActiveUserEmailConfigurationStart,
  saveUserEmailConfigurationStart,
  testUserEmailConfigurationStart
} from "store/actions";

export default function EmailConfig({ userId }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = React.useState(0);

  const toggleTab = tab => setCurrentTab(tab);
  const CurrentComponent = emailConfigs[currentTab].component;

  return (
    <Card>
      <CardTitle className="p-3">
        <h4>{t("Email Configuration")}</h4>
      </CardTitle>
      <CardBody className="pt-0">
        {
          emailConfigs.map((config, index) => (
            <Card key={index} className={`d-inline-block me-3 mb-0 px-3 py-1  ${currentTab === index ? "border-primary" : "border-info-subtle"}`}
              onClick={() => toggleTab(index)}
              style={{
                cursor: "pointer",
              }}
            >
              <h4 className="card-title">{t(config.title)}</h4>
            </Card>
          ))
        }
        <div>
          {CurrentComponent && <CurrentComponent submitHandler={(values, type) => {
            if (type === "save") {
              dispatch(saveUserEmailConfigurationStart({
                ...values,
                userId,
                type: emailConfigs[currentTab].title
              }));
            } else if (type === "test") {
              dispatch(testUserEmailConfigurationStart({
                ...values,
                userId,
                type: emailConfigs[currentTab].title,
                isTest: true
              }));
            } else if (type === "active") {
              dispatch(changeActiveUserEmailConfigurationStart({
                ...values,
                userId,
                type: emailConfigs[currentTab].title,
                isActivate: true
              }));
            }
          }} />}
        </div>
      </CardBody>
    </Card>
  );
}