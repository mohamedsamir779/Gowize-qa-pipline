import { AvForm } from "availity-reactstrap-validation";
import React, { useEffect, useState } from "react";
import {
  Col,
  Input,
  Label,
  Row,
  UncontrolledAlert
} from "reactstrap";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

export default function Others({
  t, setIsFirstStepValid, setPaymentPayload
}) {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    return () => {
      setName("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setIsFirstStepValid(false);
    };
  }, []);

  useEffect(() => {
    if (name && cardNumber && expiry && cvc) {
      setIsFirstStepValid(true);
      setPaymentPayload({
        card: {
          cardholderName: name,
          cardNumber,
          expiryMonth: expiry.split("/")[0],
          expiryYear: parseInt(expiry.split("/")[1]),
          cardSecurityCode: cvc,
        }
      });
    } else {
      setIsFirstStepValid(false);
    }
  }, [error]);

  return (
    <>
      <p className="text-muted">{t("Enter card information.")}</p>
      <Row>
        <AvForm>
          <Row>
            <Col xs={12}>
              <div className="mb-3">
                <Label
                  htmlFor="example-date-input"
                  className="form-label"
                >
                  {t("Name")}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  id="example-date-input"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </Col>
            <Col xs={12}>
              <div className="mb-3">
                <Label
                  htmlFor="example-date-input"
                  className="form-label"
                >
                  {t("Card Number")}
                </Label>
                <Input
                  className="form-control"
                  type="text"
                  id="example-date-input"
                  onChange={(e) => {
                    const value = e.target.value;
                    // remove all non-numeric characters, spaces, etc.
                    const cardNumber = value.replace(/\D/g, "");

                    setCardNumber(cardNumber);
                  }}
                  value={cardNumber}
                />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <Label
                  htmlFor="example-date-input"
                  className="form-label"
                >
                  {t("Expiry date")}
                </Label>
                <Input
                  className="form-control"
                  type="month"
                  id="example-date-input"
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    const value = e.target.value;
                    const month = value.split("-")[1];
                    const year = value.split("-")[0];
                    setExpiry(`${month}/${year}`);
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <Label
                  htmlFor="example-date-input"
                  className="form-label"
                >
                  {t("Security Code (CVV)")}
                </Label>
                <Input
                  className="form-control"
                  type="number"
                  maxLength={3}
                  id="example-date-input"
                  onChange={(e) => setCvc(e.target.value)}
                />
              </div>
            </Col>
          </Row>
        </AvForm>
        <div>
          <Cards
            cvc={cvc}
            expiry={expiry && `${(expiry.split("/")[0] + "/" + expiry.split("/")[1].slice(2))}`}
            name={name}
            number={cardNumber}
            preview={false}
            callback={(type, isValid) => {
              if (!isValid) {
                setError(true);
                setErrorMessage("Invalid Card Details");
                return ;
              }
              // date validation
              const month = expiry.split("/")[0];
              const year = expiry.split("/")[1];
              if (new Date(year, month).getTime() < new Date().getTime()) {
                setError(true);
                setErrorMessage("Invalid Expiry Date");
                return;
              }
              // cvc validation
              if (cvc.length < 3 || cvc.length > 4) {
                setError(true);
                setErrorMessage("Invalid CVV");
                return;
              }
              setError(false);
              setErrorMessage("");
            }}
          />
        </div>
        <div>
          {error && (
            <UncontrolledAlert color="danger"  className="my-2 text-center">
              {errorMessage}
            </UncontrolledAlert>
          )}
        </div>
      </Row>
    </>
  );
}
