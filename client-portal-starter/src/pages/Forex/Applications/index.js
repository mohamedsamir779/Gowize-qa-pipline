import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import React from "react";
import {
  Col, Container, Row,
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import { useSelector } from "react-redux";
import GeneratePDF from "./generatePDF";
import PreviewPDF from "./PreviewPDF";

function Applications() {
  const { t } = useTranslation();
  const { fx: { isIb, isClient }, isCorporate } = useSelector((state) => state.Profile.clientData);
  const aplicationTitles = [];
  if (isCorporate && isClient)
    aplicationTitles.push({
      title: "Corporate Application",
      isIb: false
    });
  else if (!isCorporate && isClient)
    aplicationTitles.push({
      title: "Individual Application",
      isIb: false
    });
  if (isCorporate && isIb)
    aplicationTitles.push({
      title: "Corporate IB Application",
      isIb: true
    });
  else if (!isCorporate && isIb)
    aplicationTitles.push({
      title: "Broker Application",
      isIb: true
    });
  return (
    <>
      <div className="page-content">
        <MetaTags>
          <title>{t("Applications")}</title>
        </MetaTags>
        <Container className="mt-5">
          <PageHeader title="My Applications" />
          <CardWrapper className="mt-5 px-5 py-4 glass-card shadow">
            <Row>
              <Col className="d-flex justify-content-between">
                <h3 className="color-primary">{t("My Applications")}</h3>
              </Col>
            </Row>
            {
              aplicationTitles.map((app, index) =>
                <div key={index} className="mt-3 pb-3 d-flex border-bottom justify-content-between align-items-center">
                  <span className="me-auto">{app.title}</span>
                  <PreviewPDF heading={app.title} isIb={app.isIb} />
                  <GeneratePDF heading={app.title} isIb={app.isIb} />
                </div>
              )
            }
          </CardWrapper>
        </Container>
      </div>
    </>
  );
}

export default Applications;