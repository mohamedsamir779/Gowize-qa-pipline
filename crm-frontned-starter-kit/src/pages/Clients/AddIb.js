import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDispatch, connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row
} from "reactstrap";
import { debounce, startCase } from "lodash";
import Loader from "components/Common/Loader";
import {
  AvForm,
  AvField,
  AvInput
} from "availity-reactstrap-validation";

import { addNewIb } from "../../store/client/actions";
import CountryDropDown from "../../components/Common/CountryDropDown";
import { checkClientEmailApi } from "apis/client";
import { emailCheck } from "common/utils/emailCheck";
import AccountTypeDropDown from "./AccountTypeDropDown";
import SourceDropDown from "../../components/Common/SourceDropDown";
import { Accordion } from "react-bootstrap";
import AvFieldSelect from "components/Common/AvFieldSelect";
import { TITLES, YESNO } from "common/data/dropdowns";
import { LANGUAGES } from "common/languages";
import sourceOfFunds from "common/souceOfFunds";
import annualIncome from "common/annualIncome";
import validatePositiveInputs from "helpers/validatePositiveInputs";
import { fetchAccountTypes, fetchProducts } from "store/actions";
import useModal from "hooks/useModal";

function ClientForm(props) {
  const dispatch = useDispatch();
  const [show, toggle] = useModal();

  const [selectedCountry, setCountry] = useState("");
  const [selectedNationality, setNationality] = useState("");
  const [selectedAccountType, setAccountType] = useState("");
  const [source, setSource] = useState("");

  const { create } = props.clientPermissions;

  const countryChangeHandler = (selectedCountryVar) => {
    setCountry(selectedCountryVar.value);
  };

  const nationalityChangeHandler = (selectedNationalityVar) => {
    setNationality(selectedNationalityVar.value);
  };

  useEffect(() => {
    show && toggle();
  }, [props.totalClients]);

  useEffect(() => {
    dispatch(fetchAccountTypes({
      type: "LIVE",
    }));
    dispatch(fetchProducts());
  }, []);

  const debouncedChangeHandler = useCallback(
    debounce((value, ctx, input, cb) =>
      emailCheck(value, ctx, input, cb, checkClientEmailApi), 1000
    ), []
  );

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggle}>
        <i className="bx bx-plus me-1" />
        {props.t("Add IB")}
      </Link>
      <Modal isOpen={show} toggle={toggle} centered={true}>
        <ModalHeader toggle={toggle} tag="h4">
          {props.t("Add New IB")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='px-3'
            onValidSubmit={(e, v) => {
              e.preventDefault();
              dispatch(addNewIb({
                ...v,
                source,
                country: selectedCountry,
                nationality: selectedNationality,
                category: selectedAccountType.toUpperCase(),
                customerType: "INDIVIDUAL",
              }));
            }}
          >
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="firstName"
                    label={props.t("First Name")}
                    placeholder={props.t("Enter First Name")}
                    type="text"
                    errorMessage={props.t("Enter First Name")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="lastName"
                    label={props.t("Last Name")}
                    placeholder={props.t("Enter Last Name")}
                    type="text"
                    errorMessage={props.t("Enter Last Name")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="email"
                    label={props.t("Email")}
                    placeholder={props.t("Enter Email")}
                    type="text"
                    errorMessage={props.t("Enter Valid Email")}
                    validate={{
                      required: true,
                      email: true,
                      async: debouncedChangeHandler
                    }}
                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="phone"
                    label={props.t("Phone")}
                    placeholder={props.t("Enter valid Phone")}
                    type="text"
                    onKeyPress={(e) => {
                      if (/^[+]?\d+$/.test(e.key) || e.key === "+") {
                        return true;
                      } else {
                        e.preventDefault();
                      }
                    }}
                    validate={
                      {
                        required: { value: true },
                        pattern: {
                          // eslint-disable-next-line no-useless-escape
                          value: "/^[\+][(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im",
                          errorMessage: "Phone number must be digits only with country key"
                        }
                      }
                    }
                  />
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <CountryDropDown
                selectCountry={setCountry}
                countryChangeHandler={countryChangeHandler}
              />
            </div>
            <div className="mb-3">
              <AccountTypeDropDown
                setAccountType={setAccountType}
              />
            </div>
            <div className="mb-3">
              <SourceDropDown
                setSource={setSource}
              />
            </div>
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>{props.t("Client Details (Optional)")}</Accordion.Header>
                <Accordion.Body>
                  <Row>
                    <Col md="6">
                      <div>
                        <AvFieldSelect
                          name="title"
                          type="text"
                          label={props.t("Title")}
                          options={TITLES.map((obj) => {
                            return ({
                              label: obj,
                              value: obj
                            });
                          })}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div>
                        <AvFieldSelect
                          name="language"
                          label={props.t("Language")}
                          placeholder={props.t("Language")}
                          type="text"
                          options={LANGUAGES}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div>
                        <AvField
                          name="dob"
                          label={props.t("Date of birth")}
                          placeholder={props.t("Enter Date of birth")}
                          type="date"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div>
                        <CountryDropDown
                          label="Nationality"
                          selectCountry={setNationality}
                          countryChangeHandler={nationalityChangeHandler}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div>
                        <AvField
                          name="city"
                          label={props.t("City")}
                          placeholder={props.t("Enter City")}
                          type="text"
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div>
                        <AvField
                          name="address"
                          label={props.t("Address")}
                          placeholder={props.t("Address")}
                          type="text"
                        />
                      </div>
                    </Col>
                    <Col mf="6">
                      <AvFieldSelect
                        name="annualIncome"
                        type="text"
                        label={props.t("Annual Income")}
                        options={annualIncome.map((obj) => {
                          return ({
                            label: obj,
                            value: obj
                          });
                        })}
                      />
                    </Col>
                    <Col md="6">
                      <AvFieldSelect
                        name="sourceOfFunds"
                        label={props.t("Soucre of Funds")}
                        placeholder={props.t("Industry is required")}
                        type="text"
                        options={sourceOfFunds.map((obj) => {
                          return ({
                            label: obj,
                            value: obj
                          });
                        })}
                      />
                    </Col>
                    <Col md="6">
                      <div>
                        <AvFieldSelect
                          name="usCitizen"
                          type="text"
                          label={props.t("US Citizen")}
                          options={YESNO}
                        />
                      </div>
                    </Col>
                    <Col md="6">
                      <div>
                        <AvFieldSelect
                          name="politicallyExposed"
                          label={props.t("Politically exposed?")}
                          placeholder={props.t("Politically exposed?")}
                          type="text"
                          options={YESNO}
                        />
                      </div>
                    </Col>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>{props.t("IB Agreement")}</Accordion.Header>
                <Accordion.Body>
                  <Row className="justify-content-center">
                    <Col md="10">
                      <AvField
                        name="ibTitle"
                        label={props.t("Agreement name")}
                        type="text"
                        errorMessage={props.t("Required!")}
                        validate={{ required: { value: true } }}
                      />
                    </Col>
                  </Row>
                  {props.accountTypes?.map((acc, accIdx) =>
                    <>
                      <Row key={accIdx}>
                        <Row className="justify-content-center mb-3 fw-bold">
                          <Col md="4" className="text-center">{acc?.title}</Col>
                          <Col md="3" className="text-center">{props.t("Rebate")}</Col>
                          <Col md="3" className="text-center">{props.t("Commission")}</Col>
                        </Row>
                        {props?.products?.map((prod, prodIdx) =>
                          <Row key={prodIdx} className="justify-content-center align-items-center">
                            <Col md="4" className="text-center">
                              {startCase(prod)}
                              <AvField
                                name={`values[${accIdx}].accountTypeId`}
                                value={acc._id}
                                type="hidden"
                              />
                            </Col>
                            <Col md="3">
                              <AvField
                                name={`values[${accIdx}].products.${prod}.rebate`}
                                type="string"
                                className="text-center"
                                errorMessage={props.t("Invalid value!")}
                                validate={{
                                  required: { value: true },
                                  min: { value: 0 }
                                }}
                                onKeyPress={(e) => validatePositiveInputs(e)}
                              />
                            </Col>
                            <Col md="3">
                              <AvField
                                name={`values[${accIdx}].products.${prod}.commission`}
                                type="string"
                                className="text-center"
                                errorMessage={props.t("Invalid value!")}
                                validate={{
                                  required: { value: true },
                                  min: { value: 0 }
                                }}
                                onKeyPress={(e) => validatePositiveInputs(e)}
                              />
                            </Col>
                          </Row>
                        )}
                        <Row key={accIdx} className="align-items-center justify-content-center">
                          <Col md="4" className="text-center mb-3">
                            {props.t("Markup")}
                          </Col>
                          <Col md="6">
                            <AvFieldSelect
                              name={`values[${accIdx}].markup`}
                              options={(props.markups || []).map((obj) => {
                                return ({
                                  label: `${obj}`,
                                  value: obj
                                });
                              })}
                            />
                          </Col>
                        </Row>
                        {accIdx !== props.accountTypes.length - 1 && <hr className="mt-2 mb-3" />}
                      </Row>
                    </>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
            <div className="mt-3">
              <AvInput
                type="checkbox"
                name="sendWelcomeEmail"
                defaultChecked={true}
              /> {props.t("Send welcome email")}
            </div>
            <div className='text-center pt-3 p-2'>
              {
                props.addClientLoading
                  ?
                  <Loader />
                  :
                  <Button disabled={props.disableAddButton} type="submit" color="primary">
                    {props.t("Add")}
                  </Button>
              }
            </div>
          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  error: state.clientReducer.error,
  clientPermissions: state.Profile.clientPermissions,
  disableAddButton: state.clientReducer.disableAddButton,
  clients: state.clientReducer.clients,
  totalClients: state.clientReducer.totalDocs,
  addClientLoading: state.clientReducer.addClientLoading,
  accountTypes: state.tradingAccountReducer.accountTypes,
  markups: state.dictionaryReducer.markups,
  products: state.ibAgreements.products,
});
export default connect(mapStateToProps, null)(withTranslation()(ClientForm));