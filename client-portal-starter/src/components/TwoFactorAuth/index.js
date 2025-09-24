import React, {
  useEffect,
  useState
} from "react";
import {
  Button,
  Modal,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import CardWrapper from "components/Common/CardWrapper";
import AuthCode from "react-auth-code-input";
import { useDispatch, useSelector } from "react-redux";
import { verify2FACodeStart } from "store/general/auth/twoFactorAuth/actions";
import { toggleCurrentModal } from "store/actions";

  
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
      token: code || twoFACode,
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
      size="xl"
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">{props.t("Verify two factor authenication")}</h5>
        <button
          type="button"
          onClick={() => {
            dispatch(toggleCurrentModal(""));
          }}
          className="close btn btn-soft-dark waves-effect waves-light btn-rounded m-4"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <h1 className="mb-3">{props.t("Enter Six-Digit Code")}</h1>
        <CardWrapper>
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
          <Button disabled={verifyCode.loading} className="btn btn-danger btn-sm w-lg" onClick={()=>{
            verify();
          }}>{props.t("Verify")}</Button>
        </div>
      
      </div>
    </Modal>
  );
}
export default withTranslation()(TwoFactorAuth);