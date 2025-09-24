/* eslint-disable object-property-newline */
import MetaTags from "react-meta-tags";
import React from "react";
import {
  Row, Col, Alert, Container, Spinner 
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

// action
import { userForgetPassword } from "../../store/actions";

// import images
import CarouselPage from "./CarouselPage";
import { withTranslation } from "react-i18next";
import * as content from "content";
import LanguageDropdown from "components/CommonForBoth/TopbarDropdown/LanguageDropdown";

const ForgetPasswordPage = props => {
  const dispatch = useDispatch();

  const { forgetError, forgetSuccessMsg, loading } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
    loading: state.ForgetPassword.loading
  }));

  function handleValidSubmit(event, values) {
    dispatch(userForgetPassword(values.email.toLowerCase()));
  }

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {props.t("Forget Password")} | {content.clientName}
        </title>
      </MetaTags>
      <div className="auth-page">
        <Container style={{ maxWidth: "1150px", marginBottom: "100px", marginTop: "100px" }} className="p-0">
          <Row style={{ fontFamily: "Poppins", borderTop: "1px solid rgba(0,0,0,0.2)", borderRadius: "30px", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)"}} className="g-0 overflow-hidden">
            <Col md={6} style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", borderRadius: "30px" }} className="d-none d-md-flex flex-column justify-content-start align-items-start p-5">
                                  <h2 style={{ fontSize: 35, fontWeight: "bold", color: "#057A25" }}>Forgot Your <br /> Password?</h2>
                                  <p style={{ fontSize: "12px" }} className="text-muted">
                                  No worries — we’ve got you covered.
                                  </p>
                                  <p style={{ fontSize: "12px" }} className="text-muted">
                                  Enter your registered email address to receive a password reset link and regain access to your account.
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
                                    <img src={content.sign_logo} alt="logo" height="50" />
                                  </div>
                                </Col>
            <Col lg={6} sm={12} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div style={{
                  position: "absolute",
                  display: "block",
                  top: -20,
                  right: 0,
                  zIndex: 999,
                }}>
                  <LanguageDropdown />
                </div>
                <div className="w-100">
                  <div className="d-flex flex-column h-100 justify-content-center ">
                    {/* <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={content.mainLogo} alt="" height="28" /> <span className="logo-txt">{props.t(content.clientName)}</span>
                      </Link>
                    </div> */}
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0" style={{ fontSize: "40px", fontWeight: "bold", color: "#E4B200" }}>{props.t("Reset Password")}</h5>
                        {/* <p className="text-muted mt-2">{props.t(`Reset Password with ${content.clientName}.`)}</p> */}
                      </div>

                      {forgetError && forgetError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {props.t(forgetError)} 
                        </Alert>
                      ) : null}
                      {forgetSuccessMsg ? (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {props.t(forgetSuccessMsg)}
                        </Alert>
                      ) : null}

                      <AvForm className="custom-form mt-4"
                        onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                      >
                        <div className="mb-3">
                          <AvField
                            name="email"
                            // label={props.t("Email")}
                            className="form-control"
                            style={{ borderRadius: "24px" }}
                            placeholder={props.t("Email")}
                            errorMessage={props.t("Enter valid email")}
                            validate={{
                              required: {
                                value: true,
                              },
                              email:{
                                value:true,
                              }
                            }}
                            type="email"
                          />
                        </div>
                        <div className="mb-3 mt-4">
                          <button style={{ borderRadius: "24px" }} disabled={loading} className="btn btn-primary w-100 waves-effect waves-light" type="submit">{loading ? <Spinner style={{
                            width:"1.5rem",
                            height:"1.5rem"  
                          }} /> : props.t("Reset")}</button>
                        </div>
                      </AvForm>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">{props.t("Remember It ?")}  <a href="login"
                          className="text-primary fw-semibold"> {props.t("Sign In")} </a> </p>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()}{props.t(` ${content.clientName}. Crafted with`)}     <i className="mdi mdi-heart text-danger"></i> by {content.clientName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            {/* <CarouselPage /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(withTranslation()(ForgetPasswordPage));
