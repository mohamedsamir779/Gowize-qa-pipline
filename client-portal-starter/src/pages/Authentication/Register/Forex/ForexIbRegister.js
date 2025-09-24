/* eslint-disable react/jsx-indent-props */
/* eslint-disable quotes */
/* eslint-disable object-property-newline */
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
  lastName: "",
  country: COUNTRIES[0].countryEn,
  email: "",
  phone: "",
  gender: "Male",
  password: "",
};

const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z!@#$%^&*()_,.?":{}|<>\d]{8,20}$/;
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const ForexIbRegister = props => {
  const searchParams = new URLSearchParams(props.location.search);
  const agRef = searchParams.get("agRef");
  const parentRef = searchParams.get("parentRef");
  const salesRef = searchParams.get("salesRef");
  const ibRef = searchParams.get("ibRef");
  const ibId = searchParams.get("ibId");
  const refId = searchParams.get("refId");
  const utmCampaign = searchParams.get("utm-campaign");
  const ref = searchParams.get("ref");

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].calling_code);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, registrationError, loading, checkEmail, layoutMode } = useSelector(state => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    loading: state.Account.loading,
    checkEmail:state.checkUser.checkError,
    layoutMode: state.Layout.mode,
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
    if (ibRef) values.ibRef = ibRef;
    if (ibId) values.ibId = ibId;
    if (refId) values.refId = refId;
    dispatch(registerForexIbUser({
      ...values,
      declarations: [REGISTER],
      utmCampaign,
      ref,
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
    lastName: Yup.string()
      .min(2, "Too Short!").max(15, "Too Long!").required("Required"),
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
    emailPin: Yup.string("").required("PIN must be entered").length(4, "Pin should be 4 characters exact")
  });

  return (
    <React.Fragment>
    
      <MetaTags>
        <title>{t("Register Forex IB")} | {content.clientName}</title>
      </MetaTags>
      <div className="auth-page">
        <Container style={{ maxWidth: "1150px", marginBottom: "100px", marginTop: "100px" }} className="p-0">
                  <Row style={{ fontFamily: "Poppins", borderTop: "1px solid rgba(0,0,0,0.2)", borderRadius: "30px", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)"}} className="g-0 overflow-hidden">
                     <Col md={6} style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", borderRadius: "30px" }} className="d-none d-md-flex flex-column justify-content-start align-items-start p-5">
                              <h2 style={{ fontSize: 35, fontWeight: "bold", color: "#057A25" }}>Let’s Get <br /> You Started</h2>
                              <p style={{ fontSize: "12px" }} className="text-muted">
                                Log in to explore insights, execute trades, and stay ahead in the financial markets.
                              </p>
                              <p style={{ color: "#E4B200" }} className="fw-bold mt-3 mb-1 fs-4">Start smarter trading today</p>
                              <p className="fs-6">
                                Start your trading journey with confidence at Go Wize Markets.
                              </p>
                              <p style={{ fontSize: "12px" }} className="text-muted">
                                Join thousands of traders who trust our platform to achieve their financial goals with ease and security.
                              </p>
                              <p className="mt-1 fs-6">
                                Register now and access professional tools to support your investment decisions.
                              </p>
                              <p style={{ fontSize: "12px" }} className="text-muted">
                                From real-time data to advanced analytics – everything you need to trade smarter is just a few clicks away.
                              </p>
                              <div className="mt-3">
                                <img src={layoutMode === "dark" ? content.sign_logo : content.sign_logo} alt="logo" height="50" />
                              </div>
                            </Col>
            <Col lg={6} md={6} className="mx-auto">
              <div style={{
                position: "absolute",
                display: "block",
                top: -20,
                right: 0,
                zIndex: 999,
              }}>
                <LanguageDropdown />
              </div>
              <Card className="auth-full-page-content d-flex p-sm-5 p-4 bg-transparent border-0">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-2 text-center">
                      {/* <Link to="/dashboard" className="d-block auth-logo">
                        <img src={
                          layoutMode === "light" ? content.mainLogo : content.darkLogo
                        }  alt="" height="100" />
                      </Link> */}
                    </div>
                    <div className="auth-content my-auto">
                      {/* <div className="text-center mb-4 mb-md-3">
                        <h5 className="mb-0">{t("Register Forex IB Account")}</h5>
                      </div> */}

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
                                    {/* <Label for="firstName">{t("First Name")}</Label> */}
                                    <FormikField
                                      component={CustomInput}
                                      name="firstName"
                                      placeholder={t("First Name")}
                                      className={"mb-2"}
                                      style={{ borderRadius: '24px' }}
                                      type={"text"}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    {/* <Label for="lastName">{t("Last Name")}</Label> */}
                                    <FormikField
                                      component={CustomInput}
                                      name="lastName"
                                      placeholder={t("Last Name")}
                                      className={"mb-2"}
                                      style={{ borderRadius: '24px' }}
                                      type={"text"}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    {/* <Label for="country">{t("Select Country")}</Label> */}
                                    <FormikField
                                      component={CustomInput}
                                      name="country"
                                      placeholder={t("Select Country")}
                                      className={"mb-2 form-select"}
                                      style={{ borderRadius: '24px' }}
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
                                      })}
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    {/* <Label for="phone">{t("Phone")}</Label> */}
                                    <FormikField
                                      component={CustomInput}
                                      name="phone"
                                      className={"form-control border-start-0"}
                                      style={{ borderTopRightRadius: '24px', borderBottomRightRadius: '24px' }}
                                      type={"string"}
                                      onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key))
                                          e.preventDefault();
                                      }}
                                      inputgrouptext={<InputGroupText style={{ border: "1px solid #E4B200", borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px', backgroundColor: "#E4B200", color: "#fff" }} className="custom-input-group-text border-end-0">+{countryCode}</InputGroupText>}
                                      placeholder={t("Enter Phone")}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                            
                                <Col xs={12}>
                                  <div className="mb-3">
                                    {/* <Label for="email">{t("Email")}</Label> */}
                                    <FormikField
                                      component={CustomInput}
                                      name="email"
                                      className={"form-control"}
                                      style={{ borderRadius: '24px' }}
                                      type={"text"}
                                      onChange={handleEmailChange}
                                      placeholder={t("Enter Email")}
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
                                  <FormikField
                                    component={CustomInput}
                                    name="password"
                                    className={"mb-2 "}
                                    style={{ borderRadius: '24px' }}
                                    type="password"
                                    placeholder={t("Enter Password")}
                                  >
                                  </FormikField>
                                </Col>

                                {/* <Col xs={12}>
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
                                </Col> */}
                                <Col xs={12}>
                                <label>
                                  <FormikField
                                      component={InlineInput}
                                      name="declarations"
                                      type="checkbox"
                                      style={{ marginRight: "10px" }}
                                    >
                                    </FormikField>
                                    <span dangerouslySetInnerHTML={{ __html: REGISTER }} />
                                  </label>
                                </Col>

                              </FormGroup>
                              <div className="mb-3 text-center">
                                {loading ? <Spinner className="ms-2 text-center" color="primary" /> : 
                                  <Button disabled={!isPinVerified} className="text-center" color="primary" type="submit">Register</Button>}
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

export default connect(mapStateTpProps, null)(ForexIbRegister);
