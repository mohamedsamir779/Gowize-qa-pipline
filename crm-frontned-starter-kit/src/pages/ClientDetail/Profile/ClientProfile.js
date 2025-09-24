import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Button, CardBody, CardHeader, CardTitle, Card, Input, Label
} from "reactstrap";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import AvFieldSelect from "components/Common/AvFieldSelect";
import parse from "html-react-parser";

// i18n 
import { withTranslation } from "react-i18next";
import {
  editClientDetails,
  updateEmploymentStatusStart,
  updateFinancialInfoStart
} from "store/client/actions";
import { fetchMarkupsStart } from "store/markups/actions";
import { fetchFeeGroupStart } from "store/feeGroups/actions";
import { fetchTransactionFeeGroupStart } from "store/transactionFeeGroups/actions";
import { assignAgentStart } from "store/users/actions";
import Loader from "components/Common/Loader";
import { LANGUAGES } from "common/languages";
import employmentStatus from "common/employmentStatus";
import professions from "common/profession";
import annualIncome from "common/annualIncome";
import sourceOfFunds from "common/souceOfFunds";
import { TITLES, YESNO } from "common/data/dropdowns";
import OrdersAddModal from "../orders/OrdersAddModal";
import ResetPassword from "./QuickActions/resetPassword";
import ClientAddBankAccountModal from "../Bank/ClientAddBankAccountModal";
import Transaction from "./QuickActions/Transaction";
import ConvertWallet from "./QuickActions/Wallet";
import PortalAccess from "./QuickActions/portalAccess";
import _ from "lodash";
import { useParams } from "react-router-dom";
import TodoAdd from "components/Common/TodoAdd";
import { enableCrypto, enableFX } from "config";
import ConvertToLive from "./QuickActions/convertToLive";
// import FxTransactions from "./QuickActions/FxTransactions";
import FxTransactions2 from "./QuickActions/FxTransactions2";
import SearchableAgentDropdown from "components/Common/SearchableAgentDropdown";
import TradingAccountsQuickActions from "./QuickActions/tradingAccounts";
import IbQuickActions from "./QuickActions/IbQuickActions";
import CallStatusDropdown from "components/Common/CallStatusDropdown";
import SendEmail from "./QuickActions/sendEmail";
import { Applications } from "./Applications";
import Personnels from "./Corporate/Personnels";
import OtherInfo from "./Corporate/OtherInfo";

function ClientDetails(props) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [convertToLiveModal, setConvertToLiveModal] = useState(false);
  const [clientData, setClientData] = useState(props.clientDetails);
  const [addNote, setAddNote] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [type, setType] = useState(false);
  const { clientId } = useParams();
  const dispatch = useDispatch();
  const { experience, financialInfo, tradingFeeId, markupId, transactionFeeId, declarations } = props.clientDetails;

  const loadUpdatedClientDetailsHandler = (e, values) => {
    if (isCorporate) {
      if (sameAddress) {
        const hqAddress = {
          address: values.address,
          city: values.city,
          country: values.country,
          zipCode: values.zipCode,
        };
        values.corporateInfo = {
          ...clientData.corporateInfo,
          ...values.corporateInfo,
          sameAddress: true,
          hqAddress,
        };
      } else {
        values.corporateInfo = {
          ...clientData.corporateInfo,
          ...values.corporateInfo,
          sameAddress: false,
        };
      }
    }
    delete values.password;
    dispatch(editClientDetails({
      values,
      id: clientId
    }));
  };
  const assignAgent = (e, values) => {
    dispatch(assignAgentStart({
      ...values,
      clientId
    }));
  };
  const updateFinancialInfo = (e, values) => {
    dispatch(updateFinancialInfoStart({
      values,
      id: clientId
    }));
  };
  const updateEmploymentInfo = (e, values) => {
    dispatch(updateEmploymentStatusStart({
      values,
      id: clientId
    }));
  };

  useEffect(() => {
    // dispatch(fetchClientDetails(clientId));
    dispatch(fetchMarkupsStart({
      limit: 100,
      page: 1
    }));
    dispatch(fetchFeeGroupStart({
      limit: 100,
      page: 1
    }));
    dispatch(fetchTransactionFeeGroupStart({
      limit: 100,
      page: 1
    }));
  }, []);

  useEffect(() => {
    if (!props.showPortalAccessModal && deleteModal) {
      setDeleteModal(false);
    }
  }, [props.showPortalAccessModal]);

  useEffect(() => {
    setClientData(props.clientDetails);
  }, [props.clientDetails]);

  const { isCorporate, corporateInfo = {} } = props.clientDetails;
  const { hqAddress, sameAddress: isSameAddress } = corporateInfo;
  const [sameAddress, setSameAddress] = useState(false);

  useEffect(() => {
    setSameAddress(isSameAddress);
  }, [isSameAddress]);

  return (
    <React.Fragment>
      {(props.clientProfileloading || props.usersLoading || props.dictLoading) &&
        <div className="d-flex justify-content-center">
          <Loader />
        </div>
      }
      {(!props.clientProfileloading && !props.usersLoading && !props.dictLoading) &&
        <div className="">
          <div className="container-fluid">
            <div>
              <Row>
                {/* input fields to the left side */}
                <Col md="9" sm="12" xs="12" className="mb-3">
                  <Card className="overflow-visible">
                    <CardHeader className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <CardTitle className="color-primary">{props.t("General information")}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <AvForm
                        onValidSubmit={(e, v) => {
                          loadUpdatedClientDetailsHandler(e, v);
                        }}
                      >
                        <div className="d-flex flex-column">
                          <Row>
                            {!isCorporate && <Col md="3">
                              <div>
                                <AvFieldSelect
                                  name="title"
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        title: e.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Title is required")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.title}
                                  label={props.t("Title")}
                                  options={TITLES.map((obj) => {
                                    return ({
                                      label: obj,
                                      value: obj
                                    });
                                  })}
                                />
                              </div>
                            </Col>}
                            <Col md="3">
                              <div>
                                <AvField
                                  name="firstName"
                                  label={props.t("First name")}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        firstName: e.target.value
                                      };
                                    });
                                  }}
                                  placeholder={props.t("Enter First Name")}
                                  type="text"
                                  errorMessage={props.t("Enter First Name")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.firstName}
                                />
                              </div>
                            </Col>
                            {!isCorporate && <Col md="3">
                              <div>
                                <AvField
                                  name="lastName"
                                  label={props.t("Last name")}
                                  placeholder={props.t("Enter Last Name")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        lastName: e.target.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Enter Last Name")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.lastName}
                                />
                              </div>
                            </Col>}
                            <Col md="3">
                              <div>
                                <AvField
                                  name="phone"
                                  label={props.t("Phone")}
                                  placeholder={props.t("Enter Phone")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        phone: e.target.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Phone is required")}
                                  validate={
                                    {
                                      required: { value: !props.clientDetails.isLead && true },
                                      pattern: {
                                        // eslint-disable-next-line no-useless-escape
                                        value: "/^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im",
                                        errorMessage: "Phone number must be digits only with country key"
                                      }
                                    }
                                  }
                                  value={props.clientDetails.phone}
                                />
                              </div>
                            </Col>
                            {!isCorporate && <Col md="3">
                              <div>
                                <AvField
                                  name="mobile"
                                  label={props.t("Mobile")}
                                  placeholder={props.t("Mobile")}
                                  type="text"
                                  onChange={(e) => {
                                    if (e.target.value == "") {
                                      setClientData((state) => {
                                        delete state.mobile;
                                        return { ...state };
                                      });
                                    } else
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          mobile: e.target.value
                                        };
                                      });
                                  }}
                                  validate={
                                    {
                                      pattern: {
                                        // eslint-disable-next-line no-useless-escape
                                        value: "/^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im",
                                        errorMessage: "Phone number must be digits only with country key"
                                      }
                                    }
                                  }
                                  value={props.clientDetails.mobile}
                                />
                              </div>
                            </Col>}
                            <Col md="3">
                              <div>
                                <AvField
                                  name="email"
                                  label={props.t("Email")}
                                  placeholder={props.t("Email")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        email: e.target.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Email is required")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.email}
                                />
                              </div>
                            </Col>
                            <Col md="3">
                              <div className="d-flex justify-content-between align-items-center" >
                                <AvField
                                  name="password"
                                  label={props.t("Password")}
                                  placeholder={props.t("Password")}
                                  type={showPassword ? "text" : "password"}                  
                                  value={props.clientDetails.password}
                                  disabled={true}
                                />
                                <button className="btn mt-3" type="button" onClick={()=>{ setShowPassword(!showPassword) }}>
                                  <i className="mdi mdi-eye-outline"></i>
                                </button>
                              </div>
                            </Col>
                            <Col md="3">
                              <div>
                                <AvField
                                  name="dob"
                                  label={props.t(`Date of ${isCorporate ? "Incorporation" : "Birth"}`)}
                                  placeholder={props.t("Enter Date of birth")}
                                  type="date"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      if (e.target.value == "") {
                                        setClientData((state) => {
                                          delete state.dob;
                                          return { ...state };
                                        });
                                      } else
                                        return {
                                          ...state,
                                          dob: e.target.value
                                        };
                                    });
                                  }}
                                  errorMessage={props.t("Enter Date of birth")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.dob}
                                />
                              </div>
                            </Col>
                            {!isCorporate && <Col md="3">
                              <div>
                                <AvFieldSelect
                                  name="nationality"
                                  label={props.t("Nationality")}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        nationality: e.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Nationality is required")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.nationality}
                                  options={props.countries.map((country) => {
                                    return ({
                                      label: `${country.en}`,
                                      value: country.en
                                    });
                                  })}
                                />
                              </div>
                            </Col>}
                            <Col md="3">
                              <AvFieldSelect
                                name="country"
                                label={props.t(`${isCorporate ? "Registered " : ""}Country`)}
                                onChange={(e) => {
                                  setClientData((state) => {
                                    return {
                                      ...state,
                                      country: e.value
                                    };
                                  });
                                }}
                                errorMessage={props.t("Country is required")}
                                validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                value={props.clientDetails.country}
                                options={props.countries.map((country) => {
                                  return ({
                                    label: `${country.en}`,
                                    value: country.en
                                  });
                                })}
                              />
                            </Col>
                            <Col md="3">
                              <AvField
                                name="city"
                                label={props.t(`${isCorporate ? "Registered " : ""}City`)}
                                placeholder={props.t("Enter City")}
                                type="text"
                                onChange={(e) => {
                                  setClientData((state) => {
                                    return {
                                      ...state,
                                      city: e.target.value
                                    };
                                  });
                                }}
                                errorMessage={props.t("Enter City")}
                                validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                value={props.clientDetails.city}
                              />
                            </Col>
                            <Col md="3">
                              <AvField
                                name="address"
                                label={props.t(`${isCorporate ? "Registered " : ""}Address`)}
                                placeholder={props.t("Address")}
                                type="text"
                                onChange={(e) => {
                                  setClientData((state) => {
                                    if (e.target.value == "") {
                                      setClientData((state) => {
                                        delete state.address;
                                        return { ...state };
                                      });
                                    } else
                                      return {
                                        ...state,
                                        address: e.target.value
                                      };
                                  });
                                }}
                                errorMessage={props.t("Address is required")}
                                validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                value={props.clientDetails.address}
                              />
                            </Col>
                            {!isCorporate && <>
                              <Col md="3">
                                <div>
                                  <AvField
                                    name="address2"
                                    label={props.t("Address Line 2")}
                                    placeholder={props.t("Address Line 2")}
                                    type="text"
                                    onChange={(e) => {
                                      if (e.target.value == "") {
                                        setClientData((state) => {
                                          delete state.address2;
                                          return { ...state };
                                        });
                                      } else
                                        setClientData((state) => {
                                          return {
                                            ...state,
                                            address2: e.target.value
                                          };
                                        });
                                    }}
                                    errorMessage={props.t("Address is required")}
                                    // validate={{ required: { value: true } }}
                                    value={props.clientDetails.address2}
                                  />
                                </div>
                              </Col>
                              <Col md="3">
                                <div>
                                  <AvFieldSelect
                                    name="gender"
                                    type="text"
                                    errorMessage={props.t("Gender is required")}
                                    validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                    value={props.clientDetails.gender}
                                    onChange={(e) => {
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          gender: e.value
                                        };
                                      });
                                    }}
                                    label={props.t("Gender")}
                                    options={[{
                                      value: "male",
                                      label: "Male"
                                    }, {
                                      value: "female",
                                      label: "Female"
                                    }]}
                                  />
                                </div>
                              </Col>
                            </>}
                            <Col md="3">
                              <div>
                                <AvField
                                  name="zipCode"
                                  label={props.t("Postal Code")}
                                  placeholder={props.t("Postal Code")}
                                  type="text"
                                  onChange={(e) => {
                                    if (e.target.value == "") {
                                      setClientData((state) => {
                                        delete state.zipCode;
                                        return { ...state };
                                      });
                                    } else
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          zipCode: e.target.value
                                        };
                                      });
                                  }}
                                  value={props.clientDetails.zipCode}
                                />
                              </div>
                            </Col>
                            <Col md="3">
                              <div>
                                <AvFieldSelect
                                  name="language"
                                  label={props.t("Language")}
                                  placeholder={props.t("Language")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        language: e.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Language is required")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.language}
                                  options={LANGUAGES}
                                />
                              </div>
                            </Col>
                            <Col md="3">
                              <div>
                                <AvField
                                  name="source"
                                  label={props.t("Source")}
                                  placeholder={props.t("Source")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        source: e.target.value
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Source is required")}
                                  validate={{ required: { value: !props.clientDetails.isLead && true } }}
                                  value={props.clientDetails.source}
                                />
                              </div>
                            </Col>
                            {!isCorporate && <>
                              <Col md="3">
                                <div>
                                  <AvFieldSelect
                                    name="usCitizen"
                                    type="text"
                                    onChange={(e) => {
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          usCitizen: e.value
                                        };
                                      });
                                    }}
                                    label={props.t("US Citizen")}
                                    errorMessage={props.t("US Citizen is required")}
                                    // validate={{ required: { value: true } }}
                                    value={props.clientDetails.usCitizen}
                                    options={YESNO}
                                  />
                                </div>
                              </Col>
                              <Col md="3">
                                <div>
                                  <AvField
                                    name="taxIdentificationNumber"
                                    label={props.t("Tax Identification Number")}
                                    placeholder={props.t("Tax Identification Number")}
                                    type="text"
                                    onChange={(e) => {
                                      setClientData((state) => {
                                        if (e.target.value == "") {
                                          setClientData((state) => {
                                            delete state.taxIdentificationNumber;
                                            return { ...state };
                                          });
                                        } else
                                          return {
                                            ...state,
                                            taxIdentificationNumber: e.target.value
                                          };
                                      });
                                    }}
                                    value={props.clientDetails.taxIdentificationNumber}
                                  />
                                </div>
                              </Col>
                              <Col md="3">
                                <div>
                                  <AvFieldSelect
                                    name="politicallyExposed"
                                    label={props.t("Politically exposed?")}
                                    placeholder={props.t("Politically exposed?")}
                                    type="text"
                                    onChange={(e) => {
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          politicallyExposed: e.value
                                        };
                                      });
                                    }}
                                    errorMessage={props.t("Politically exposed is required")}
                                    // validate={{ required: { value: true } }}
                                    value={props.clientDetails.politicallyExposed}
                                    options={YESNO}
                                  />
                                </div>
                              </Col>
                            </>}
                          </Row>
                          {!isCorporate && <Row>
                            <h6 className="mt-3 mb-4">{props.t("ID Details")}</h6>
                            {/* <h1 className="display-6 mb-0">{props.t("ID Details")}</h1> */}
                            <Col md="2">
                              <div>
                                <AvFieldSelect
                                  name="idDetails.type"
                                  label={props.t("ID Type")}
                                  placeholder={props.t("ID Type")}
                                  type="text"
                                  value={props.clientDetails.idDetails && props.clientDetails.idDetails.type}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        idDetails: {
                                          ...state.idDetails,
                                          type: e.value
                                        }
                                      };
                                    });
                                  }}
                                  options={[{
                                    value: "ID",
                                    label: "ID"
                                  }, {
                                    value: "PASSPORT",
                                    label: "Passport"
                                  }]}
                                />
                              </div>
                            </Col>
                            <Col md="3">
                              <div>
                                <AvFieldSelect
                                  name="idDetails.countryOfIssue"
                                  label={props.t("Country of Issue")}
                                  placeholder={props.t("Country of Issue")}
                                  value={props.clientDetails.idDetails && props.clientDetails.idDetails.countryOfIssue}
                                  options={props.countries.map((country) => {
                                    return ({
                                      label: `${country.en}`,
                                      value: country.en
                                    });
                                  })}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        idDetails: {
                                          ...state.idDetails,
                                          countryOfIssue: e.value
                                        }
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </Col>
                            <Col md="3">
                              <div>
                                <AvField
                                  name="idDetails.documentNo"
                                  label={props.t("ID Number")}
                                  placeholder={props.t("ID Number")}
                                  type="text"
                                  value={props.clientDetails.idDetails && props.clientDetails.idDetails.documentNo}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        idDetails: {
                                          ...state.idDetails,
                                          documentNo: e.value
                                        }
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </Col>
                            <Col md="2">
                              <div>
                                <AvField
                                  name="idDetails.dateOfIssue"
                                  label={props.t("Date of Issue")}
                                  placeholder={props.t("Date of Issue")}
                                  type="date"
                                  value={props.clientDetails.idDetails && props.clientDetails.idDetails.dateOfIssue}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        idDetails: {
                                          ...state.idDetails,
                                          dateOfIssue: e.value
                                        }
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </Col>
                            <Col md="2">
                              <div>
                                <AvField
                                  name="idDetails.dateOfExpiry"
                                  label={props.t("Date of expiry")}
                                  placeholder={props.t("Date of expiry")}
                                  type="date"
                                  value={props.clientDetails.idDetails && props.clientDetails.idDetails.dateOfExpiry}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        idDetails: {
                                          ...state.idDetails,
                                          dateOfExpiry: e.value
                                        }
                                      };
                                    });
                                  }}
                                />
                              </div>
                            </Col>
                          </Row>}
                          {isCorporate && <>
                            <span className="fs-5 fw-bold">{props.t("HQ Address")}</span>
                            <Label className="mt-2">
                              <Input type="checkbox" checked={sameAddress} onChange={(e) => {
                                setSameAddress(e.target.checked);
                              }
                              } ></Input>  {props.t("Same as registered address")}
                            </Label>
                            {!sameAddress && <Row>
                              <Col md="3">
                                <AvFieldSelect
                                  name="corporateInfo.hqAddress.country"
                                  label={props.t("Country")}
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          hqAddress: {
                                            ...state.hqAddress,
                                            country: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Country is required")}
                                  validate={{ required: { value: true } }}
                                  value={hqAddress?.country}
                                  options={props.countries.map((country) => {
                                    return ({
                                      label: `${country.en}`,
                                      value: country.en
                                    });
                                  })}
                                />
                              </Col>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.hqAddress.city"
                                  label={props.t("City")}
                                  placeholder={props.t("Enter City")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          hqAddress: {
                                            ...state.hqAddress,
                                            city: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Enter City")}
                                  validate={{ required: { value: true } }}
                                  value={hqAddress?.city}
                                />
                              </Col>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.hqAddress.address"
                                  label={props.t("Address")}
                                  placeholder={props.t("Address")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      if (e.target.value == "") {
                                        setClientData((state) => {
                                          delete state.address;
                                          return { ...state };
                                        });
                                      } else
                                        return {
                                          ...state,
                                          corporateInfo: {
                                            ...state.corporateInfo,
                                            hqAddress: {
                                              ...state.hqAddress,
                                              address: e.value
                                            }
                                          }
                                        };
                                    });
                                  }}
                                  errorMessage={props.t("Address is required")}
                                  validate={{ required: { value: true } }}
                                  value={hqAddress?.address}
                                />
                              </Col>
                            </Row>}
                            <span className="fs-5 fw-bold my-1">{props.t("Authorized Person")}</span>
                            <Row>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.authorizedPerson.firstName"
                                  label={props.t("First Name")}
                                  placeholder={props.t("Enter First Name")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          authorizedPerson: {
                                            ...state.authorizedPerson,
                                            firstName: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Enter First Name")}
                                  validate={{ required: { value: true } }}
                                  value={corporateInfo.authorizedPerson?.firstName}
                                />
                              </Col>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.authorizedPerson.lastName"
                                  label={props.t("Last Name")}
                                  placeholder={props.t("Enter Last Name")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          authorizedPerson: {
                                            ...state.authorizedPerson,
                                            lastName: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Enter Last Name")}
                                  validate={{ required: { value: true } }}
                                  value={corporateInfo.authorizedPerson?.lastName}
                                />
                              </Col>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.authorizedPerson.jobTitle"
                                  label={props.t("Job Title")}
                                  placeholder={props.t("Enter Job Title")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          authorizedPerson: {
                                            ...state.authorizedPerson,
                                            jobTitle: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Enter jobTitle")}
                                  validate={{ required: { value: true } }}
                                  value={corporateInfo.authorizedPerson?.jobTitle}
                                />
                              </Col>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.authorizedPerson.phone"
                                  label={props.t("Phone")}
                                  placeholder={props.t("Enter Phone")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          authorizedPerson: {
                                            ...state.authorizedPerson,
                                            phone: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  errorMessage={props.t("Enter Phone")}
                                  validate={{ required: { value: true } }}
                                  value={corporateInfo.authorizedPerson?.phone}
                                />
                              </Col>
                              <Col md="3">
                                <AvField
                                  name="corporateInfo.authorizedPerson.landline"
                                  label={props.t("Landline")}
                                  placeholder={props.t("Enter Landline")}
                                  type="text"
                                  onChange={(e) => {
                                    setClientData((state) => {
                                      return {
                                        ...state,
                                        corporateInfo: {
                                          ...state.corporateInfo,
                                          authorizedPerson: {
                                            ...state.authorizedPerson,
                                            landline: e.value
                                          }
                                        }
                                      };
                                    });
                                  }}
                                  value={corporateInfo.authorizedPerson?.landline}
                                />
                              </Col>
                              <Col md="3" className="align-self-end mb-2">
                                <div className="d-flex gap-2">
                                  <AvField
                                    name={"corporateInfo.authorizedPerson.politicallyExposed"}
                                    type="checkbox"
                                    value={corporateInfo.authorizedPerson?.politicallyExposed}
                                    onChange={(e) => {
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          corporateInfo: {
                                            ...state.corporateInfo,
                                            authorizedPerson: {
                                              ...state.authorizedPerson,
                                              politicallyExposed: e.value
                                            }
                                          }
                                        };
                                      });
                                    }}
                                  />
                                  <Label>{props.t("Politically Exposed")}</Label>
                                </div>
                              </Col>
                              <Col md="3" className="align-self-end mb-2">
                                <div className="d-flex gap-2">
                                  <AvField
                                    name={"corporateInfo.authorizedPerson.workedInFinancial"}
                                    type="checkbox"
                                    value={corporateInfo.authorizedPerson?.workedInFinancial}
                                    onChange={(e) => {
                                      setClientData((state) => {
                                        return {
                                          ...state,
                                          corporateInfo: {
                                            ...state.corporateInfo,
                                            authorizedPerson: {
                                              ...state.authorizedPerson,
                                              workedInFinancial: e.value
                                            }
                                          }
                                        };
                                      });
                                    }}

                                  />
                                  <Label>{props.t("Worked in Financial")}</Label>
                                </div>
                              </Col>
                            </Row>
                          </>}

                        </div>
                        <div className="d-flex justify-content-end">
                          <div className="p-4">
                            <Button
                              disabled={props.updating || _.isEqual(clientData, props.clientDetails)}
                              type="submit"
                              color="primary"
                            >
                              {props.t("Update")}
                            </Button>
                          </div>
                        </div>
                      </AvForm>

                    </CardBody>
                  </Card>
                  <Row>
                    <Col md="6">
                      <Card style={{
                        overflow: "visible",
                      }}>
                        <CardBody style={{ position: "relative" }}>
                          <AvForm
                            onValidSubmit={(e, v) => {
                              assignAgent(e, v);
                            }}
                          >
                            <Row className="align-items-center">
                              <Col>
                                <SearchableAgentDropdown
                                  isRequired={true}
                                  clientData={props?.clientDetails || null}
                                />
                              </Col>
                              <Col md="2" className="d-flex align-items-end justify-content-center">
                                <Button
                                  className="mt-3"
                                  disabled={props.updating}
                                  type="submit"
                                  color="primary"
                                >
                                  {props.t("Update")}
                                </Button>
                              </Col>
                            </Row>
                          </AvForm>
                        </CardBody>
                      </Card>
                    </Col>
                    <Col md="6">
                      <Card style={{
                        overflow: "visible",
                      }} className="pb-2">
                        <CardBody style={{ position: "relative" }}>
                          <CallStatusDropdown
                            label="Call Status"
                            client={props?.clientDetails}
                          />
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Col>
                {/* quick actions to the right side */}
                <Col md="3" sm="12" xs="12" className="mb-3">
                  <Card>
                    <CardHeader className="d-flex flex-column gap-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <CardTitle className="color-primary">{props.t("Quick actions")}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardBody className="p-0">
                      {/* first action space */}
                      <CardBody className="quick-actions-card">
                        <p className="quick-actions-heading">Client</p>
                        <div className="btn-container">
                          <PortalAccess clientDetails={props.clientDetails} clientId={clientId} />
                          <ResetPassword clientDetails={props.clientDetails} clientId={clientId} />
                          <ConvertToLive clientId={clientId} isDisabled={!props.clientDetails?.isLead} open={convertToLiveModal} setOpen={setConvertToLiveModal} />
                        </div>
                      </CardBody>
                      {enableCrypto && (
                        <CardBody className="quick-actions-card">
                          <p className="quick-actions-heading">Crypto</p>
                          <div className="btn-container">
                            <ConvertWallet clientId={clientId} isLead={props.clientDetails.isLead} />
                            <OrdersAddModal buttonText="Open Order" isLead={props.clientDetails.isLead} />
                            <Transaction clientId={clientId} isLead={props.clientDetails.isLead} />
                          </div>
                        </CardBody>
                      )}
                      {enableFX && (
                        <CardBody className="quick-actions-card">
                          <p className="quick-actions-heading">Forex</p>
                          <div className="btn-container">
                            {/* <FxTransactions clientId={clientId} isLead={props.clientDetails.isLead}/> */}
                            <FxTransactions2 clientId={clientId} isLead={props.clientDetails.isLead} />
                          </div>
                        </CardBody>
                      )}
                      {enableFX && <TradingAccountsQuickActions clientId={clientId} />}
                      {enableFX && <IbQuickActions clientDetails={props.clientDetails} clientId={clientId} convertToIb={props?.convertToIb} />}
                      <CardBody className="quick-actions-card">
                        <p className="quick-actions-heading">Communication</p>
                        <div className="btn-container">
                          <SendEmail clientData={props.clientDetails} isLead={props.clientDetails.isLead} />
                        </div>
                      </CardBody>
                      <CardBody className="quick-actions-card">
                        <p className="quick-actions-heading">Misc</p>
                        <div className="btn-container">
                          <button type="button" className="btn btn-primary waves-effect waves-light w-100"
                            onClick={() => {
                              setType(1);
                              setAddNote(true);
                            }}
                          >
                            {props.t("Add Reminder")}
                          </button>
                          <button type="button" className="btn btn-primary waves-effect waves-light w-100"
                            onClick={() => {
                              setType(0);
                              setAddNote(true);
                            }}
                          >
                            {props.t("Add Task")}
                          </button>
                          <button type="button" className="btn btn-primary waves-effect waves-light w-100"
                            onClick={() => {
                              setType(2);
                              setAddNote(true);
                            }}
                          >
                            {props.t("Add Note")}
                          </button>
                          <button type="button" className="btn btn-primary waves-effect waves-light w-100"
                            onClick={() => {
                              setType(3);
                              setAddNote(true);
                            }}
                          >
                            {props.t("Add Remark")}
                          </button>
                          <TodoAdd
                            show={addNote}
                            selectedClient={clientData}
                            onClose={() => { setAddNote(false) }}
                            hidenAddButton={true}
                            type={type}
                          />
                          <ClientAddBankAccountModal clientId={clientId} isLead={props.clientDetails.isLead} buttonText="Open Bank" />
                          {/* <button type="button" disabled={props.clientDetails.isLead} className="btn btn-primary waves-effect waves-light w-100">
                            Print application
                          </button> */}
                        </div>
                      </CardBody>
                    </CardBody>
                  </Card>
                  {enableCrypto && (
                    <Card className="overflow-visible">
                      <CardBody>
                        <AvForm onValidSubmit={(e, v) => {
                          dispatch(editClientDetails({
                            id: clientId,
                            values: { ...v }
                          }));
                        }}>
                          <Row>
                            <Col md="12">
                              <AvFieldSelect
                                label="Trading Fee"
                                name="tradingFeeId"
                                value={tradingFeeId?._id ? tradingFeeId._id : ""}
                                validate={{ required: { value: true } }}
                                options={props.feeGroups.map(feeGroup => {
                                  return {
                                    label: feeGroup.title,
                                    value: feeGroup._id
                                  };
                                })}
                              />
                            </Col>
                            <Col md="12">
                              <div>
                                <AvFieldSelect
                                  label="Transaction Fee"
                                  name="transactionFeeId"
                                  value={transactionFeeId?._id ? transactionFeeId._id : ""}
                                  options={props.transactionFeeGroups.map(transactionFeeGroup => {
                                    return {
                                      label: transactionFeeGroup.title,
                                      value: transactionFeeGroup._id
                                    };
                                  })}

                                />
                              </div>
                            </Col>
                            <Col md="12">
                              <div>
                                <AvFieldSelect
                                  label="Markup"
                                  name="markupId"
                                  value={markupId?._id ? markupId._id : ""}
                                  options={props.markups.map(markup => {
                                    return {
                                      label: markup.title,
                                      value: markup._id
                                    };
                                  })}
                                />
                              </div>
                            </Col>
                            <div className="d-flex justify-content-end">
                              <div className="p-4">
                                <Button
                                  disabled={props.updating}
                                  type="submit"
                                  color="primary"
                                >
                                  {props.t("Update")}
                                </Button>
                              </div>
                            </div>
                          </Row>
                        </AvForm>
                      </CardBody>
                    </Card>
                  )}
                </Col>
                <Col>
                  {!isCorporate
                    ? <Row>
                      <Col md="6" sm="12" xs="12">
                        <Card className="overflow-visible">
                          <CardHeader>
                            <CardTitle className="color-primary">Employment Info</CardTitle>
                          </CardHeader>

                          <CardBody>
                            <AvForm onValidSubmit={(e, v) => {
                              updateEmploymentInfo(e, v);
                            }}>
                              <Row>
                                <Col>
                                  <div>
                                    <AvFieldSelect
                                      name="employmentStatus"
                                      type="text"
                                      value={experience?.employmentStatus ? experience.employmentStatus : ""}
                                      errorMessage={props.t("Employment Status is required")}
                                      validate={{ required: { value: true } }}
                                      label={props.t("Employment Status")}
                                      options={employmentStatus.map((obj) => {
                                        return ({
                                          label: obj,
                                          value: obj
                                        });
                                      })}
                                    />
                                  </div>
                                </Col>
                                <Col>
                                  <div>
                                    <AvFieldSelect
                                      name="profession"
                                      label={props.t("Indusrtry")}
                                      placeholder={props.t("Industry is required")}
                                      type="text"
                                      value={experience?.profession ? experience.profession : ""}
                                      errorMessage={props.t("Industry is required")}
                                      validate={{ required: { value: true } }}
                                      options={professions.map((obj) => {
                                        return ({
                                          label: obj,
                                          value: obj
                                        });
                                      })}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <div className="mt-4">
                                    <AvField name="jobTitle"
                                      value={experience?.jobTitle ? experience.jobTitle : ""}
                                      label="Job Industry" />
                                  </div>
                                </Col>
                                <Col>
                                  <div className="mt-4">
                                    <AvField
                                      value={experience?.employer ? experience.employer : ""}
                                      name="employer"
                                      label="Employer" />
                                  </div>
                                </Col>
                              </Row>
                              <div className="d-flex justify-content-end">
                                <div className="p-4">
                                  <Button
                                    disabled={props.employmentInfoUpdating}
                                    type="submit"
                                    color="primary"
                                  >
                                    {props.t("Update")}
                                  </Button>
                                </div>
                              </div>
                            </AvForm>
                          </CardBody>
                        </Card>
                      </Col>
                      <Col md="6" sm="12" xs="12">
                        <Card className="overflow-visible">
                          <CardHeader>
                            <CardTitle className="color-primary">Financial Info</CardTitle>
                          </CardHeader>
                          <CardBody>
                            <AvForm onValidSubmit={(e, v) => {
                              updateFinancialInfo(e, v);
                            }}>
                              <Row>
                                <Col >
                                  <div>
                                    <AvFieldSelect
                                      name="annualIncome"
                                      type="text"
                                      errorMessage={props.t("Annual Income Status is required")}
                                      validate={{ required: { value: true } }}
                                      value={financialInfo?.annualIncome ? financialInfo.annualIncome : ""}
                                      label={props.t("Annual Income")}
                                      options={annualIncome.map((obj) => {
                                        return ({
                                          label: obj,
                                          value: obj
                                        });
                                      })}
                                    />
                                  </div>
                                </Col>
                                <Col>
                                  <div>
                                    <AvFieldSelect
                                      name="sourceOfFunds"
                                      label={props.t("Soucre of Funds")}
                                      placeholder={props.t("Industry is required")}
                                      type="text"
                                      value={financialInfo?.sourceOfFunds ? financialInfo.sourceOfFunds : ""}
                                      errorMessage={props.t("Source of Funds is required")}
                                      validate={{ required: { value: true } }}
                                      options={sourceOfFunds.map((obj) => {
                                        return ({
                                          label: obj,
                                          value: obj
                                        });
                                      })}
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <div className="mt-4">
                                  <AvFieldSelect
                                    label="Worked in Financial?"
                                    name="workedInFinancial"
                                    value={financialInfo?.workedInFinancial ?? ""}
                                    errorMessage={props.t("This field is required")}
                                    validate={{ required: { value: true } }}
                                    options={YESNO}
                                  />
                                </div>
                              </Row>
                              <div className="d-flex justify-content-end">
                                <div className="p-4">
                                  <Button
                                    disabled={props.financialInfoUpdating}
                                    type="submit"
                                    color="primary"
                                  >
                                    {props.t("Update")}
                                  </Button>
                                </div>
                              </div>
                            </AvForm>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>
                    : <Personnels clientId={clientId} />}
                </Col>
                <Row>
                  {declarations && declarations.length > 0 &&
                    <Col md="6" sm="12" xs="12">
                      <Card>
                        <CardHeader className="d-flex flex-column gap-3">
                          <div className="d-flex justify-content-between align-items-center">
                            <CardTitle className="color-primary">{props.t("Declarations")}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardBody >
                          {declarations && declarations.length > 0 && declarations.map((declaration, index) => {
                            return <div className="d-flex gap-3 align-items-start" key={index}>
                              <input type="checkbox" className="d-block" checked={true} />
                              <p style={{ fontSize: "11px" }}>{parse(declaration)}</p>
                            </div>;
                          })}
                        </CardBody>
                      </Card>
                    </Col>}
                  <Col md="6" sm="12" xs="12">
                    {isCorporate && <OtherInfo info={clientData.corporateInfo} />}
                  </Col>
                  <Col md="6" sm="12" xs="12">
                    <Applications />
                  </Col>
                </Row>
              </Row>
            </div>
          </div>
        </div>
      }
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  clientProfileloading: state.clientReducer.clientProfileloading,
  updating: state.clientReducer.updating,
  convertToIb: state.clientReducer.convertToIb,
  convertToLive: state.clientReducer.convertToLive,
  clientDetails: state.clientReducer.clientDetails,
  editError: state.clientReducer.editError,
  editErrorDetials: state.clientReducer.editErrorDetails,
  updatedClientDetails: state.clientReducer.updatedClientDetails,
  editSuccess: state.clientReducer.editSuccess,
  usersDocs: state.usersReducer.salesAgent,
  usersLoading: state.usersReducer.loading,
  countries: state.dictionaryReducer.countries || [],
  dictLoading: state.dictionaryReducer.loading,
  markups: state.markupsReducer.markups || [],
  transactionFeeGroups: state.transactionFeeGroupReducer.transactionFeeGroups || [],
  feeGroups: state.feeGroupReducer.feeGroups || [],
  employmentInfoUpdating: state.clientReducer.employmentInfoUpdating,
  financialInfoUpdating: state.clientReducer.financialInfoUpdating,
  showPortalAccessModal: state.clientReducer.showPortalAccessModal
});

export default connect(mapStateToProps, null)(withTranslation()(ClientDetails));