import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  AvForm, AvField
} from "availity-reactstrap-validation";
import {
  Row, Col, CardBody, CardTitle, Button, Modal, ModalHeader
} from "reactstrap";
import moment from "moment";
//i18n
import { withTranslation } from "react-i18next";
import AvFieldSelect from "components/Common/AvFieldSelect";
import {
  TITLES, LANGUAGES, INDUSTRIES, EMPLOYMENT_STATUS, ANNUAL_INCOME, SOURCE_OF_FUNDS, YESNO, GENDER
} from "common/data/dropdowns";
import {
  CLIENT_AGREEMENT, IB_AGREEMENT, COUNTRY_REGULATIONS, E_SIGNATURE
} from "declarations";
import { submitIndProfile } from "store/general/auth/profile/actions";
import parse from "html-react-parser";
import { CloseButton } from "react-bootstrap";
import { CUSTOMER_SUB_PORTALS } from "common/constants";

const SubmitProfile = (props) => {
  const [empStatus, setEmpStatus] = useState("");
  const dispatch = useDispatch();
  return (<React.Fragment>
    <Modal
      isOpen={props.isOpen}
      toggle={props?.toggle}
      centered={true}
      size="lg"
      className='custom-modal'
      style={{
        overflow: "hidden",
        background: "transparent",
      }}
    >
      <ModalHeader className="d-flex flex-column gap-3">
        <CloseButton
          onClick={props?.toggle}
          style={{
            alignSelf: "flex-end",
            position: "absolute",
            right: 10,
            top: 10
          }}
        />
        <div className="text-center">
          <CardTitle className="mb-0">{props.t("Update Profile")}</CardTitle>
        </div>
      </ModalHeader>
      <CardBody
        style={{
          overflow: "auto",
          padding: 20,
        }}
      >
        {props.profile._id &&
            <AvForm
              onValidSubmit={(e, v) => {
                v.declarations = [CLIENT_AGREEMENT, COUNTRY_REGULATIONS, E_SIGNATURE];
                delete v.agreement;
                delete v.regulations;
                delete v.signature;
                dispatch(submitIndProfile(v));
                props.toggle();
              }}
            >
              <div className="d-flex flex-column gap-4">
                {/* first row */}
                <Row>
                  <Col md="3">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="title"
                        type="text"
                        placeholder={props.t("Select Your Title")}
                        errorMessage={props.t("Title is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.title || ""}
                        label={props.t("Title")}
                        options={TITLES.map((obj) => {
                          return ({
                            label: obj.name,
                            value: obj.value
                          });
                        })}
                      />
                    </div>
                  </Col>
                  <Col md="4">
                    <div className="mt-2">
                      <AvField
                        name="dob"
                        label={props.t("Date of birth")}
                        placeholder={props.t("Enter Date of birth")}
                        type="date"
                        min={moment().subtract("110", "years").format("YYYY-MM-DD")}
                        max={moment().subtract("18", "years").format("YYYY-MM-DD")}
                        errorMessage={props.t("DOB is required")}
                        validate={{
                          required: { value: true },
                          dateRange: {
                            format: "YYYY-MM-DD",
                            start: { value: moment().subtract("110", "years").format("YYYY-MM-DD") },
                            end: { value: moment().subtract("18", "years").format("YYYY-MM-DD") }
                          }
                        }}
                        value={props.profile.dob}
                      />
                    </div>
                  </Col>
                  <Col md="5">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="nationality"
                        label={props.t("Nationality")}
                        errorMessage={props.t("Nationality is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.nationality || ""}
                        placeholder={props.t("Select Your Nationality")}
                        options={props.countries.map((country) => {
                          return ({
                            label: `${country.en}`,
                            value: country.en
                          });
                        })}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="8">
                    <div className="mt-2">
                      <AvField
                        name="address"
                        label={props.t("Address")}
                        placeholder={props.t("Enter Your address")}
                        type="text"
                        errorMessage={props.t("Address is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.address}
                      />
                    </div>
                  </Col>
                  <Col md="4">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="gender"
                        label={props.t("Gender")}
                        placeholder={props.t("Select Gender")}
                        type="date"
                        errorMessage={props.t("Gender is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.gender || ""}
                        options={GENDER}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>

                  <Col md="6">
                    <div className="mt-2">
                      <AvField
                        name="address2"
                        label={props.t("Address Line 2")}
                        placeholder={props.t("Enter Address Line 2")}
                        type="text"
                        errorMessage={props.t("Address is required")}
                        // validate={{ required: { value: true } }}
                        value={props.profile.address2}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="language"
                        label={props.t("Language")}
                        placeholder={props.t("Select Your Language")}
                        type="text"
                        errorMessage={props.t("Language is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.language || ""}
                        options={LANGUAGES.map((item) => {
                          return ({
                            label: `${item.name}`,
                            value: item.value
                          });
                        })}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <div className="mt-2">
                      <AvField
                        name="city"
                        label={props.t("City")}
                        placeholder={props.t("Enter Your City")}
                        type="text"
                        errorMessage={props.t("City is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.city}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mt-2">
                      <AvField
                        name="zipCode"
                        label={props.t("Postal Code")}
                        placeholder={props.t("Enter Postal Code")}
                        type="text"
                        value={props.profile.zipCode}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="experience.profession"
                        label={props.t("Profession")}
                        placeholder={props.t("Select Your Profession")}
                        type="text"
                        errorMessage={props.t("Profession is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.experience && props.profile.experience.profession || ""}
                        options={INDUSTRIES.map((item) => {
                          return ({
                            label: `${item.name}`,
                            value: item.value
                          });
                        })}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        errorMessage={props.t("Employment Status is required")}
                        placeholder={props.t("Select Employment Status")}
                        validate={{ required: { value: true } }}
                        name="experience.employmentStatus"
                        label={props.t("Employment Status")}
                        type="text"
                        value={props.profile.experience && props.profile.experience.employmentStatus || ""}
                        onChange={setEmpStatus}
                        options={EMPLOYMENT_STATUS.map((item) => {
                          return ({
                            label: `${item.name}`,
                            value: item.value
                          });
                        })}
                      />
                    </div>
                  </Col>
                </Row>
                {empStatus === "Employed (full time)" &&
                  <Row>
                    <Col md="6">
                      <div className="mt-2">
                        <AvField
                          name="experience.jobTitle"
                          label={props.t("Profession")}
                          placeholder={props.t("Enter Job Title")}
                          type="text"
                          errorMessage={props.t("Job Title is required")}
                          validate={{ required: { value: true } }}
                          value={props.profile.experience && props.profile.experience.jobTitle}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mt-2">
                        <AvField
                          name="experience.employer"
                          label={props.t("Employer")}
                          placeholder={props.t("Enter Employer Name")}
                          type="text"
                          value={props.profile.experience && props.profile.experience.employer}
                        />
                      </div>
                    </Col>
                  </Row>
                }
                <Row>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        placeholder={props.t("Select Annual Income")}
                        name="financialInfo.annualIncome"
                        label={props.t("Annual Income")}
                        type="text"
                        errorMessage={props.t("Annual Income is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.financialInfo && props.profile.financialInfo.annualIncome || ""}

                        options={ANNUAL_INCOME.map((item) => {
                          return ({
                            label: `${item.name}`,
                            value: item.value
                          });
                        })}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        placeholder={props.t("Select Source Of Funds")}
                        name="financialInfo.sourceOfFunds"
                        label={props.t("Source of Funds")}
                        type="text"
                        errorMessage={props.t("Source Of Funds is required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.financialInfo && props.profile.financialInfo.sourceOfFunds || ""}
                        options={SOURCE_OF_FUNDS.map((item) => {
                          return ({
                            label: `${item.name}`,
                            value: item.value
                          });
                        })}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="politicallyExposed"
                        placeholder={props.t("Select are you Politically Exposed")}
                        label={props.t("Politically Exposed ?")}
                        type="text"
                        errorMessage={props.t("Required")}
                        validate={{ required: true }}
                        value={props.profile.politicallyExposed || ""}

                        options={YESNO}
                      />
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="usCitizen"
                        label={props.t("Are you a citizen of the United States of America ?")}
                        placeholder={props.t("Select are you US Citizen")}
                        type="text"
                        errorMessage={props.t("Required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.usCitizen}

                        options={YESNO}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md="12">
                    <div className="mt-2">
                      <AvFieldSelect
                        name="financialInfo.workedInFinancial"
                        label={props.t("I have worked for at least 2 years in a directly relevant role within the financial services industry ?")}
                        placeholder={props.t("Select have you worked in finance")}
                        type="text"
                        errorMessage={props.t("Required")}
                        validate={{ required: { value: true } }}
                        value={props.profile.financialInfo && props.profile.financialInfo.workedInFinancial || ""}

                        options={YESNO}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <h6 className="mb-2">
                    {props.t("By Clicking Submit, you hereby confirm and agree to the following:")}
                  </h6>
                  <Col md={12}>
                    <AvField
                      name="agreement"
                      label={props.isClient ? parse(CLIENT_AGREEMENT) : parse(IB_AGREEMENT)}
                      type="checkbox"
                      errorMessage={props.t("Please check the agreement")}
                      validate={{ required: { value: true } }}
                    />
                    <AvField
                      name="regulations"
                      label={props.t(COUNTRY_REGULATIONS)}
                      type="checkbox"
                      errorMessage={props.t("Please check the agreement")}
                      validate={{ required: { value: true } }}
                    />
                    <AvField
                      name="signature"
                      label={props.t(E_SIGNATURE)}
                      type="checkbox"
                      errorMessage={props.t("Please check the agreement")}
                      validate={{ required: { value: true } }}
                    />

                  </Col>
                </Row>


              </div>

              <div className="d-flex justify-content-end">
                <div className="p-4">
                  <Button
                    disabled={props.submittingProfile}
                    type="submit"
                    color="primary"
                  >
                    {props.t("Submit")}
                  </Button>
                </div>
              </div>
            </AvForm>
        }
      </CardBody>
    </Modal>
  </React.Fragment>);
};

const mapStateToProps = (state) => ({
  profile: state.Profile && state.Profile.clientData || {},
  submittingProfile: state.Profile.submittingProfile,
  countries: state.dictionary.countries || [],
  isClient: state.Layout.subPortal === CUSTOMER_SUB_PORTALS.LIVE
});
export default connect(mapStateToProps, null)(withTranslation()(SubmitProfile)); 