/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Button,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { useTranslation } from "react-i18next";
import AuthCode from "react-auth-code-input";

import EditProfileData from "./EditProfileData";
import EditProfilePassword from "./EditProfilePassword";

import { generateQRCodeStart, verify2FACodeStart } from "store/actions";
import ReactSelect from "react-select";
import moment from "moment-timezone";
import { editUser } from "store/users/actions";
import EmailConfig from "./EmailConfig";
import SalesDedicatedLinks from "pages/Dashboard/SalesTab/SalesDedicatedLinks";
import PushNotificationSettings from "./PushNotificationSettings";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { userData, settings } = useSelector((state) => ({
    userData: state.Profile.userData,
    settings: state.Profile.settings,
  }));

  const [modal, setModal] = useState(false);
  const [modalPass, setModalPass] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };
  const togglePass = () => {
    setModalPass(!modalPass);
  };

  //2fa
  const [twoFACode, setTwoFACode] = useState();
  const [showVerification, setShowVerification] = useState(false);
  const { verifyCode, generateQR } = useSelector(
    (state) => state.twoFactorAuthReducer
  );
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(false);
  const focusInput2FA = (digits) => {
    const activeInputs = document.querySelectorAll(".twofa-input.active");
    const inputs = document.querySelectorAll(".twofa-input");
    if (activeInputs.length > digits.toString().length)
      activeInputs[activeInputs.length - 1]?.classList.remove("active");
    else inputs[digits.toString().length - 1]?.classList.add("active");
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

  useEffect(() => {
    if (verifyCode?.result?.type === "disable" && verifyCode.success) {
      setTwoFactorAuthEnabled(false);
    }
    if (verifyCode?.result?.type === "enable" && verifyCode.success) {
      setTwoFactorAuthEnabled(true);
    }
  }, [verifyCode]);

  useEffect(() => {
    if (settings.twoFactorAuthEnabled) setTwoFactorAuthEnabled(true);
  }, [settings.twoFactorAuthEnabled]);

  useEffect(() => {
    if (verifyCode.disabled) setShowVerification(false);
  }, [verifyCode.disabled]);

  const enable2FA = () => dispatch(generateQRCodeStart());
  const disable2FA = () => setShowVerification(true);
  const enableDisableTwoFactorAuth = (code) =>
    twoFactorAuthEnabled
      ? dispatch(
          verify2FACodeStart({
            code: code || twoFACode,
            type: "disable",
            email: userData.email,
          })
        )
      : dispatch(
          verify2FACodeStart({
            code: code || twoFACode,
            type: "enable",
            email: userData.email,
          })
        );
  const getCardData = () => {
    let buttonClick = enable2FA;
    let disabled = verifyCode.loading;
    let buttonText = t("Enable");
    let topText = t("Disabled");
    let buttonClass = "btn-success";
    let cdaLoading = generateQR.loading;
    if (twoFactorAuthEnabled) {
      buttonClick = disable2FA;
      disabled = verifyCode.loading;
      buttonText = t("Disable");
      topText = t("Enabled");
      buttonClass = "btn-danger";
      cdaLoading = verifyCode.loading;
    }
    return (
      <>
        <h4>Two Factor Auth ({topText})</h4>
        <Button
          className={buttonClass}
          onClick={buttonClick}
          disabled={disabled}
        >
          {cdaLoading ? <Spinner /> : buttonText}
        </Button>
      </>
    );
  };

  const { layoutMode } = useSelector(state => state.Layout);

  const customStyles = {
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#495057",
      padding: 0,
      paddingRight: "5px",
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: "none"
    }),
    control: (provided) => {
      if (layoutMode === "dark") {
        return {
          ...provided,
          backgroundColor: "#19283B",
          border: 0,
          boxShadow: "0 0.125rem 0.25rem #0B182F",
          color: "#adb5bd",
          height: "100%",
        };
      }
      return {
        ...provided,
        height: "100%",
      };
    },
    menu: (provided) => ({
      ...provided,
      backgroundColor: layoutMode === "dark" ? "#242632" : "white",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      zIndex: 3,
    }),
    option: (provided, state) => ({
      ...provided,
      display: state.isDisabled ? "none" : "flex",
      flexDirection: "row",
      alignItems: "center",
      color: layoutMode === "dark" ? "#adb5bd" : "#495057",
    }),
    singleValue: (provided) => {
      return {
        ...provided,
        flexDirection: "row",
        alignItems: "center",
        color: layoutMode === "dark" ? "#adb5bd" : "#495057",
      };
    },
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>{t("User Profile")}</title>
        </MetaTags>
        <Container fluid>
          <Row>
            <Col lg="12">
              <Card style={{ overflow: "visible" }}>
                <CardBody>
                  <div className="flex-column">
                    <div className="d-flex pull-right">
                      <Link
                        className="text-success"
                        to="#"
                        style={{
                          marginRight: "25px",
                        }}
                      >
                        <i
                          className="mdi mdi-key-variant font-size-18"
                          id="edittooltip"
                          onClick={togglePass}
                        ></i>
                      </Link>
                      <Link className="text-success" to="#">
                        <i
                          className="mdi mdi-pencil font-size-18"
                          id="editt"
                          onClick={toggle}
                        ></i>
                      </Link>
                    </div>
                    <Row className="w-100">
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">
                            <h4>{t("First Name")}</h4>
                          </div>
                          <div className="card-subtitle">
                            {userData.firstName}
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">
                            <h4> {t("Last Name")}</h4>
                          </div>
                          <div className="card-subtitle">
                            {userData.lastName}
                          </div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">
                            <h4>{t("Roles")}</h4>
                          </div>
                          <div className="card-subtitle">{userData.role}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">
                            <h4>{t("E-Mail")}</h4>
                          </div>
                          <div className="card-subtitle">{userData.email}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">
                            <h4> {t("Phone")}</h4>
                          </div>
                          <div className="card-subtitle">{userData.phone}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">
                            <h4>{t("Mobile")}</h4>
                          </div>
                          <div className="card-subtitle">{userData.mobile}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header">
                          <div className="card-title">{getCardData()}</div>
                        </div>
                      </Col>
                      <Col xs={12} md={4}>
                        <div className="card-header" style={{ width: "18rem" }}>
                          <div className="card-title">
                            <h4>{t("Timezone")}</h4>
                          </div>
                          {settings && <ReactSelect
                            options={moment.tz.names().map((tz) => ({
                              value: tz,
                              label: `${tz} - ${moment.tz(tz).format("h:mma z")}`,
                            }))}
                            defaultValue={settings.timezone && {
                              value: settings.timezone,
                              label: `${settings.timezone} - ${moment.tz(settings.timezone).format("h:mma z")}`,
                            }}
                            styles={customStyles}
                            onChange={(e) => {
                              // make a copy of settings
                              const payload = { ...settings };
                              delete payload.localAndClientPushNotifications;
                              dispatch(editUser({
                                id: userData._id,
                                values: {
                                  settings: {
                                    ...payload,
                                    timezone: e.value,
                                  }
                                },
                              }));
                            }}
                          />}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </CardBody>
              </Card>
              {/* ************ modal Edit User form*************** */}
              {
                <EditProfileData
                  open={modal}
                  user={userData}
                  onClose={() => {
                    toggle();
                  }}
                />
              }
              {
                <EditProfilePassword
                  openPass={modalPass}
                  userPass={userData}
                  onClosePass={() => {
                    togglePass();
                  }}
                />
              }
            </Col>
          </Row>
        </Container>
        <Container>
          {generateQR?.qrCode && (
            <Card className="pb-3">
              <Row className="justify-content-center">
                <Col className="text-center" lg={6}>
                  {generateQR.loading ? (
                    <Spinner></Spinner>
                  ) : (
                    <img
                      src={generateQR.qrCode}
                      alt="qr-code"
                      width={200}
                      height={200}
                    />
                  )}
                  <p>
                    {t(
                      "Use the authencator app on your phone to scan the QR code above."
                    )}
                  </p>
                </Col>
              </Row>
            </Card>
          )}
          {showVerification && (
            <Card className="py-3 text-center">
              <AuthCode
                characters={6}
                allowedCharacters="^[0-9]"
                containerClassName="twofa-container"
                inputClassName="twofa-input"
                onChange={(a) => {
                  focusInput2FA(a);
                }}
              ></AuthCode>
              <div>
                <Button
                  color="primary"
                  className="mt-3 w-md"
                  onClick={enableDisableTwoFactorAuth}
                  disabled={verifyCode.loading}
                >
                  {t("Verify")}
                </Button>
              </div>
            </Card>
          )}
        </Container>
        <Container fluid>
          <Row className="col-card-same-height">
            <Col lg={6}>
              <PushNotificationSettings />
            </Col>
            <Col lg={6}>
              <SalesDedicatedLinks />
              <EmailConfig userId={userData._id} />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
