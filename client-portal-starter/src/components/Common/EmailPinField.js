/* eslint-disable quotes */
/* eslint-disable object-property-newline */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col } from "reactstrap";
import {
  Field as FormikField, 
} from "formik";
import { CustomInput } from "components/Common/CustomInput";
import { sendEmailPinAPI, verifyEmailPinAPI } from "apis/register";
import _ from "lodash";

function EmailPinField(props) {
  const { t } = useTranslation();
  const [havePin, setHavePin] = useState(false);
  const [verifingPin, setVerifingPin] = useState(false);
  const [verifiedPin, setVerifiedPin] = useState(false);
  const [pinBtnText, setPinBtnText] = useState(t("Send PIN"));
  const [storeEmaill, setStoreEmail] = useState();
  const { values, errors, setFieldTouched, setFieldValue, setFieldError, touched, isPinVerified, setIsPinVerified } = props;

  const sendPin = async () => {
    setPinBtnText(t("Sending"));
    setHavePin(true);
    setStoreEmail(values.email);
    setFieldTouched("emailPin", true);
    const res = await sendEmailPinAPI({ email: values.email.toLowerCase() });
    if (res.status) {
      setHavePin(true);
      setPinBtnText(t("Enter PIN"));
    } else {
      setHavePin(false);
      setPinBtnText(t("Send PIN"));
      if (setFieldError)
        setFieldError("emailPin", t(res));
    }
  };

  const verifyEmailPin = async (email, emailPin, errors, setFieldTouched) => {
    setVerifingPin(true);
    setPinBtnText(t("Verifying"));
    const resp = await verifyEmailPinAPI({
      email,
      emailPin 
    });
    if (resp.status) {
      setVerifingPin(false);
      setVerifiedPin(true);
      setPinBtnText(t("PIN Verified"));
      setIsPinVerified(true);
    } else {
      setVerifingPin(false);
      setPinBtnText(t("Enter PIN"));
      if (setFieldError)
        setFieldError("emailPin", t("PIN must be verfied"));
      setFieldTouched(t("emailPin"));
    } 
  };

  useEffect(()=>{
    if (_.isEqual(storeEmaill, values.email) === false ) {
      setHavePin(false);
      setPinBtnText(t("Send PIN"));
      setFieldError("emailPin", "");
    } else {
      setHavePin(true);
      setPinBtnText(t("Enter PIN"));
      setFieldError("emailPin", "");
    }
  }, [values.email]);

  return ( <>
    <Col xs={12} className="d-flex align-items-center">
      <div className="mb-3">
        <Button style={{ border: "1px solid #E4B200", borderTopRightRadius: '0px',  borderBottomRightRadius: '0px', borderTopLeftRadius: '24px', borderBottomLeftRadius: '24px', backgroundColor: "#E4B200" }} disabled={havePin || errors.email || verifiedPin || verifingPin} onClick={sendPin}>
          {t(pinBtnText)}
        </Button>
      </div>
      <div className="flex-grow-1">
        <FormikField
          component={CustomInput}
          name="emailPin"
          className={"mb-3"}
          style={{ 
            borderTopRightRadius: '24px',  borderBottomRightRadius: '24px',
            borderTopLeftRadius: '0px', borderBottomLeftRadius: '0px',
            borderLeft: "none"
          }}
          type={"number"}
          min={0}
          placeholder={t("Enter Pin")}
          disabled={!havePin || verifingPin || verifiedPin}
          invalid={false}
          onChange={(e)=>{
            if (e.target.value?.length === 4){
              verifyEmailPin(values.email, e.target.value, errors, setFieldTouched);
            }
            setFieldValue("emailPin", e.target.value);
          }}
        >
        </FormikField>
      </div>
    </Col>
    {errors.emailPin && touched.emailPin && (
      <div className="mb-4 text-center text-danger">
        {t(errors.emailPin)}
      </div>
    )}
    {havePin && !isPinVerified && (
      <div className="mb-4 text-center text-danger">
        {t("PIN sent to your email, please verify")}
      </div>
    )}
    {havePin && isPinVerified && ( 
      <div className="mb-4 text-center text-success">
        {t("PIN verified successfully")}
      </div>)}
    {}
  </> );
}

export default EmailPinField;