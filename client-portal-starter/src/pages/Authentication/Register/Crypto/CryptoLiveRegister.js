import React, {
  useEffect, useState 
} from "react";
import MetaTags from "react-meta-tags";
import {
  Row, Col, Alert, Container, InputGroupText, Form, FormGroup, Label, Button, Spinner, Card
} from "reactstrap";
import { COUNTRIES } from "../../../../helpers/countries";

import { apiError, registerLiveUser } from "../../../../store/actions";

//redux
import {
  useSelector, useDispatch, connect
} from "react-redux";

import { Link } from "react-router-dom";
import { withTranslation, useTranslation } from "react-i18next";

// import images
import * as content from "content";
import {
  Formik, Field as FormikField, Form as FormikForm
} from "formik";
import { CustomInput } from "../../../../components/Common/CustomInput";
import * as Yup from "yup";

import EmailPinField from "components/Common/EmailPinField";
import validateEmail from "helpers/validateEmail";
import LanguageDropdown from "components/CommonForBoth/TopbarDropdown/LanguageDropdown";

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


const CryptoLiveRegister = props => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].calling_code);
  // eslint-disable-next-line no-unused-vars
  const [isPinVerified, setIsPinVerified] = useState();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(15, "Too Long!")
      .required("First Name is required"),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(15, "Too Long!")
      .required("Last Name is required"),
    phone: Yup.string("Enter your Phone")
      .matches(/^\d+$/, "Phone is not valid")
      .min(8, "Invalid phone number")
      .max(12, "Invalid phone number")
      .required("Phone is required"),
    password: Yup.string("")
      .min(8, "Password must contain atleast 8 characters")
      .max(20, "Password should not be more than 20 characters long")
      .matches(
        passwordRegExp,
        "Atleast one lower case, upper case and number required")
      .required("Enter your password"),
    country: Yup.string("Select your country of residence").required("Country is required"),
    email: Yup.string().matches(emailRegex, "Enter valid email").required("Email is required"),
    emailPin: Yup.string("").required("PIN must be entered").length(4, "Pin should be 4 characters exact")
  });

  const {  registrationError, loading } = useSelector(state => ({
    user: state.Account.user,
    registrationError: state.Account.registrationError,
    loading: state.Account.loading,
  }));

  useEffect(() => {
    dispatch(apiError(""));
  }, [dispatch]);

  // useEffect(() => {
  //   if (havePin) pinRef.current.focus();
  // }, [havePin]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>{t(`Register Live | ${content.clientName}`)}</title>
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
                        <img src={content.mainLogo} alt="" height="28" /> <span className="logo-txt">{t(content.clientName)}</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center mb-4 mb-md-3">
                        <h5 className="mb-0">{t("Register Live Account")}</h5>
                      </div>

                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        validateOnBlur={false}
                        onSubmit={(values, actions) => {
                          const phone = values.phone;
                          values.phone = `+${countryCode}${phone}`;
                          values.history = props.history;
                          values.search = props.location.search;
                          actions.setSubmitting(true);
                          dispatch(registerLiveUser(values));
                          actions.setSubmitting(false);
                          // actions.resetForm(initialValues);
                        }}>
                        {({ values, setFieldValue, errors, setFieldTouched, handleChange, setFieldError, touched }) => {
                          const handleEmailChange = (e) => {
                            handleChange(e);
                            validateEmail(e.target.value, setFieldError);           
                          };
                          return (
                            <Form tag={FormikForm} autoComplete="off">
                              <FormGroup>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="firstName">{t("First Name")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="firstName"
                                      className={"mb-2"}
                                      type={"text"}
                                      placeholder={t("Enter First Name")}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="lastName">{t("Last Name")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="lastName"
                                      className={"mb-2"}
                                      type={"text"}
                                      placeholder={t("Enter Last Name")}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="country">{t("Select Country")}</Label>
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
                                      placeholder={t("Select Your Country")}
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
                                      className={"form-control mb-2"}
                                      type={"text"}
                                      placeholder={t("Enter Email")}
                                      onChange={handleEmailChange}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <Col xs={12}>
                                  <div className="mb-3">
                                    <Label for="password">{t("Password")}</Label>
                                    <FormikField
                                      component={CustomInput}
                                      name="password"
                                      className={"mb-2"}
                                      type={"password"}
                                      placeholder={t("Enter Password")}
                                    >
                                    </FormikField>
                                  </div>
                                </Col>
                                <EmailPinField 
                                  values={values}
                                  errors={errors}
                                  setFieldTouched={setFieldTouched}
                                  setFieldValue={setFieldValue}
                                  setIsPinVerified={setIsPinVerified}
                                  setFieldError={setFieldError}
                                  touched={touched}
                                ></EmailPinField>
                              </FormGroup>
                              <div className="mb-3 text-center">
                                {loading ? <Spinner className="ms-2 text-center" color="primary" /> : <Button className="text-center w-100" color="primary" type="submit">
                                  {t("Register")}
                                </Button>}
                              </div>
                              {/* {user && user ? (
                                <Alert color="success">
                                  {t("Register User Successfully")}
                                </Alert>
                              ) : null} */}
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

export default connect(mapStateTpProps, null)(withTranslation()(CryptoLiveRegister));
