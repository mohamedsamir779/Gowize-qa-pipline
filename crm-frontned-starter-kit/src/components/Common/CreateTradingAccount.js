import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

import { createTradingAccount, fetchAccountTypes } from "store/tradingAccounts/actions";
import { ACCOUNT_TYPES } from "common/data/trading-account";
import LEVERAGES from "constants/accountType";

function CreateTradingAccount(props) {
  const dispatch = useDispatch();
  const [addModal, setAddAccountModal] = useState(false);
  const [type, setType] = useState(ACCOUNT_TYPES.DEMO);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState([]);
  const [platformAccountTypes, setPlatformAccountTypes] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [accountCurrency, setSAccountCurrency] = useState([]);
  const [accountLeverages, setAccountLeverages] = useState([]);

  useEffect(() => {
    if (!accountLeverages) {
      setAccountLeverages(LEVERAGES);
    }
  }, [accountLeverages]);

  const { create = true } = props.tradingAccountPermission;

  // fetch crm account types only on creating new trading account
  useEffect(() => {
    dispatch(fetchAccountTypes({
      forCrm: true
    }));
    return () => {
      dispatch(fetchAccountTypes());
    };
  }, []);
  const accountTypes = props.accountTypes;

  // filter accounts based on account's type (live/demo)
  useEffect(() => {
    setFilteredAccountTypes(accountTypes?.filter((at) => at.type === type.toUpperCase()));
  }, [accountTypes, type]);

  // get unique platforms
  const platforms = accountTypes.length > 0 && [...new Set(accountTypes.map(item => item.platform))];

  // filter accounts based on platform
  useEffect(() => {
    setPlatformAccountTypes(filteredAccountTypes?.filter((account) => account.platform === selectedPlatform));
  }, [selectedPlatform]);

  const toggleAddModal = () => {
    setAddAccountModal(!addModal);
    if (props.onClose) {
      props.onClose();
    }
  };

  const handleCreateAccount = (e, values) => {
    console.log("Creating account. Params => ", {values});
    dispatch(createTradingAccount(values));
  };

  useEffect(() => {
    if (props.clearingCounter > 0 && addModal) {
      setAddAccountModal(false);
      if (props.onClose) {
        props.onClose();
      }
    }
  }, [props.clearingCounter]);

  useEffect(() => {
    setAddAccountModal(props.show);
  }, [props.show]);

  useEffect(() => {
    if (props.createCounter > 0 && addModal) {
      setAddAccountModal(false);
    }
  }, [props.createCounter]);


  return (
    <React.Fragment >
      {!props.hidenAddButton &&
        <Button color="primary" className={`${!create ? "d-none" : ""}`} onClick={toggleAddModal}><i className="bx bx-plus"></i> Create Trading Account</Button>
      }
      <Modal isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Create Trading Account")}
        </ModalHeader>
        <ModalBody >
          <AvForm onValidSubmit={handleCreateAccount}>
            <Row>
              <Col className="col-12 mb-3">
                <AvField
                  name="customerId"
                  type="hidden"
                  value={props.customerId} />
              </Col>
            </Row>
            <Row className="border rounded-3 p-3">
              <h5>{props.t("Type")}</h5>
              <Col key={ACCOUNT_TYPES.LIVE} md="6" className="gy-3">
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
              <Col key={ACCOUNT_TYPES.LIVE} md="6" className="gy-3">
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
            {platforms && <Row className="border rounded-3 p-3 mt-3">
              <h5>{props.t("Platforms")}</h5>
              {platforms.map((platform) =>
                <Col key={platform} md="6" className="gy-3">
                  <div className="custom-radio"
                    onClick={() => {
                      setSelectedPlatform(platform);
                      document.getElementById(platform).click();
                    }}>
                    <Input
                      className="mt-0 me-2"
                      id={platform}
                      name="platform"
                      type="radio"
                      value={platform}
                    >
                    </Input>
                    <Label check for={platform}>
                      {props.t(platform)}
                    </Label>
                  </div>
                </Col>)}
            </Row>
            }
            {
              selectedPlatform &&
              <AvRadioGroup name="accountTypeId" required errorMessage={props.t("Select Account Type")}>
                <Row className="border rounded-3 p-3 mt-3">
                  <h5>{props.t("Account Type")}</h5>
                  {platformAccountTypes.length > 0 && platformAccountTypes.map((type) =>
                    <Col key={type._id} md="6" className="gy-3">
                      <div className="custom-radio"
                        onClick={() => {
                          setSAccountCurrency(type.currencies);
                          setAccountLeverages(type.leverages);
                          document.getElementById(`radio-accountTypeId-${type._id}`).click();
                        }}>
                        <AvRadio label={props.t(type.title)} value={type._id} />
                      </div>
                    </Col>
                  )}
                </Row>
              </AvRadioGroup>}
            {accountCurrency.length > 0 &&
              <AvRadioGroup name="currency" required errorMessage={props.t("Select Currency")}>
                <Row className="border rounded-3 p-3 mt-3">
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
              <AvField type="select" name="leverage" value={(accountLeverages && accountLeverages.length > 0) 
                ? `${accountLeverages[0]}` 
                : ""} required>
                {accountLeverages?.map((leverage) =>
                  <option key={leverage} value={leverage}>{`1:${leverage}`}</option>
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
export default connect(mapStateToProps, null)(withTranslation()(CreateTradingAccount));
