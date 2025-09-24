import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React, { useEffect } from "react";
import {
  Row, Col, Alert, Container 
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";
import * as content from "content";

// action
import { resetPassword } from "../../store/actions";

// import images
// import logo from "../../assets/images/logo-sm.svg";
import CarouselPage from "./CarouselPage";

const ResetPasswordPage = props => {
  const dispatch = useDispatch();
  const token = new URLSearchParams(location.search).get("token") || "";
  const { resetPasswordError, resetPasswordSuccessMsg } = useSelector(state => ({
    resetPasswordError: state.ResetPasswordReducer.resetPasswordError,
    resetPasswordSuccessMsg: state.ResetPasswordReducer.resetPasswordSuccessMsg,
    resetPasswordSuccess: state.ResetPasswordReducer.resetPasswordSuccess
  }));

  const { layoutMode } = useSelector((state) => ({
    layoutMode: state.Layout.layoutMode,
  }));

  function handleValidSubmit(event, values) {
    dispatch(resetPassword({
      password: values.password, 
      token
    }));
  }

  useEffect(() => {
    if (props.resetPasswordSuccess) 
      history.push("/login");
  }, [props.resetPasswordSuccess]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          Forget Password | CRM Forex - {content.clientName}
        </title>
      </MetaTags>
      <div className="auth-page">
        <Container fluid className="p-0">
          <Row className="g-0">
            <Col lg={4} md={5} className="col-xxl-3">
              <div className="auth-full-page-content d-flex p-sm-5 p-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100">
                    <div className="mb-4 mb-md-5 text-center">
                      <Link to="/dashboard" className="d-block auth-logo">
                        <img src={
                          layoutMode === "light" ? content.lightLogo : content.mainLogo
                        } alt="" height="64" /> <span className="logo-txt">{content.clientName}</span>
                      </Link>
                    </div>
                    <div className="auth-content my-auto">
                      <div className="text-center">
                        <h5 className="mb-0">{props.t("Reset Password")}</h5>
                        <p className="text-muted mt-2">{props.t("Reset Password with")} {content.clientName}.</p>
                      </div>

                      {resetPasswordError && resetPasswordError ? (
                        <Alert color="danger" style={{ marginTop: "13px" }}>
                          {resetPasswordError}
                        </Alert>
                      ) : null}
                      {resetPasswordSuccessMsg ? (
                        <Alert color="success" style={{ marginTop: "13px" }}>
                          {resetPasswordSuccessMsg}
                        </Alert>
                      ) : null}

                      <AvForm className="custom-form mt-4"
                        onValidSubmit={(e, v) => handleValidSubmit(e, v)}
                      >
                        <div className="mb-3">
                          <AvField
                            name="password"
                            label={props.t("New Password")}
                            className="form-control"
                            placeholder={props.t("Enter New Password")}
                            type="password"
                            required
                          />
                        </div>
                        <div className="mb-3 mt-4">
                          <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Reset Password</button>
                        </div>
                      </AvForm>

                      <div className="mt-5 text-center">
                        <p className="text-muted mb-0">{props.t("Remember Your Password")}?<a href="/login"
                          className="text-primary fw-semibold"> {props.t("Sign In")} </a> </p>
                      </div>
                    </div>
                    <div className="mt-4 mt-md-5 text-center">
                      <p className="mb-0">© {new Date().getFullYear()} {content.clientName}   . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

ResetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withTranslation()(withRouter(ResetPasswordPage));
