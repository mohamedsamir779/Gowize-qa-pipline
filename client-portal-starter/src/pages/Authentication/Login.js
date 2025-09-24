/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-constant-condition */
/* eslint-disable object-curly-newline */
/* eslint-disable object-property-newline */
import React from "react";
import {
  Container,
  Row,
  Col,
  FormGroup,
  Input,
  Alert,
  Card,
  Spinner,
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Joi from "joi";
import { Link, withRouter } from "react-router-dom";
import * as content from "content";

// Redux actions
import { loginUser, toggleCurrentModal } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { MetaTags } from "react-meta-tags";
import LanguageDropdown from "components/CommonForBoth/TopbarDropdown/LanguageDropdown";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import TwoFactorAuth from "components/TwoFactorAuth";

const schema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
  password: Joi.string().min(6).required().label("Password")
});

const validateFormikWithJoi = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  const errors = {};
  for (let item of error.details) {
    errors[item.path[0]] = item.message;
  }
  return errors;
};

const Login = (props) => {
  const dispatch = useDispatch();

  const {  currentModal, modalData } = useSelector((state) => ({
      currentModal: state.Layout.currentModal,
      modalData: state.Layout.modalData
    }));

    const { error, loading, layoutMode } = useSelector(state => ({
        loading: state.Login.loading,
        error: state.Login.error,
        layoutMode: state.Layout.layoutMode,
      }));

  const handleSubmit = async (values) => {
    dispatch(loginUser(values, props.history));
  };

  return (
    <>
    <MetaTags>
        <title>{props.t("Login")}</title>
    </MetaTags>
    <Container style={{ maxWidth: "1150px" }} className="auth-wrapper min-vh-100 d-flex align-items-center justify-content-center">
      <Row className="g-0 w-100 border" style={{ fontFamily: "Poppins", borderRadius: "30px", boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", overflow: "hidden" }}>
        <Col md={6} style={{ boxShadow: "0 4px 4px 0 rgba(0,0,0,0.25)", borderRadius: "30px" }} className="d-none d-md-flex flex-column justify-content-center align-items-start p-5">
          <h2 style={{ fontSize: 35, fontWeight: "bold", color: "#057A25" }}>Already a Trader?<br />Welcome Back!</h2>
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

        <Col md={6} xs={12} className="d-flex justify-content-center align-items-center p-4">
        <div style={{
                      position: "absolute",
                      display: "block",
                      top: 0,
                      right: 25,
                      zIndex: 999,
                    }}>
                      <LanguageDropdown />
                    </div>
          <Card body className="w-100" style={{ maxWidth: "500px", border: "none" }}>
            <h3 style={{ color: "#E4B200" }} className="text-center fw-bold mb-4">{props.t("Login")}</h3>

            {error && error ? (
              <Alert color="danger"> {props.t(error)}</Alert>
            ) : null}

            <Formik
              initialValues={{ email: "", password: "" }}
              validate={validateFormikWithJoi}
              onSubmit={handleSubmit}
            >
              
              {({ isSubmitting }) => (
                <Form>
                  <FormGroup>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email"
                      id="email"
                      as={Input}
                      className="form-control"
                      style={{ borderRadius: "50px", padding: "10px 20px" }}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </FormGroup>
                  <br />
                  <FormGroup>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      id="password"
                      as={Input}
                      className="form-control"
                      style={{ borderRadius: "50px", padding: "10px 20px" }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger mt-1"
                    />
                    <div className="text-end mt-2 mb-1">
                      <Link to="/forgot-password" className="text-muted">{props.t("Forgot password?")}</Link>
                    </div>
                  </FormGroup>

                  {loading ? <div className="text-center"><Spinner className="ms-2" color="primary" /></div> :
                  <button className="btn btn-primary w-100 waves-effect waves-light" 
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    borderRadius: "50px",
                    padding: "12px 24px",
                    backgroundColor: "#E4B200",
                    border: "none",
                    fontSize: "16px",
                    letterSpacing: "0.5px",
                  }}
                  >
                    {props.t("Login")}
                  </button>
                  }

                  <div className="text-center mt-3">
                    <small>{props.t("Don't have an account ?")} <Link to="/register/forex/live">{props.t("Signup now")}</Link></small>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </Col>
      </Row>
    </Container>
    {modalData && currentModal === "TwoFactorAuth" &&
              <TwoFactorAuth
                isOpen={currentModal === "TwoFactorAuth"}
                email={modalData.email}
                type={modalData.type}
                history={props.history}
                toggleOpen={() => {
                  dispatch(toggleCurrentModal(""));
                }}>
              </TwoFactorAuth>}
    </>
  );
};
export default withRouter(withTranslation()(Login));

Login.propTypes = {
  history: PropTypes.object,
};
