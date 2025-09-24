import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  Button,
  Col,
  Container, FormGroup, Input, Label, Row 
} from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import AvFieldSelecvt from "../../../components/Common/AvFieldSelect";

function InternalTransfer() {
  const { t } = useTranslation();
  const [transferDestination, setTransferDestination] = useState("toMyAccount");
  return ( <>
    <MetaTags>
      <title>{t("Internal Transfer")}</title>
    </MetaTags>
    <div className="page-content">
      <Container className="pt-5">
        <PageHeader title="Internal Transfer"></PageHeader>
        <CardWrapper className="mt-4">
          <div className="d-flex justify-content-between heading pb-2">
            <h5>{t("Internal Transfer")}</h5>
            <div className="d-flex">
              <FormGroup check className="my-auto me-3">
                <Input
                  name="toMyAccount"
                  type="radio"
                  checked={transferDestination === "toMyAccount"}
                  onChange={() => {setTransferDestination("toMyAccount")}}
                />
                <Label check>
                  {t("To My Account")}
                </Label>
              </FormGroup>
              <FormGroup check className="my-auto">
                <Input
                  name="toMyAccount"
                  type="radio"
                  checked={transferDestination === "toClientAccount"}
                  onChange={() => {setTransferDestination("toClientAccount")}}
                />
                <Label check>
                  {t("To Client Account")}
                </Label>
              </FormGroup>
            </div>
          </div>
          <AvForm className="custom-form mt-4">
            <Row>
              <Col xs={12} className="mb-3">
                <AvFieldSelecvt 
                  name="fromAccount"
                  label={t("From Account")}
                  className="form-control"
                  placeholder={t("Enter From Account")}
                  type="select"
                  required
                />
              </Col>
              <Col xs={6} className="mb-3">
                <AvField
                  name="toAccount"
                  label={t("To Account")}
                  placeholder={t("Enter To Account")}
                  type="text"
                  errorMessage={t("Enter To Account")}
                  validate={{ required: { value: true } }}
                />
              </Col>
              <Col xs={6} className="mb-3">
                <AvField
                  name="amount"
                  label={t("Amount")}
                  placeholder={t("Enter Amount")}
                  type="number"
                  min="0"
                  errorMessage={t("Enter Amount")}
                  validate={{ required: { value: true } }}
                />
              </Col>
              <Col xs={12} className="mb-3">
                <AvField
                  name="note"
                  label={t("Note")}
                  placeholder={t("Enter Note")}
                  type="text"
                  errorMessage={t("Enter Note")}
                />
              </Col>
            </Row>
            <div className="text-center pt-3">
              <Button className="blue-gradient-color w-lg">
                {t("Transfer")}
              </Button>
            </div>
          </AvForm>
        </CardWrapper>
      </Container>
    </div>
  </> );
}

export default InternalTransfer;