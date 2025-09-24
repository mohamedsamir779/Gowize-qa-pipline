import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AvForm, AvGroup, AvRadioGroup, AvRadio, AvField, AvFeedback,
} from "availity-reactstrap-validation";
import {
  Row, Col,
  Modal, ModalHeader, ModalBody,
  Input, Label, Button,
} from "reactstrap";
import { withTranslation } from "react-i18next";

import {
  createAccount, toggleCurrentModal, getAccountTypesStart, createAccountRequest,
} from "store/actions";
import config from "config";

const CreateLiveAccModal = ({ isOpen, toggle, type, t }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAccountTypesStart({
      forCp: true,
    }));
    return () => {
      dispatch(getAccountTypesStart());
    };
  }, []);

  const { accountTypes, submitting, accounts } = useSelector((state) => state.forex.accounts);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState([]);
  const [platformAccountTypes, setPlatformAccountTypes] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [accountCurrency, setSAccountCurrency] = useState([]);
  const [accountLeverages, setAccountLeverages] = useState([]);

  useEffect(() => {
    if (!accountLeverages) {
      setAccountLeverages(config.LEVERAGES);
    }
  }, [accountLeverages]);

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

  const confirmPassword = (value, ctx, input, cb) => {
    if (value !== ctx.password) cb("Password doesn't match!");
    else cb(true);
  };

  const isApprovalRequired = accounts?.length >= config.MAX_UNAPPROVED_ACCOUNTS;

  const handleValidSubmit = (event, values) => {
    delete values.confirm_password;
    //console.log("Account create", {values});
    if (isApprovalRequired) {
      dispatch(createAccountRequest({
        ...values,
      }));
    } else {
      dispatch(createAccount({
        ...values,
      }));
    }
  };

  return (
    <Modal centered isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4" className="text-capitalize">
        {t(`Create ${type} Account`)}
      </ModalHeader>
      <ModalBody className="px-4">
        <AvForm
          onValidSubmit={(e, v) => {
            handleValidSubmit(e, v);
          }}
        >
          {platforms && <Row className="border rounded-3 p-3">
            <h5>{t("Platforms")}</h5>
            {platforms.map((platform) =>
              <Col key={platform} md="6" className="gy-3">
                <div className="custom-radio"
                  onClick={() => {
                    setSelectedPlatform(platform);
                    document.getElementById(platform).click();
                  }}                     style={{
                    border: 0,
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
                    {t(platform)}
                  </Label>
                </div>
              </Col>)}
          </Row>
          }
          {
            selectedPlatform &&
            <Row className="border rounded-3 p-3 my-1">
              <AvRadioGroup name="accountTypeId" errorMessage={t("Account type is required")} required className="radio-group"  >
                <Row className="radio-group" >
                  <h5>{t("Account Type")}</h5>
                  {platformAccountTypes.length > 0 && platformAccountTypes.map((type) =>
                    <Col key={type._id} md="6" className="gy-3 " >
                      <div className="custom-radio"
                        onClick={() => {
                          setSAccountCurrency(type.currencies);
                          setAccountLeverages(type.leverages);
                          document.getElementById(`radio-accountTypeId-${type._id}`).click();
                        }}  >
                        <AvRadio label={t(type.title)} value={type._id} />
                      </div>
                    </Col>
                  )}
                </Row>
              </AvRadioGroup>
            </Row>}
          {accountCurrency.length > 0 &&
            <Row className="border rounded-3 p-3 my-1">
              <AvRadioGroup name="currency" errorMessage={t("Currency is required")} required className="radio-group" >
                <Row className="radio-group " >
                  <h5 className="mb-3">{t("Account Currency")}</h5>
                  {accountCurrency.map((currency) =>
                    <Col key={currency.currency} md="6" className="gy-3" >
                      <div className="custom-radio" 
                        onClick={() => {
                          document.getElementById(`radio-currency-${currency.currency}`).click();
                        }} >
                        <AvRadio label={t(currency.currency)} value={currency.currency} />
                      </div>
                    </Col>
                  )}
                </Row>
              </AvRadioGroup>
            </Row>}
          <Row className="border rounded-3 p-3 mt-3">
            <h5 className="mb-3">{t("Select Leverage")}</h5>
            <AvField type="select" name="leverage" value={(accountLeverages && accountLeverages.length > 0) 
                                                              ? `${accountLeverages[0]}` 
                                                              : ""} required>
              {accountLeverages?.map((leverage) =>
                <option key={leverage} value={leverage}>{`1:${leverage}`}</option>
              )}
            </AvField>
          </Row>
          {/* {
            !isApprovalRequired ? 
              <Row className="border rounded-3 p-3 mt-3">
                <Col md="6">
                  <AvGroup>
                    <Label for="password" className="mb-2">{t("Trading Account Password")}</Label>
                    <AvField name="password" type="password" id="password"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Password is required"
                        },
                        pattern: {
                          errorMessage: "Password must contain at least 1 Uppercase, 1 Lowercase, 1 Number and 1 Special Character",
                          value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"
                        },
                        minLength: {
                          value: 8,
                          errorMessage: "Password must be more than 8 characters"
                        },
                      }} />
                  </AvGroup>
                </Col>
                <Col md="6">
                  <AvGroup>
                    <Label for="confirm_password" className="mb-2">{t("Confirm Password")}</Label>
                    <AvField name="confirm_password" type="password" id="confirm_password"
                      validate={{
                        required: {
                          value: true,
                          errorMessage: "Password is required"
                        },
                        custom: confirmPassword
                      }}
                    />
                    <AvFeedback>{t("Password doesn't match")}</AvFeedback>
                  </AvGroup>
                </Col>
              </Row>
              : null
          } */}
          {
            isApprovalRequired ? 
              <Row className="border rounded-3 p-3 mt-3">
                <AvGroup>
                  <Label for="reason" className="mb-2">{t("Reason for new Account")}</Label>
                  <AvField name="reason" type="reason" id="reason"
                    validate={{
                      required: {
                        value: true,
                        errorMessage: "Reason is required"
                      },
                      minLength: {
                        value: 7,
                        errorMessage: "Reason must have at least 6 characters"
                      },
                    }} />
                </AvGroup>
              </Row>
              : null  
          }
          <div className="text-center mt-3 mb-1">
            <Button type="submit" disabled={submitting} className="color-bg-btn border-0 text-white w-25">{t("Submit")}</Button>
            <Button color="light" type="button" className="w-25 ms-3"
              onClick={() => dispatch(toggleCurrentModal(""))}
            >{t("Skip")}</Button>
          </div>
        </AvForm>
      </ModalBody>
    </Modal >
  );
};

export default withTranslation()(CreateLiveAccModal);