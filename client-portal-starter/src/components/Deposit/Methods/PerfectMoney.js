import { fetchCompanyBankAccounts } from "apis/bankAccounts";
import { AvField, AvForm } from "availity-reactstrap-validation";
import React, { useEffect, useState } from "react";
import { Label } from "reactstrap";
import CustomSelect from "components/Common/CustomSelect";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

export const payeeAccounts = [
  {
    currency: "USD",
    name: "U23447061"
  },
];

export default function PerfectMoney(props) {
  const {
    // t,
    setIsFirstStepValid
  } = props;
  // const [accountNumbers, setaccountNumbers] = useState([]);
  // const [selectedAccNo, setSelectedAccNo] = useState();
  // const [selectedCurrency, setSelectedCurrency] = useState();
  // const [selectedPayeeName, setSelectedPayeeName] = useState();
  // const [notes, setNotes] = useState();
  // const [amount, setAmount] = useState();
  // useEffect(() => {
  //   if (selectedAccNo && selectedCurrency === "USD" && selectedPayeeName && notes && amount) {
  //     setIsFirstStepValid(true);
  //   } else {
  //     setIsFirstStepValid(false);
  //   }
  // }, [selectedAccNo, selectedCurrency, selectedPayeeName, notes, amount]);
  // const { fx: { liveAcc } } = useSelector((state) => state.Profile.clientData);

  // useEffect(() => {
  //   if (liveAcc) setaccountNumbers([...liveAcc]);
  // }, [liveAcc]);

  useEffect(() => {
    setIsFirstStepValid(true);
  }, []);

  // useEffect(() => {
  //   return () => {
  //     setNotes(null);
  //     setAmount(null);
  //     setSelectedPayeeName(null);
  //     setSelectedCurrency(null);
  //     setSelectedAccNo(null);
  //   };
  // }, []);

  return (
    <div className="my-3">
      {/* <AvForm className="mt-4" onValid={() => setIsFirstStepValid(true)}>
        <h5 className="mb-4">{t("Payment details")}</h5>
        <Row>
          <Col xs={12} lg={6} className="mb-3">
            <div>
              <Label>{t("Payee Account")}</Label>
              <CustomSelect
                name="accountName"
                required
                options={payeeAccounts?.map(({ name }) => {
                  return {
                    label: name,
                    value: name
                  };
                })}
                onChange={(e) => {
                  setSelectedPayeeName(e.value);
                }}
              >
              </CustomSelect>
            </div>

          </Col>
          <Col xs={12} lg={6} className="mb-3">
            <div>
              <Label>{t("Currency")}</Label>
              <CustomSelect
                name="currency"
                required
                options={payeeAccounts?.map(({ currency }) => {
                  return {
                    label: currency,
                    value: currency
                  };
                })}
                onChange={(e) => {
                  setSelectedCurrency(e.value);
                }}
              >
              </CustomSelect>
            </div>
          </Col>
          <Col xs={12} lg={6} className="mb-3">
            <div>

              <Label>{t("Account No")}</Label>
              <CustomSelect
                options={accountNumbers?.map(acc => {
                  return {
                    label: acc,
                    value: acc
                  };
                })}
                name="accountNumber"
                required
                onChange={(e) => {
                  setSelectedAccNo(e.value);
                }}
              // disabled={true}
              >
              </CustomSelect>
            </div>
          </Col>
          <Col xs={12} lg={6} className="mb-3">
            <div>

              <Label>{t("Amount")} (USD)</Label>
              <AvField
                type="number"
                name="amount"
                validate={{
                  required: {
                    value: true,
                    errorMessage: "Amount is required"
                  },
                  min: {
                    value: 1,
                    errorMessage: "Amount should be at least 1$"
                  }
                }}
                onChange={(e) => {
                  setAmount(e.target.value);
                }}
              // disabled={true}
              >
              </AvField>
              <p className="text-danger fst-italic">
                {t("* We only accept Payments in USD")}
              </p>
            </div>

          </Col>
          <Col xs={12} lg={6} className="mb-3">
            <div>
              <Label>{t("Notes")}</Label>
              <AvField
                type="text"
                name="notes"
                validate={{ required: true }}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
              // disabled={true}
              >
              </AvField>
            </div>
          </Col>
        </Row>
      </AvForm> */}
    </div>
  );
}
