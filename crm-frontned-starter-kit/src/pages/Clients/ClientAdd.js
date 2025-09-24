import { useDispatch, connect } from "react-redux";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledAlert,
  Col,
  Row,
} from "reactstrap";
import { Accordion } from "react-bootstrap";
import { debounce } from "lodash";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Loader from "components/Common/Loader";
import React, {
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  AvForm,
  AvField,
  AvInput
} from "availity-reactstrap-validation";

import { addNewClient } from "../../store/client/actions";
import { fetchLeadsStart } from "../../store/leads/actions";
import CountryDropDown from "../../components/Common/CountryDropDown";
import { fetchUsers } from "store/users/actions";
import { checkClientEmailApi } from "apis/client";
import { emailCheck } from "common/utils/emailCheck";
import AccountTypeDropDown from "./AccountTypeDropDown";
import SourceDropDown from "../../components/Common/SourceDropDown";
import AvFieldSelect from "components/Common/AvFieldSelect";
import GeneralInfo from "./Corporate/GeneralInfo";
import Personnels from "./Corporate/Personnels";
import AuthorizedPerson from "./Corporate/AuthorizedPerson";

function ClientForm(props) {
  const dispatch = useDispatch();
  const [addModal, setAddUserModal] = useState(false);
  const [selectedCountry, setCountry] = useState("");
  const [selectedAccountType, setAccountType] = useState("");
  const [isCorporate, setIsCorporate] = useState(false);
  const [sameAddress, setSameAddress] = useState(false);
  const [source, setSource] = useState("");
  const { create } = props.clientPermissions;
  const handleAddClient = (event, values) => {
    event.preventDefault();
    dispatch(addNewClient({
      ...values,
      source,
      isCorporate,
      country: values.country ?? selectedCountry.value,
      category: selectedAccountType.toUpperCase(),
    }));
  };

  const countryChangeHandler = (selectedCountryVar) => {
    setCountry(selectedCountryVar);
  };

  const toggleAddModal = () => {
    setAddUserModal(!addModal);
  };

  useEffect(() => {
    loadLeads();
    loadUsers();
  }, []);

  const loadLeads = (page, limit) => {
    dispatch(fetchLeadsStart({
      limit,
      page
    }));
  };

  const loadUsers = (page, limit) => {
    dispatch(fetchUsers({
      limit,
      page
    }));
  };

  useEffect(() => {
    if (addModal) {
      setAddUserModal(false);
    }
  }, [props.totalClients]);

  const debouncedChangeHandler = useCallback(
    debounce((value, ctx, input, cb) =>
      emailCheck(value, ctx, input, cb, checkClientEmailApi), 1000
    ), []
  );

  const clientType = [
    {
      value: "INDIVIDUAL",
      label: "Individual"
    },
    {
      value: "CORPORATE",
      label: "Corporate"
    }
  ];

  return (
    <React.Fragment >
      <Link to="#" className={`btn btn-primary ${!create ? "d-none" : ""}`} onClick={toggleAddModal}>
        <i className="bx bx-plus me-1" />
        {props.t("Add New Client")}
      </Link>
      <Modal size={isCorporate ? "lg" : "md"} isOpen={addModal} toggle={toggleAddModal} centered={true}>
        <ModalHeader toggle={toggleAddModal} tag="h4">
          {props.t("Add New Client")}
        </ModalHeader>
        <ModalBody >
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              handleAddClient(e, v);
            }}
          >
            <Row>
              <Col>
                <AvFieldSelect
                  name="customerType"
                  label={props.t("Type")}
                  errorMessage={props.t("Enter Type")}
                  validate={{ required: { value: true } }}
                  options={clientType}
                  onChange={(e) =>
                    e === "CORPORATE"
                      ? setIsCorporate(true)
                      : setIsCorporate(false)
                  }
                />
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="firstName"
                    label={props.t(`${isCorporate ? "Company" : "First"} Name`)}
                    placeholder={props.t("Enter First Name")}
                    type="text"
                    errorMessage={props.t("Enter First Name")}
                    validate={{ required: { value: true } }}
                  />
                </div>
              </Col>
              {!isCorporate && <Col md="6">
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
              </Col>}
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
            {!isCorporate && <div className="mb-3">
              <CountryDropDown
                selectCountry={setCountry}
                countryChangeHandler={countryChangeHandler}
              />
            </div>}
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
            {isCorporate &&
              <Accordion className="mb-3">
                <GeneralInfo sameAddress={sameAddress} setSameAddress={setSameAddress} />
                <Personnels />
                <AuthorizedPerson />
              </Accordion>}

            <div className="mb-3">
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
                  <Button disabled={props.disableAddButton} type="submit" color="primary" className="">
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
  showAddSuccessMessage: state.clientReducer.showAddSuccessMessage,
  disableAddButton: state.clientReducer.disableAddButton,
  clients: state.clientReducer.clients,
  leads: state.leadReducer.leads,
  totalClients: state.clientReducer.totalDocs,
  users: state.usersReducer.docs || [],
  addClientLoading: state.clientReducer.addClientLoading
});
export default connect(mapStateToProps, null)(withTranslation()(ClientForm));