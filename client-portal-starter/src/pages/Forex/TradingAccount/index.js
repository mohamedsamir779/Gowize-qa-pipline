// import { useSelector } from "react-redux";
import CardWrapper from "components/Common/CardWrapper";
import PageHeader from "components/Forex/Common/PageHeader";
import { useTranslation } from "react-i18next";
import { MetaTags } from "react-meta-tags";
import {
  AvField, AvForm, AvGroup, AvInput, AvFeedback, AvRadioGroup, AvRadio
} from "availity-reactstrap-validation";
import {
  Row, Col, Input, Container, Label, Button
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { createAccount, getAccountTypesStart } from "store/actions";
import { useEffect, useState } from "react";

function TradingAccount() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAccountTypesStart());
  }, []);

  const { accountTypes, submitting } = useSelector((state) => state.forex.accounts);
  const [filteredAccountTypes, setFilteredAccountTypes] = useState([]);
  const [platformAccountTypes, setPlatformAccountTypes] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [accountCurrency, setSAccountCurrency] = useState([]);
  // filter accounts based on account's type (live/demo)
  useEffect(() => {
    setFilteredAccountTypes(accountTypes?.filter((at) => at.type === "LIVE"));
  }, [accountTypes]);

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

  const { t } = useTranslation();
  const handleValidSubmit = (event, values) => {
    delete values.confirm_password;
    dispatch(createAccount({
      ...values,
    }));
  };

  return (<>
    <MetaTags>
      <title>{t("Trading Account")}</title>
    </MetaTags>
    <div className="page-content">
      <Container className="pt-5">
        <PageHeader title="Trading Account"></PageHeader>
        <CardWrapper className="mt-4">
          <div className="d-flex justify-content-between heading pb-2">
            <h5>{t("Create A Trading Account")}</h5>
            <div>
              <svg width="3" height="15" viewBox="0 0 4 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="#74788D" />
                <circle cx="2" cy="9" r="2" fill="#74788D" />
                <circle cx="2" cy="16" r="2" fill="#74788D" />
              </svg>
            </div>
          </div>
          <Row className="mt-3">
            <Col>
              <AvForm
                onValidSubmit={(e, v) => {
                  handleValidSubmit(e, v);
                }}
              >
                {platforms &&
                <Row className="border rounded-3  p-3 gx-1">
                  <h5>{t("Platforms")}</h5>
                  {platforms.map((platform) =>
                    <Col key={platform} md="6" className="gy-3 px-2">
                      <div className="d-flex align-items-center border  rounded-3 p-2 bg-light">
                        <Input
                          className="mt-0 me-2"
                          id={platform}
                          name="platform"
                          type="radio"
                          value={platform}
                          onClick={() => {
                            setSelectedPlatform(platform);
                          }}
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
                  <AvRadioGroup name="accountTypeId" className="border rounded-3 mt-3" required>
                    <Row className="p-3">
                      <h5>{t("Account Type")}</h5>
                      {platformAccountTypes.length > 0 && platformAccountTypes.map((type) =>
                        <Col key={type._id} md="6" className="gy-3 mt-3">
                          <div className="d-flex align-items-center border rounded-3 p-2 bg-light">
                            <AvRadio label={t(type.title)} value={type._id}
                              onClick={() => {
                                setSAccountCurrency(type.currencies);
                              }} />
                          </div>
                        </Col>
                      )}
                    </Row>
                  </AvRadioGroup>}
                {accountCurrency.length > 0 &&
                <Row>
                  <AvRadioGroup name="currency" className="border rounded-3 mt-3" required>
                    <Row className="p-3">
                      <h5>{t("Account Currency")}</h5>
                      {accountCurrency.map((currency) =>
                        <Col key={currency.currency} md="6" className="gy-3">
                          <div className="d-flex align-items-center border rounded-3 p-2 bg-light">
                            <AvRadio label={t(currency.currency)} value={currency.currency} />
                          </div>
                        </Col>
                      )}
                    </Row>
                  </AvRadioGroup>
                </Row>
                }
                <Row className="border rounded-3 p-3 mt-3 gx-1">
                  <h5 className="mb-3">{t("Select Leverage")}</h5>
                  <AvField type="select" name="leverage" value={"1"} required>
                    <option value={"1"}>1:1</option>
                    <option value={"100"}>1:100</option>
                    <option value={"400"}>1:400</option>
                  </AvField>
                </Row>
                <Row className=" border rounded-3 p-3 mt-3 gx-1">
                  <Col md="6">
                    <AvGroup className="pe-2">
                      <Label for="password" className="mb-2">{t("Trading Account Password")}</Label>
                      <AvInput name="password" type="password" id="password" required />
                    </AvGroup>
                  </Col>
                  <Col md="6">
                    <AvGroup className="ps-2">
                      <Label for="confirm_password" className="mb-2">{t("Confirm Password")}</Label>
                      <AvInput name="confirm_password" type="password" id="password" required
                        validate={{ custom: confirmPassword }}
                      />
                      <AvFeedback>{t("Password doesn't match")}</AvFeedback>
                    </AvGroup>
                  </Col>
                </Row>
                <div className="text-center mt-3 mb-1">
                  <Button type="submit" disabled={submitting} className="shadow color-bg-btn w-25">{t("Submit")}</Button>
                </div>
              </AvForm>
            </Col>
          </Row>
        </CardWrapper>
      </Container>
    </div>
  </>);
}

export default TradingAccount;