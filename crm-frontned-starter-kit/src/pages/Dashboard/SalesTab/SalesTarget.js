import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Card, CardBody, CardTitle, CardSubtitle, Row, Col
} from "reactstrap";
import { getTarget } from "apis/users";

import ProgresBarTooltip from "components/Common/ProgressBarToolTip";

const SalesTargetStats = () => {
  const { t } = useTranslation();
  const [target, setTarget] = useState(null);

  useEffect(async () => {
    // eslint-disable-next-line no-console
    setTarget(await getTarget().catch((err) => console.error(err)));
  }, []);

  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody className="">
          <CardTitle className="color-primary">{t("Sales Target")}</CardTitle>
          <CardSubtitle className="mb-3 color-primary">
            {t("Sales Target Stats")}
          </CardSubtitle>
          <Row className="fw-bold mb-3 justify-content-center px-md-4 color-primary">
            <Col xs="2">{t("Name")}</Col>
            <Col className="text-truncate">{t("Money In")}</Col>
            <Col>{t("Accounts")}</Col>
            <Col className="text-truncate">{t("IB Accounts")}</Col>
            <Col>{t("Volume")}</Col>
            <Col className="text-truncate text-center">{t("Money Out")}</Col>
            <Col className="text-center">{t("Total")}</Col>
          </Row>
          {target?.docs?.length > 0
            ? target?.docs?.map((item) =>
              <Row key={item._id} className="mt-3 align-items-center justify-content-center px-md-4">
                <Col xs="2" >
                  <div className="text-truncate" >
                    {`${item.userId.firstName} ${item.userId.lastName}`}
                  </div>
                </Col>
                <Col className="mt-2 mt-md-0">
                  <ProgresBarTooltip
                    achieved={item.achievedDeposits}
                    target={item?.fx.deposit}
                  />
                </Col>
                <Col className="mt-2 mt-md-0">
                  <ProgresBarTooltip
                    achieved={item.monthlyClients}
                    target={item?.accounts}
                  />
                </Col>
                <Col className="mt-2 mt-md-0">
                  <ProgresBarTooltip
                    achieved={item.monthlyIbs}
                    target={item?.ibAccounts}
                  />
                </Col>
                <Col className="mt-2 mt-md-0">
                  <ProgresBarTooltip
                    achieved={item.achievedVolume}
                    target={item?.volume}
                  />
                </Col>
                <Col className="mt-1 mt-md-0 text-center">{item.achievedWithdrawals}</Col>
                <Col className="mt-1 mt-md-0 text-center">{item.achievedDeposits - item.achievedWithdrawals}</Col>
              </Row>
            )
            : <Col className="text-center">{t("No targets found")}</Col>
          }
        </CardBody>
      </Card>
    </React.Fragment >
  );
};

export default SalesTargetStats;