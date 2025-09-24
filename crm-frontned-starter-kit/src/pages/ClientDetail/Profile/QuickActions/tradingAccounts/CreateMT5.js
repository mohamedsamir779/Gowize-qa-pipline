import React, { useState, useEffect } from "react";
import {
  useDispatch, connect
} from "react-redux";
import {
  Modal, ModalHeader,
  ModalBody,
  Row, Col, Button, Input, Label
} from "reactstrap";
import {
  AvForm, AvField, AvRadio, AvRadioGroup
} from "availity-reactstrap-validation";
import { withTranslation } from "react-i18next";

import { createTradingAccount } from "store/tradingAccounts/actions";
import { ACCOUNT_TYPES } from "common/data/trading-account";
import LEVERAGES from "constants/accountType";

function CreateMT5 (props) {
  const dispatch = useDispatch();
  const [type, setType] = useState(null);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState([]);
  const [accountCurrency, setSAccountCurrency] = useState([]);
  const [accountLeverages, setAccountLeverages] = useState([]);

  useEffect(() => {
    if (!accountLeverages) {
      setAccountLeverages(LEVERAGES);
    }
  }, [accountLeverages]);

  const { create = true } = props.tradingAccountPermission;
  
  const accountTypes = props.accountTypes;

  // filter accounts based on account's type (live/demo)
  useEffect(() => {
    setFilteredAccountTypes(accountTypes?.filter((at) => at.type === type?.toUpperCase() /*&& at.platform === "CTRADER"*/));
  }, [accountTypes, type]);

  const handleCreateAccount = (e, values) => {
    dispatch(createTradingAccount(values));
  };

  useEffect(()=>{
    if (props.createCounter > 0 && props.show) {
      props.toggle();
    }
  }, [props.createCounter]);


  return (
    <React.Fragment >
      <button className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={props.toggle}>Create Account</button>
      <Modal isOpen={props.show} toggle={props.toggle} centered={true}>
        <ModalHeader toggle={props.toggle} tag="h4">
          {props.t("Create Account")}
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={handleCreateAccount}>
            <Row>
              <Col className="col-12 mb-3 d-none">
                <AvField
                  name="customerId"
                  type="hidden"
                  value={props.customerId}/>
              </Col>
            </Row>
            <Row className="border rounded-3 p-3">
              <h5>{props.t("Type")}</h5>
              <Col md="6" className="gy-3">
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
                    {props.t(ACCOUNT_TYPES.LIVE)}
                  </Label>
                </div>
              </Col>
              <Col md="6" className="gy-3">
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
                    {props.t(ACCOUNT_TYPES.DEMO)}
                  </Label>
                </div>
              </Col>
            </Row>

            {type && <AvRadioGroup name="accountTypeId" required errorMessage={props.t("Select Account Type")}>
              <Row className="border rounded-3 p-3 mt-3">
                <h5>{props.t("Account Type")}</h5>
                {filteredAccountTypes.length > 0 && filteredAccountTypes.map((type) =>
                  <Col key={type._id} md="6" className="gy-3">
                    <div className="custom-radio"
                      onClick={() => {
                        setSAccountCurrency(type.currencies);
                        if (type?.leverages) {
                          setAccountLeverages(type.leverages);
                        } else {
                          setAccountLeverages(LEVERAGES);
                        }
                        document.getElementById(`radio-accountTypeId-${type._id}`).click();
                      }}>
                      <AvRadio label={props.t(type.title)} value={type._id}/>
                    </div>
                  </Col>
                )}
              </Row>
            </AvRadioGroup>}
            {accountCurrency.length > 0 &&
            <AvRadioGroup name="currency" required errorMessage={props.t("Select Currency")}>
              <Row className="border rounded-3 p-3">
                <h5 className="mb-3">{props.t("Account Currency")}</h5>
                {accountCurrency.map((currency) =>
                  <Col key={currency.currency} md="6" className="gy-3">
                    <div className="custom-radio"
                      onClick={() => {
                        document.getElementById(`radio-currency-${currency.currency}`).click();
                      }}>
                      <AvRadio label={props.t(currency.currency)} value={currency.currency} />
                    </div>
                  </Col>
                )}
              </Row>
            </AvRadioGroup>}
            <Row className="border rounded-3 p-3 mt-3">
              <h5 className="mb-3">{props.t("Select Leverage")}</h5>
              <AvField type="select" name="leverage" value={"1"} required>
                {accountLeverages.map((leverage) =>
                  <option key={leverage} value={leverage}>1:{leverage}</option>
                )}
              </AvField>
            </Row>
            <Row>
              <Col>
                <div className="text-end">
                  <Button disabled={props.creating} type="submit" color="primary" className="">
                    Create
                  </Button>
                </div>
              </Col>
            </Row>
          </AvForm>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  accountTypes: state.tradingAccountReducer.accountTypes || [],
  tradingAccountPermission: state.Profile.todosPermissions || {},
  createCounter: state.tradingAccountReducer.createCounter || 0,
  creating: state.tradingAccountReducer.creating || false,
});
export default connect(mapStateToProps, null)(withTranslation()(CreateMT5));
