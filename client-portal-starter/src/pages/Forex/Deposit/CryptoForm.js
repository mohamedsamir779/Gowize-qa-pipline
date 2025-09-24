import CardHeader from "components/Forex/Common/CardHeader";
import { useTranslation } from "react-i18next";
import {
  Button, Col, Form, FormGroup, Input, Label, Row 
} from "reactstrap";

function CryptoForm() {
  const { t } = useTranslation();
  return ( <>
    <CardHeader title={t("Payment")}></CardHeader>
    <div>
      <Form className="mt-3">
        <Row>
          <Col xs={12} md={4} className="mb-3">
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
          <Col xs={12} md={4} className="mb-3">
            <FormGroup>
              <Label for="amount">
                {t("Amount")}
              </Label>
              <Input
                id="amount"
                name="amount"
                placeholder="Amount"
                type="number"
              />
            </FormGroup>
          </Col>
          <Col xs={12} md={4} className="mb-3">
            <FormGroup>
              <Label for="walletAddress">
                {t("Wallet Address")}
              </Label>
              <Input
                id="walletAddress"
                name="walletAddress"
                placeholder="Wallet Address"
                type="text"
              />
            </FormGroup>
          </Col>
        </Row>
        <div className="text-center pt-3">
          <Button className="blue-gradient-color w-lg">
            {t("Make Payment")}
          </Button>
        </div>
      </Form>
    </div>
  </> );
}

export default CryptoForm;