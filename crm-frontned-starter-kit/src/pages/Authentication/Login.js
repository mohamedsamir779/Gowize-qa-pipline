import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React from "react";

import {
  Row, Col, Alert, Container 
} from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";

import { withRouter, Link } from "react-router-dom";

// availity-reactstrap-validation
import { AvForm, AvField } from "availity-reactstrap-validation";

import * as content from "content";

// actions
import { loginUser, toggleCurrentModal } from "../../store/actions";

// import images
// import logo from "../../assets/images/logo-sm.svg";

//Import config

import CarouselPage from "./CarouselPage";
import TwoFactorAuthLogin from "./TwoFactorAuthLogin";

const Login = props => {
  const dispatch = useDispatch();

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }));

  const { currentModal, modalData, layoutMode } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
    modalData: state.Layout.modalData,
    layoutMode: state.Layout.layoutMode,
  }));

  const handleValidSubmit = (event, values) => {
    event.preventDefault();
    dispatch(loginUser({
      ...values,
      email: values.email.toLowerCase(),
    }, props.history));
  };

  
  return (
    <React.Fragment>
      <MetaTags>
        <title>Login</title>
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
                        } alt="" height="64" /> <span className="logo-txt"></span>
                      </Link>
                    </div>
                    
                    <AvForm
                      className="custom-form mt-4 pt-2"
                      onValidSubmit={(e, v) => {
                        handleValidSubmit(e, v);
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}
                      <div className="mb-3">
                        <AvField
                          name="email"
                          label="Email"
                          value=""
                          className="form-control"
                          placeholder="Enter Your Email"
                          type="email" 
                          errorMessage="Enter Valid Email"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <div className="mb-3">
                          <div className="d-flex align-items-start">
                            <div className="flex-grow-1">
                              <label className="form-label">Password</label>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="">
                                <Link to="/forgot-password" className="text-muted">Forgot password?</Link>
                              </div>
                            </div>
                          </div>
                          <AvField
                            name="password"
                            value=""
                            type="password"
                            className="form-control"
                            required
                            errorMessage="Enter Valid Password"
                            placeholder="Enter Your Password"
                          />
                        </div>
                      </div>
  
                      <div className="mb-3">
                        <button className="btn btn-primary w-100 waves-effect waves-light" type="submit">Log In</button>
                      </div>
                    </AvForm>
                     
                    <div className="mt-5 text-center">
                      {/* <p className="text-muted mb-0"> Don&#39;t have an account ? 
                        <Link to="/register" className="text-primary fw-semibold"> 
                          Signup now 
                        </Link>
                      </p> */}
                    </div>
                  </div>
                  <div className="mt-4 mt-md-5 text-center">
                    <p className="mb-0">© {new Date().getFullYear()} {content.clientName} </p>
                  </div>
                  {/* <div className="mt-4 mt-md-5 text-center">
                    <p className="mb-0">© {new Date().getFullYear()} {content.clientName} . Crafted with <i className="mdi mdi-heart text-danger"></i> by Themesbrand</p>
                  </div> */}
                </div>
                
              </div>
            </Col>
            <CarouselPage />
          </Row>
        </Container>
        {modalData && currentModal === "TwoFactorAuth" &&
          <TwoFactorAuthLogin
            isOpen={currentModal === "TwoFactorAuth"}
            email={modalData.email}
            type={modalData.type}
            history={props.history}
            toggleOpen={() => {
              dispatch(toggleCurrentModal(""));
            }}>
          </TwoFactorAuthLogin>}
      </div>
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
