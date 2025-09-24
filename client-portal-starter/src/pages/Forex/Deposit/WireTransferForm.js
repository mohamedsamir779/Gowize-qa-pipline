import CardHeader from "components/Forex/Common/CardHeader";
import { useTranslation } from "react-i18next";
import {
  Button, Col, Form, FormGroup, Input, Label, Row 
} from "reactstrap";

function WireTransferForm() {
  const { t } = useTranslation();
  return ( <>
    <CardHeader title={t("Payment")}></CardHeader>
    <div>
      <Form className="mt-3">
        <Row>
          <Col xs={6} className="mb-3">
            <FormGroup>
              <Label for="bankName">
                {t("Bank Name")}
              </Label>
              <Input
                id="bankName"
                name="bankName"
                placeholder="Select Bank Name"
                type="select"
                className="form-select"
              />
            </FormGroup>
          </Col>
          <Col xs={6} className="mb-3">
            <FormGroup>
              <Label for="Currency">
                {t("Currency")}
              </Label>
              <Input
                id="Currency"
                name="Currency"
                placeholder="Select Currency"
                type="select"
                className="form-select"
              />
            </FormGroup>
          </Col>
          <Col xs={6} className="mb-3">
            <FormGroup>
              <Label for="accountNo">
                {t("Account No")}
              </Label>
              <Input
                id="accountNo"
                name="accountNo"
                placeholder="Select Account No"
                type="select"
                className="form-select"
              />
            </FormGroup>
          </Col>
          <Col xs={6} className="mb-3">
            <FormGroup>
              <Label for="amount">
                {t("Amount(USD)")}
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
              />
            </FormGroup>
          </Col>
          <Col xs={6} className="mb-3">
            <FormGroup>
              <Label for="receiptNumber">
                {t("Bank Receipt Number")}
              </Label>
              <Input
                id="receiptNumber"
                name="receiptNumber"
                type="number"
              />
            </FormGroup>
          </Col>
          <Col xs={6} className="mb-3">
            <FormGroup>
              <Label for="notes">
                {t("Notes")}
              </Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Notes"
                type="text"
              />
            </FormGroup>
          </Col>
        </Row>
        <div className="d-flex">
          <Button className="btn-light w-lg">
            <i className=" bx bx-cloud-upload me-2"></i>
            {t("Upload")}
          </Button>
        </div>
        <div className="text-center pt-3">
          <Button className="blue-gradient-color w-lg">
            {t("Make Payment")}
          </Button>
        </div>
      </Form>
    </div>
  </> );
}

export default WireTransferForm;