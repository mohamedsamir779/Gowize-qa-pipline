import { useEffect, useState } from "react";
import { unsubscribe } from "apis/campaign";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  Alert,
  Card, Col, Container, Row
} from "reactstrap";
import * as content from "content";
import Loader from "components/Common/Loader";

const CampaignUnsubscribe = () => {
  const { t } = useTranslation();
  const params = new URLSearchParams(useLocation().search);
  const email = params.get("email");
  const [result, setResult] = useState(null);
  useEffect(async () => {
    setResult(await unsubscribe({ email: email }) || {});
  }, []);

  return (
    <>
      <MetaTags>
        <title>{t("Unsubscribe")} | {content.clientName}</title>
      </MetaTags>
      <Container>
        <Row>
          <Col md={6} lg={5} style={{ margin: "5rem auto" }}>
            <Card className="p-4 card-shadow">
              <Link to="/dashboard" className="auth-logo text-center mb-3">
                <img src={content.mainLogo} alt="" height="28" /> <span className="logo-txt">{content.clientName}</span>
              </Link>
              {!result ?
                <Loader />
                :
                <Alert color={result.status ? "success" : "danger"}>
                  {result.message}
                </Alert>}
              <p>{t("Go back to the")} <Link to="/dashboard" className="">{t("dashboard")}</Link></p>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CampaignUnsubscribe;
