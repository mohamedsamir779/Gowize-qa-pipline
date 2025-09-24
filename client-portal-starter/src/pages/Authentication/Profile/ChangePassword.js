import { AvField, AvForm } from "availity-reactstrap-validation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Col,    Modal, Button, Label, Row 
} from "reactstrap";
import { changePasswordStart } from "store/general/auth/resetPassword/actions";

function ChangePassword({ isOpen, toggle }) {
  const { t } = useTranslation(); 
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();

  const confirmPassword = (value, ctx, input, cb) => {
    if (ctx.newPassword !== ctx.confirmPassword) cb("Password doesn't match!");
    else cb(true);
  };

  const handleValidSubmit = (event, values) => {
    const data = {
      password: values.oldPassword,
      newPassword: values.newPassword,
    };
    dispatch(changePasswordStart(data));
  };

  return ( <>
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      centered={true}
    >
      <div className="modal-header">
        <h5 className="modal-title mt-0">{t("Change Password")}</h5>
        <button
          type="button"
          onClick={() => {
            toggle(false);
          }}
          className="close"
          data-dismiss="modal"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        <AvForm onValidSubmit={handleValidSubmit}>
          <Row className="mt-3">
            <Col md="10" style={{
              paddingRight: "0px"
            }}>
              <Label>{t("Old Password")}</Label>
              <AvField
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                validate={{ 
                  required: {
                    value: true,
                    errorMessage: "Please enter old password"
                  }
                }}
                errorMessage="Please enter old password"
              />
            </Col>
            <Col md="2" className="mt-4" style={{
              paddingLeft: "0px"
            }} >
              <button className="btn btn-light ms-0" type="button" id="password-addon" onClick={()=>{ setShowOldPassword(!showOldPassword) }}>
                <i className="mdi mdi-eye-outline"></i>
              </button>
            </Col>
          </Row>         
          <Row className="mt-3">
            <Col md="10" style={{
              paddingRight: "0px"
            }}>
              <Label>{t("New Password")}</Label>
              <AvField
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                validate={{ 
                  required: {
                    value: true,
                    errorMessage: "Please enter new password"
                  },
                  minLength: {
                    value: 6,
                    errorMessage: "Password must be at least 6 characters"
                  },
                }}
                errorMessage="Please enter new password"
              />
            </Col>
            <Col md="2" className="mt-4" style={{
              paddingLeft: "0px"
            }} >
              <button className="btn btn-light ms-0" type="button" id="password-addon" onClick={()=>{ setShowNewPassword(!showNewPassword) }}>
                <i className="mdi mdi-eye-outline"></i>
              </button>
            </Col>
          </Row>         
          <Row className="mt-3">
            <Col md="10" style={{
              paddingRight: "0px"
            }}>
              <Label>{t("Confirm Password")}</Label>
              <AvField
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                validate={{ 
                  required: {
                    value: true,
                    errorMessage: "Please enter confirm password"
                  },
                  minLength: {
                    value: 6,
                    errorMessage: "Password must be at least 6 characters"
                  },
                  custom: confirmPassword,
                }}
                errorMessage="Please enter confirm password"
              />
            </Col>
            <Col md="2" className="mt-4" style={{
              paddingLeft: "0px"
            }} >
              <button className="btn btn-light ms-0" type="button" id="password-addon" onClick={()=>{ setShowConfirmPassword(!showConfirmPassword) }}>
                <i className="mdi mdi-eye-outline"></i>
              </button>
            </Col>
          </Row>         
          <Col md="12" className="mt-3">
            <div className="text-center mt-4">
              <Button type="submit" className="border-0 color-bg-btn shadow px-4">{t("Change Password")}</Button>
            </div>
          </Col>
        </AvForm>
      </div>
    </Modal>
  </> );
}

export default ChangePassword;