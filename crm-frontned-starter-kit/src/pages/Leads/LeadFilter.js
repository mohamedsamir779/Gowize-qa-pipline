import { connect, useSelector } from "react-redux";
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

function Filter(props) {
  const [openCanvas, setOpenCanvas] = useState(false);

  const initValues = {
    agent: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    country: "",
    filterDate: {
      fromDate: "",
      toDate: ""
    },
    type: "",
    source: "",
    assigne: "",
    callStatus: "",
  };

  const { filteredValues = initValues } = props;
  const [values, setValues] = useState(filteredValues);

  const [filtered, setFilter] = useState(false);
  useEffect(() => {
    let f = JSON.stringify(initValues) === JSON.stringify(values);
    setFilter(!f);
  }, [values]);

  const typesOptions = ["LIVE", "DEMO", "CRYPTO", "LIVE_INDIVIDUAL", "FOREX"];
  const sourceOptions = ["CRM", "Facebook", "Instagram", "Google", "Website", "Other"];
  const genders = ["Male", "Female"];
  const assigne = ["All", "Assigned", "Unassigned"];

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

  const assigneChangeHandler = (e) =>
    setValues({
      ...values,
      assigne: e.target.value
    });

  const toggleCanvas = () => {
    setOpenCanvas(!openCanvas);
  };

  useEffect(() => {
    if (!props.showAddSuccessMessage && openCanvas) {
      setOpenCanvas(false);
    }
  }, [props.showAddSuccessMessage]);

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
    <React.Fragment >
      <Button
        color="primary"
        className={"btn btn-primary"}
        onClick={toggleCanvas}>
        <i className="bx bx-filter me-1" />
        {filtered ? props.t("Update Filter") : props.t("Advance Filter")}
      </Button>
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
              <Col md="6">
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
                  <AvField type="select" name="type" label={props.t("types")} value={props.filteredValues?.type || values.type}
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
                        source: e.target["value"]?.toUpperCase()
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
                    style={customStyles}
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
                            ?  "#fff"
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
                    value={props.filteredValues?.type || values.agent}
                    isMulti={true}
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