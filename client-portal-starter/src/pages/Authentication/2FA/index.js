import React, { useEffect, useState } from "react";
import {
  Button, Col, Container, Row, Spinner 
} from "reactstrap";
import CardWrapper from "../../../components/Common/CardWrapper";
import AuthCode from "react-auth-code-input";
import MetaTags from "react-meta-tags";
//i18n
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { 
  generateQRCodeStart,
  verify2FACodeStart,
  // verifyFirst2FACodeStart,
  // disableTwoFactorAuth,
} from "store/general/auth/twoFactorAuth/actions";

function TwoFA(props) {
  const [twoFACode, setTwoFACode] = useState();
  const [showVerification, setShowVerification] = useState(false);
  const { clientData } = useSelector(state=>state.Profile);
  const { verifyCode, generateQR } = useSelector(state=>state.twoFactorAuthReducer);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
  const dispatch = useDispatch();
  const focusInput2FA = (digits) => {
    const activeInputs = document.querySelectorAll(".twofa-input.active");
    const inputs = document.querySelectorAll(".twofa-input");
    if (activeInputs.length > digits.toString().length)
      activeInputs[activeInputs.length - 1]?.classList.remove("active");
    else
      inputs[digits.toString().length - 1]?.classList.add("active");
    setTwoFACode(digits);
    if (digits.length === 6) enableDisableTwoFactorAuth(digits);
  };

  useEffect(() => {
    if (generateQR && generateQR.qrCode) {
      setShowVerification(true);
    } else {
      setShowVerification(false);
    }
  }, [generateQR.qrCode]);

  useEffect(()=>{
    if (verifyCode?.result?.type === "disable" && verifyCode.success) {
      setTwoFactorAuthEnabled(false);
    }
    if (verifyCode?.result?.type === "enable" && verifyCode.success) {
      setTwoFactorAuthEnabled(true);
    }
  }, [verifyCode]);

  useEffect(()=>{
    if (clientData && clientData.settings && clientData.settings.twoFactorAuthEnabled)
      setTwoFactorAuthEnabled(true);
  }, [clientData]);

  useEffect(()=>{
    if (verifyCode.disabled) 
      setShowVerification(false);
  }, [verifyCode.disabled]);

  const enable2FA = () => dispatch(generateQRCodeStart());
  const disable2FA = () => setShowVerification(true);
  const enableDisableTwoFactorAuth = 
    (code) => twoFactorAuthEnabled 
      ? dispatch(verify2FACodeStart({
        token: code || twoFACode,
        email: clientData && clientData.email && clientData.email.toLowerCase(),
        type: "disable",
      })) 
      : dispatch(verify2FACodeStart({
        token: code || twoFACode,
        email: clientData && clientData.email && clientData.email.toLowerCase(),
        type: "enable",
      }));

  const getCardData = () => {
    let buttonClick = enable2FA;
    let disabled = verifyCode.loading;
    let buttonText = props.t("Enable 2FA");
    let topText = props.t("2FA is not enabled");
    let buttonClass = "btn-success";
    let cdaLoading = generateQR.loading;
    if (twoFactorAuthEnabled) {
      buttonClick = disable2FA;
      disabled = verifyCode.loading;
      buttonText = props.t("Disable 2FA");
      topText = props.t("2FA is already enabled, click below to disable it");
      buttonClass = "btn-danger";
      cdaLoading = verifyCode.loading;
    }
    // const buttonClick = twoFactorAuthEnabled ? buttonClick : enable2FA;
    // const disabled = verifyCode.loading;
    // const buttonText = twoFactorAuthEnabled ? props.t("Disable 2FA") : props.t("Enable 2FA");
    // const topText = twoFactorAuthEnabled ? props.t("2FA is already enabled") : props.t("2FA is not enabled");
    // const buttonClass = twoFactorAuthEnabled ? "btn-danger" : "btn-success";
    return (
      <CardWrapper className="mb-5 p-4 glass-card shadow">
        <Row>
          <Col lg={12}>
            <h3 className="text-center color-primary">
              {topText}
            </h3>
            <div className="text-center mt-3">
              <Button 
                className={`btn ${buttonClass} w-lg `}
                onClick={buttonClick} 
                disabled={disabled}
              >
                {cdaLoading ? <Spinner/> : buttonText}
              </Button>
            </div>
          </Col>
        </Row>
      </CardWrapper>
    );
  };

  return (<>
    <div className="page-content">
      <MetaTags>
        <title>{props.t("Two Factor Authentication")}</title>
      </MetaTags>
      <Container className="mt-5">
        <h1 className="mb-3">{props.t("Two Factor Auth")}</h1>
        {getCardData()}
        {
          generateQR?.qrCode && (
            <CardWrapper className="mb-2 glass-card shadow">
              <Row className="justify-content-center">
                <Col className="mb-4" lg={6}>
                  <div className="border rounded text-center p-4">
                    {generateQR.loading ? <Spinner></Spinner> : 
                      <img src={generateQR.qrCode} alt="qr-code" width={200} height={200} />}
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="border rounded text-center p-4">
                    <p>{props.t("If you want to turn on 2FA, use Google Authenticator app to scan code,then enter six-digit code provided by the app to the form below.")}</p>
                    <Button className="btn-success w-lg mt-3">{props.t("Download 2FA App")}</Button>
                  </div>
                </Col>
              </Row>
            </CardWrapper>
          )
        }
        {showVerification && (
          <>
            <h1 className="mb-3">{props.t("Enter Six-Digit Code")}</h1>
            <CardWrapper className="glass-card shadow">
              <div>
                <AuthCode
                  characters={6}
                  className="form-control form-control-lg text-center w-100"
                  allowedCharacters="^[0-9]"
                  containerClassName="twofa-container"
                  inputClassName="twofa-input"
                  onChange={(a) => { focusInput2FA(a) }}></AuthCode>
              </div>
            </CardWrapper>
            <div className="text-center mt-3">
              <Button 
                className="btn btn-danger btn-sm w-lg" 
                onClick={enableDisableTwoFactorAuth} 
                disabled={verifyCode.loading}>
                {props.t("Verify")}
              </Button>
            </div>
          </>
        )}
      </Container>
    </div>
  </>);
}
export default withTranslation()(TwoFA); 