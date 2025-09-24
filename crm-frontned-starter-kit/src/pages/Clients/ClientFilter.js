import { connect } from "react-redux";
import {
  Button,
  UncontrolledAlert,
  Col,
  Row,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody
} from "reactstrap";
import { withTranslation } from "react-i18next";
import React, {
  useState,
  useEffect,
} from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import CountryDropDown from "../../components/Common/CountryDropDown";
import FromToDate from "../../components/Common/Filters/FromToDate";
import SearchableAgentDropdown from "components/Common/SearchableAgentDropdown";
import Select from "react-select";
import { startCase } from "lodash";
import SearchableComponent from "pages/Transactions/Forex/internalTransfer/SearchableComponents";
import { getClients } from "apis/client";
import { Link, useLocation } from "react-router-dom";

function Filter(props) {
  const [openCanvas, setOpenCanvas] = useState(false);
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const initValues = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    country: "",
    filterDate: {
      fromDate: query.get("fromDate") || "",
      toDate: ""
    },
    type: "",
    source: "",
    agent: "",
    kyc: query.get("kyc") || "",
    assigne: query.get("assigne") || "",
    callStatus: query.get("callStatus") || "",
    login: "",
    categories: "",
    parentId: "",
  };
  const { filteredValues = initValues } = props;
  const [values, setValues] = useState(filteredValues);

  const [filtered, setFilter] = useState(false);

  useEffect(() => {
    let isFiltered = JSON.stringify(values).split("").length !== JSON.stringify(initValues).split("").length;
    setFilter(isFiltered);
  }, [values]);

  const typesOptions = ["LIVE", "DEMO", "CRYPTO", "LIVE_INDIVIDUAL", "FOREX"];
  const sourceOptions = ["FOREX_LIVE", "CRM", "FOREX_IB", "DEMO", "CRYPTO_LIVE", "REGISTER_DEMO"];
  const genders = ["Male", "Female"];
  const kycOptions = [{
    label: "Pending Upload",
    value: "KYC_PENDING",
  }, {
    label: "Pending Approval",
    value: "KYC_UPLOADED",
  }, {
    label: "Approved",
    value: "KYC_APPROVED",
  }, {
    label: "Rejected",
    value: "KYC_REJECTED",
  }];
  const assigne = ["All", "Assigned", "Unassigned"];
  const categories = ["Individual", "IB", "Corporate", "Corporate IB"];

  const countryChangeHandler = (selectedCountryVar) => {
    setValues({
      ...values,
      country: selectedCountryVar.value
    });
  };

  const resetFilter = () => {
    setValues(initValues);
    props.filterChangeHandler(initValues);
    // setOpenCanvas(false);
  };

  const dateChangeHandler = (filterDate) => {
    setValues({
      ...values,
      filterDate: filterDate
    });
  };

  const kycChangeHandler = (e) =>
    setValues({
      ...values,
      kyc: e.target.value
    });

  const assigneChangeHandler = (e) =>
    setValues({
      ...values,
      assigne: e.target.value
    });

  const toggleCanvas = () => {
    setOpenCanvas(!openCanvas);
  };
  
  const categoriesChangeHandler = (e) => {
    setValues({
      ...values,
      categories: e.target.value
    });
  };
  
  useEffect(() => {
    if (!props.showAddSuccessMessage && openCanvas) {
      setOpenCanvas(false);
    }
  }, [props.showAddSuccessMessage]);

  return (
    <React.Fragment >
      <Button color="primary" onClick={toggleCanvas}>
        <i className="bx bx-filter me-1" />
        {filtered ? props.t("Update Filter") : props.t("Advance Filter")}
      </Button>
      {filtered &&
        <Button color="primary" className="ms-1" onClick={resetFilter}>
          {props.t("Clear Filter")}
        </Button>
      }
      <Offcanvas
        isOpen={openCanvas}
        direction="end"
        scrollable
        toggle={toggleCanvas}
      >
        <OffcanvasHeader toggle={toggleCanvas}
          tag="h4">
          {props.t("Advance Filter")}
        </OffcanvasHeader>
        <OffcanvasBody>
          <AvForm
            className='p-4'
            onValidSubmit={(e, v) => {
              props.filterChangeHandler(values);
              setOpenCanvas(false);
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
                    value={props.filteredValues?.firstName || values.firstName}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        firstName: e.target["value"]
                      });
                    }}

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
                    value={props.filteredValues?.lastName || values.lastName}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        lastName: e.target["value"]
                      });
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <AvField
                    name="email"
                    label={props.t("Email")}
                    placeholder={props.t("Enter Email")}
                    type="text"
                    errorMessage={props.t("Enter Email")}
                    value={props.filteredValues?.email || values.email}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        email: e.target["value"]
                      });
                    }}

                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField
                    name="login"
                    label={props.t("Account No.")}
                    placeholder={props.t("Enter Account number")}
                    type="text"
                    errorMessage={props.t("Enter Account number")}
                    value={props.filteredValues?.login || values.login}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        login: e.target["value"]
                      });
                    }}

                  />
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="gender" label={props.t("Gender")} value={props.filteredValues?.gender || values.gender}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        gender: e.target["value"]
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {genders.map((item) => {
                      return (
                        <option key={item} value={item}>
                          {props.t(item)}
                        </option>
                      );
                    })}
                  </AvField>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="type" label={props.t("Client Type")} value={props.filteredValues?.type || values.type}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        type: e.target["value"]
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {typesOptions.map((item) => {
                      return (
                        <option key={item} value={item}>
                          {props.t(item)}
                        </option>
                      );
                    })}
                  </AvField>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="source" label={props.t("Source")} value={props.filteredValues?.source || values.source}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        source: e.target["value"]
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {sourceOptions.map((item) => {
                      return (
                        <option key={item} value={item}>
                          {props.t(item)}
                        </option>
                      );
                    })}
                  </AvField>
                </div>
              </Col>
            </Row>
            
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <SearchableComponent
                    isRequired
                    name="parentId"
                    label={props.t("Parent")}
                    onChange={(e) => setValues({
                      ...values,
                      parentId: e.value
                    })}
                    getData={async (payload) => getClients({
                      payload: {
                        fxType: "IB",
                        ...payload
                      }
                    })?.then((res) => (res?.result?.docs || []))}
                    mapper={(doc)=> (
                      {
                        label: `${doc.firstName} ${doc.lastName}`,
                        value: `${doc._id}`
                      }
                    ) || []}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="KYC" label={props.t("KYC Status")} value={values.kyc || props.filteredValues?.kyc}
                    onChange={kycChangeHandler}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {kycOptions.map((item) => {
                      return (
                        <option key={item.label} value={item.value}>
                          {props.t(item.label)}
                        </option>
                      );
                    })}
                  </AvField>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="categories" label={props.t("Categories")} value={values.categories || props.filteredValues?.categories}
                    onChange={categoriesChangeHandler}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {categories.map((item) => {
                      return (
                        <option key={item} value={item}>
                          {props.t(item)}
                        </option>
                      );
                    })}
                  </AvField>
                </div>
              </Col>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="assigne" label={props.t("Assigne")} value={values.assigne || props.filteredValues?.assigne}
                    onChange={assigneChangeHandler}
                  >
                    {assigne.map((item) => {
                      return (
                        <option key={item} value={item}>
                          {props.t(item)}
                        </option>
                      );
                    })}
                  </AvField>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <label>{props.t("Call Status")}</label>
                  <Select
                    name="callStatus"
                    isMulti
                    value={values?.callStatus ? values?.callStatus?.map((item) => {
                      return {
                        value: item,
                        label: startCase(item),
                      };
                    }) : []}
                    options={Object.keys(props.callStatus)?.map((item) => {
                      return {
                        value: item,
                        label: startCase(item),
                      };
                    })}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        callStatus: e.map(obj => obj.value),
                      });
                    }}
                    styles={props.enableCallStatusColors && {
                      option: (styles, { data, isSelected, isDisabled }) => ({
                        ...styles,
                        color: isDisabled
                          ? "#ccc"
                          : isSelected
                            ? "#fff"
                            : props.callStatusColors[data.value],
                      }),
                    }}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <div className="mb-3">
                  <SearchableAgentDropdown
                    isRequired={false}
                    clientData={props?.clientDetails || null}
                    isMulti={true}
                    value={[]}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        agent: e.map((item) => item.value).join(","),
                      });
                    }}
                  />
                  {/* <AvField type="select" name="agent" label={props.t("Sales agent")} value={props.filteredValues?.type || values.agent}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        agent: e.target.value
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {salesAgentOptions.map((agent) => {
                      return (
                        <option key={agent.value} value={agent.value}>
                          {agent.label}
                        </option>
                      );
                    })}
                  </AvField> */}
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <FromToDate
                filterDate={values.filterDate}
                dateChangeHandler={dateChangeHandler}
              />
            </div>
            <div className="mb-3">
              <CountryDropDown
                defaultValue={props.filteredValues?.country || values.selectCountry}
                countryChangeHandler={countryChangeHandler}
              />
            </div>

            <div className="row">
              <div className="col-sm-12 text-center">
                <Button disabled={!filtered} type="submit" color="primary" className="btn btn-primary btn-md center-block">
                  {props.t("Filter")}
                </Button>
                {" "}
                {" "}
                <Button disabled={!filtered} onClick={resetFilter} color="primary" type="reset" className="btn btn-danger btn-md center-block">
                  {props.t("Reset")}
                </Button>
              </div>
            </div>

          </AvForm>
          {props.error && <UncontrolledAlert color="danger">
            <i className="mdi mdi-block-helper me-2"></i>
            {props.t(props.error)}
          </UncontrolledAlert>}
        </OffcanvasBody>
      </Offcanvas>
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
  callStatus: state.dictionaryReducer.callStatus,
  enableCallStatusColors: state.Profile.settings.enableCallStatusColors,
  callStatusColors: state.Profile.settings.callStatusColors,
});
export default connect(mapStateToProps, null)(withTranslation()(Filter));