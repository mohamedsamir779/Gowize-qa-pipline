import { useEffect, useState } from "react";
import React, { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  AvForm, AvField, AvRadioGroup, AvRadio
} from "availity-reactstrap-validation";
import {
  Modal, ModalHeader, ModalBody, Button, Row, Col, Label, Input,
} from "reactstrap";
import Loader from "components/Common/Loader";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import { ACCOUNT_TYPES } from "common/data/trading-account";
import { linkTradingAccount } from "store/tradingAccounts/actions";

const LinkMT5 = ({ show, toggle, customerId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { accountTypes, creating, createCounter } = useSelector((state) => state.tradingAccountReducer);

  const [type, setType] = useState(null);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState([]);
  const [accountCurrency, setSAccountCurrency] = useState([]);

  // filter accounts based on account's type (live/demo)
  useEffect(() => {
    setFilteredAccountTypes(accountTypes?.filter((at) => at.type === type?.toUpperCase() && at.platform === "CTRADER"));
  }, [accountTypes, type]);

  useEffect(()=>{
    show && toggle();
  }, [createCounter]);

  return (
    <>
      <button
        type="button"
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggle}
      >
        {t("Link CTrader")}
      </button>
      <Modal centered isOpen={show} toggle={toggle}>
        <ModalHeader toggle={toggle} tag="h4">
          {t("Link CTrader Account")}
        </ModalHeader>
        <ModalBody>
          <AvForm
            onValidSubmit={(e, v) => {
              v.type = type;
              v.customerId = customerId;
              dispatch(linkTradingAccount(v));
            }}
          >
            <AvField type="text" name="login"
              label={t("Account Login")}
              className="mt-1 mb-2"
              validate={{
                required: {
                  value: true,
                  errorMessage: t("Account login is required"),
                },
              }}
              onKeyPress={(e) => {
                validatePositiveInputs(e);
              }}
            />
            <Row className="border rounded-3 p-3">
              <h5>{t("Type")}</h5>
              <Col md="6" className="gy-1">
                <div className="custom-radio"
                  onClick={() => {
                    setType(ACCOUNT_TYPES.LIVE);
                    document.getElementById(ACCOUNT_TYPES.LIVE).click();
                  }}>
                  <Input
                    className="mt-0 me-2"
                    id={ACCOUNT_TYPES.LIVE}
                    name="type"
                    type="radio"
                    value={ACCOUNT_TYPES.LIVE}
                  >
                  </Input>
                  <Label check for={ACCOUNT_TYPES.LIVE}>
                    {t(ACCOUNT_TYPES.LIVE)}
                  </Label>
                </div>
              </Col>
              <Col md="6" className="gy-1">
                <div className="custom-radio"
                  onClick={() => {
                    setType(ACCOUNT_TYPES.DEMO);
                    document.getElementById(ACCOUNT_TYPES.DEMO).click();
                  }}>                  <Input
                    className="mt-0 me-2"
                    id={ACCOUNT_TYPES.DEMO}
                    name="type"
                    type="radio"
                    value={ACCOUNT_TYPES.DEMO}
                  >
                  </Input>
                  <Label check for={ACCOUNT_TYPES.DEMO}>
                    {t(ACCOUNT_TYPES.DEMO)}
                  </Label>
                </div>
              </Col>
            </Row>
            {type && <AvRadioGroup name="accountTypeId" required errorMessage={t("Select Account Type")}>
              <Row className="border rounded-3 p-3 mt-3">
                <h5>{t("Account Type")}</h5>
                {filteredAccountTypes.length > 0 && filteredAccountTypes.map((type) =>
                  <Col key={type._id} md="6" className="gy-1">
                    <div className="custom-radio"
                      onClick={() => {
                        setSAccountCurrency(type.currencies);
                        document.getElementById(`radio-accountTypeId-${type._id}`).click();
                      }}>
                      <AvRadio label={t(type.title)} value={type._id} />
                    </div>
                  </Col>
                )}
              </Row>
            </AvRadioGroup>}
            {accountCurrency.length > 0 &&
              <AvRadioGroup name="currency" required errorMessage={t("Select Currency")}>
                <Row className="border rounded-3 p-3">
                  <h5>{t("Account Currency")}</h5>
                  {accountCurrency.map((currency) =>
                    <Col key={currency.currency} md="6" className="gy-1">
                      <div className="custom-radio"
                        onClick={() => {
                          document.getElementById(`radio-currency-${currency.currency}`).click();
                        }}>
                        <AvRadio label={t(currency.currency)} value={currency.currency} />
                      </div>
                    </Col>
                  )}
                </Row>
              </AvRadioGroup>}

            <div className="text-center mt-3 mb-1">
              {
                creating
                  ? <Loader />
                  : <Button type="submit" color="primary">{t("Link")}</Button>
              }
            </div>
          </AvForm>
        </ModalBody>
      </Modal>
    </>
  );
};

export default LinkMT5;