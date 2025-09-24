import React, {
  useEffect,
  useState
} from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import AuthCode from "react-auth-code-input";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal, verify2FACodeStart } from "store/actions";
import { ModalTitle } from "react-bootstrap";

function TwoFactorAuth(props) {
  const [twoFACode, setTwoFACode] = useState();
  const { verifyCode } = useSelector(state=>state.twoFactorAuthReducer);
  const dispatch = useDispatch();
  const focusInput2FA = (digits) => {
    const activeInputs = document.querySelectorAll(".twofa-input.active");
    const inputs = document.querySelectorAll(".twofa-input");
    if (activeInputs.length > digits.toString().length)
      activeInputs[activeInputs.length - 1]?.classList.remove("active");
    else
      inputs[digits.toString().length - 1]?.classList.add("active");
    setTwoFACode(digits);
    if (digits.length === 6) verify(digits);
  };
  const verify = async (code) => {
    dispatch(verify2FACodeStart({
      code: code || twoFACode,
      email: props.email && props.email.toLowerCase(),
      history: props.history,
      type: props.type,
    }));
  };

  useEffect(()=>{
    if (verifyCode.error && verifyCode.error.length > 0)
      setTwoFACode("");
  }, [verifyCode.error]);

  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggleOpen}
      centered={true}
      size="lg"
    >
      <ModalHeader toggle={() => {
        dispatch(toggleCurrentModal(""));
      }}>
        <ModalTitle>{props.t("Two Factor Authentication Code")}</ModalTitle>
      </ModalHeader>
      <ModalBody className="text-center my-2">
        <AuthCode
          characters={6}
          allowedCharacters="^[0-9]"
          containerClassName="twofa-container"
          inputClassName="twofa-input"
          onChange={(a) => { focusInput2FA(a) }}></AuthCode>
        <Button color="primary" disabled={verifyCode.loading} className="mt-4 w-md" onClick={()=>{
          verify();
        }}>{props.t("Verify")}</Button>     
      </ModalBody>
    </Modal>
  );
}
export default withTranslation()(TwoFactorAuth);