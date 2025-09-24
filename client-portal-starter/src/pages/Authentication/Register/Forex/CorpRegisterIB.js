import React, { useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import {
  Row, Col, Alert, Container, InputGroupText, Form, FormGroup, Label, Button, Spinner, Card 
} from "reactstrap";
import { COUNTRIES } from "../../../../helpers/countries";
import { REGISTER } from "declarations";

import {
  apiError, changePortal, registerForexIbUser 
} from "../../../../store/actions";

//redux
import {
  useSelector, useDispatch, connect 
} from "react-redux";

import { Link } from "react-router-dom";
// import images
import * as content from "content";
import {
  Formik, Field as FormikField, Form as FormikForm 
} from "formik";
import { CustomInput, InlineInput } from "../../../../components/Common/CustomInput";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import EmailPinField from "components/Common/EmailPinField";
import { PORTALS } from "common/constants";
import validateEmail from "helpers/validateEmail";
import LanguageDropdown from "components/CommonForBoth/TopbarDropdown/LanguageDropdown";
import _ from "lodash";

const initialValues = {
  firstName: "",
  country: COUNTRIES[0].countryEn,
  email: "",
  phone: "",
  password: "",
  declarations: false,
  isCorporate: true,
};

const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z!@#$%^&*()_,.?":{}|<>\d]{8,20}$/;
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const CorporateRegisterIB = props => {
  const searchParams = new URLSearchParams(props.location.search);
  const agRef = searchParams.get("agRef");
  const parentRef = searchParams.get("parentRef");
  const salesRef = searchParams.get("salesRef");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].calling_code);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, registrationError, loading, checkEmail } = useSelector(state => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    loading: state.Account.loading,
    checkEmail:state.checkUser.checkError
  }));

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);
  
  const submitRegistration = (values, actions) => {
    const phone = values.phone;
    values.phone = `+${countryCode}${phone}`;
    values.history = props.history;
    actions.setSubmitting(true);
    localStorage.setItem("PORTAL", PORTALS.FOREX);
    dispatch(changePortal(PORTALS.FOREX));
    if (agRef) values.agRef = agRef;
    if (parentRef) values.parentRef = parentRef;
    if (salesRef) values.salesRef = salesRef;
    dispatch(registerForexIbUser({
      ...values,
      declarations: [REGISTER],
    }));
    // dispatch(checkUser(values));
    actions.setSubmitting(false);
    // actions.resetForm(initialValues);
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(15, "Too Long!")
      .required("Required"),
    phone: Yup.string("Enter your Phone")
      .matches(/^\d+$/, "Phone is not valid")
      .min(5, "Phone is not valid")
      .max(20, "Phone is not valid")
      .required("Phone is required"),
    password: Yup.string("")
      .min(8, "Password must contain atleast 8 characters")
      .max(20, "Password should not be more than 20 characters long")
      .matches(
        passwordRegExp,
        "Atleast one lower case, upper case and number required")
      .required("Enter your password"),
    country: Yup.string("Select your country of residence").required("Country of residence is required"),
    email: Yup.string("should be valid email").matches(emailRegex, "Email is not valid").required("Email is required"),
    emailPin: Yup.string("").required("PIN must be entered").length(4, "Pin should be 4 characters exact"),
    declarations: Yup.boolean().oneOf([true], "Please check the agreement"),
  });

  return (
    <React.Fragment>
    
      <MetaTags>
        <title>{t("Register Forex IB")} | {content.clientName}</title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="mx-auto">
              <div style={{
                position: "absolute",
                display: "block",
                top: -20,
                right: 0,
                zIndex: 999,
              }}>
                <LanguageDropdown />
              </div>
              <Card className="auth-full-page-content d-flex p-sm-5 p-4  card-shadow">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-2 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={content.mainLogo} alt="" height="28" /> <span className="logo-txt">{content.clientName}</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center mb-4 mb-md-3">
                        <h5 className="mb-0">{t("Register Corporate IB Account")}</h5>
                      </div>

                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        validateOnBlur={false}

                        onSubmit={submitRegistration}>
                        {({ values, setFieldValue, errors, setFieldTouched, handleChange, setFieldError, touched }) => {
                          const handleEmailChange = (e) => {
                            handleChange(e);
                            validateEmail(e.target.value, setFieldError);           
                          };                          
                          return (
                            <Form tag={FormikForm} autoComplete="off">
                              <FormGroup row>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="firstName">{t("Company Name")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="firstName"
                                      className={"mb-2"}
                                      type={"text"}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="country">{t("Country of Incorporation")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="country"
                                      className={"mb-2 form-select"}
                                      type={"select"}
                                      value={values.countryEn}
                                      onChange={(e) => {
                                        const value = JSON.parse(e.target.value);
                                        setFieldValue("country", value.countryEn);
                                        setCountryCode(value.calling_code);
                                      }}
                                    >
                                      {COUNTRIES.map((c, key) => {
                                        return <option key={key} value={JSON.stringify(c)}>{c.countryEn}</option>;
                                      }
                                      )}
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="phone">{t("Phone")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="phone"
                                      className={"form-control border-start-0"}
                                      type={"string"}
                                      onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key))
                                          e.preventDefault();
                                      }}
                                      inputgrouptext={<InputGroupText className="custom-input-group-text border-end-0">+{countryCode}</InputGroupText>}
                                      placeholder={t("Enter Phone")}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                            
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="email">{t("Email")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="email"
                                      className={"form-control"}
                                      type={"text"}
                                      onChange={handleEmailChange}
                                    >
                                    </FormikField>
                                    { checkEmail ? (
                                      <span className="text-danger">{checkEmail}</span>
                                    ) : null}
                                  </div>
                                </Col>
                                <EmailPinField 
                                  values={values}
                                  errors={errors}
                                  isPinVerified={isPinVerified}
                                  setFieldTouched={setFieldTouched} 
                                  setFieldValue={setFieldValue}
                                  setIsPinVerified={setIsPinVerified}
                                  setFieldError={setFieldError}
                                  touched={touched}
                                ></EmailPinField>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Row>
                                      <Label for="password">{t("Password")}</Label>
                                      <Col xs={11} 
                                        style={{
                                          paddingRight: "0px",
                                        }}>
                                        <FormikField
                                          component={CustomInput}
                                          name="password"
                                          className={"mb-2 "}
                                          type={showPassword ? "text" : "password"}
                                        >
                                        </FormikField>
                                      </Col>
                                      <Col xs={1}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backgroundColor: "#E9ECEF",
                                          borderTopRightRadius: "0.25rem",
                                          borderBottomRightRadius: "0.25rem",
                                          boxShadow: " 0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                          maxHeight: "38px",
                                        }}
                                      >
                                        <button className="btn" type="button" onClick={()=>{ setShowPassword(!showPassword) }}>
                                          <i className="mdi mdi-eye-outline"></i>
                                        </button>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <label>
                                    <FormikField
                                      component={InlineInput}
                                      name="declarations"
                                      type="checkbox"
                                    >
                                    </FormikField>
                                    <span dangerouslySetInnerHTML={{ __html: t(REGISTER) }} />
                                  </label>
                                </Col>

                              </FormGroup>
                              <div className="mb-3 text-center">
                                {loading ? <Spinner className="ms-2 text-center" color="primary" /> : 
                                  <Button disabled={!_.isEmpty(errors) || !isPinVerified} className="text-center" color="primary" type="submit">Register</Button>}
                              </div>
                              {user && user ? (
                                <Alert color="success">
                                  {t("Register User Successfully")}
                                </Alert>
                              ) : null}

                              {registrationError && registrationError ? (
                                <Alert color="danger">{registrationError}</Alert>
                              ) : null}
                            </Form>
                          );}}
                      </Formik>
                      <div className="mt-2 text-left">
                        <p className="text-muted mb-0">{t("Already have an account ? ")}<Link to="/login"
                          className="text-primary fw-semibold"> {t("Login")} </Link> </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
const mapStateTpProps = (state) => {
  return {
    loading: state.Account.loading
  };
};

export default connect(mapStateTpProps, null)(CorporateRegisterIB);
