import { getKycStats } from "apis/dashboard";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  Card, CardBody, CardTitle, Row, Col
} from "reactstrap";
const KycStats = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  useEffect(async () => {
    const st = await getKycStats();
    setStatus(st);
  }, []);

  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle className="color-primary">
            <h5 className="color-primary">{t("Kyc Documents")}</h5>
          </CardTitle>
          <Row className="col-card-same-height mt-5">
            <Col sm={6} xs={12} className="justify-content-start">
              <Link className="d-flex align-items-center" to={"/clients?kyc=KYC_UPLOADED"}>
                <div className="circle-stat">
                  {status?.pending ?? 0}
                </div>
                <span>{t("Pending Approval")}</span>
              </Link>
            </Col>
            <Col sm={6} xs={12} className="justify-content-start">
              <Link className="d-flex align-items-center" to={"/clients?kyc=KYC_APPROVED"}>
                <div className="circle-stat">
                  {status?.approved ?? 0}
                </div>
                {t("Approved")}
              </Link>
            </Col>
            <Col sm={6} className="justify-content-start">
              <Link className="d-flex align-items-center" to={"/clients?kyc=KYC_PENDING"}>
                <div className="circle-stat">
                  {status?.noKyc ?? 0}
                </div>
                <div>{t("No Kyc")}</div>
              </Link>
            </Col>
            <Col sm={6} xs={12} className="justify-content-start">
              <Link className="d-flex align-items-center" to={"/clients?kyc=KYC_REJECTED"}>
                <div className="circle-stat">
                  {status?.rejected ?? 0}
                </div>
                <div>{t("Rejected")}</div>
              </Link>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default KycStats;