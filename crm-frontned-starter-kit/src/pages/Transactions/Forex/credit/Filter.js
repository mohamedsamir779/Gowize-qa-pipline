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
import { Link } from "react-router-dom";
import React, {
  useState,
  useEffect,
} from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import ClientDropDown from "../../../../components/Common/Filters/ClientDropDown";
import FromToDate from "../../../../components/Common/Filters/FromToDate";
import SearchableAgentDropdown from "components/Common/SearchableAgentDropdown";

function Filter(props) {
  const [openCanvas, setOpenCanvas] = useState(false);

  const initValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: ""
    },
    status: "",
    currency: "",
    creditType: "",
    amount: "",
    agent: ""
  };

  const { filteredValues = initValues } = props;
  const [values, setValues] = useState(filteredValues);

  const [filtered, setFilter] = useState(false);
  useEffect(() => {
    let f = JSON.stringify(initValues) === JSON.stringify(values);
    setFilter(!f);
  }, [values]);

  const statusOptions = ["APPROVED", "PENDING", "REJECTED"];
  const creditTypeOptions = ["CreditIn", "CreditOut"];

  const clientChangeHandler = (obj) => {
    setValues({
      ...values,
      customerId: obj.value
    });
  };

  const resetFilter = () => {
    setValues(initValues);
    // props.filteredValues = initValues;
    props.filterChangeHandler(initValues);
  };


  const dateChangeHandler = (filterDate) => {
    setValues({
      ...values,
      filterDate: filterDate
    });

  };

  const toggleCanvas = () => {
    setOpenCanvas(!openCanvas);
  };

  useEffect(() => {
    if (!props.showAddSuccessMessage && openCanvas) {
      setOpenCanvas(false);
    }
  }, [props.showAddSuccessMessage]);

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
              <Col md="12">
                <div className="mb-3">
                  <ClientDropDown
                    defaultValue={props.filteredValues?.customerId || values.customerId}
                    clientChangeHandler={clientChangeHandler}
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
                </div>
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="creditType" label={props.t("Credit Type")} value={props.filteredValues?.creditType || values.creditType}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        creditType: e.target["value"],
                        amount: e.target["value"] ? values.amount : "",
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {creditTypeOptions.map((item) => {
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
                  <AvField
                    disabled={(values.creditType == "")}
                    name="amount"
                    label={props.t("Amount")}
                    placeholder={props.t("Amount")}
                    type="text"
                    value={props.filteredValues["amount"] || values["amount"]}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        "amount": e.target["value"]
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
                    name="currency"
                    label={props.t("Currency")}
                    placeholder={props.t("Currency")}
                    type="text"
                    value={props.filteredValues["currency"] || values["currency"]}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        "currency": e.target["value"]
                      });
                    }}

                  />
                </div>
              </Col>

              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="status" label={props.t("Status")} value={props.filteredValues?.status || values.status}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        status: e.target["value"]
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {statusOptions.map((item) => {
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


            <div className="mb-3">
              <FromToDate
                filterDate={values.filterDate}
                dateChangeHandler={dateChangeHandler}
              />
            </div>

            <div className="row">
              <div className="col-sm-12 text-center">
                <Button disabled={!filtered} type="submit" color="primary" className="btn btn-primary btn-md center-block">
                  {props.t("Filter")}
                </Button>
                {" "}
                {" "}
                <Button onClick={resetFilter} color="primary" type="reset" className="btn btn-danger btn-md center-block">
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
});
export default connect(mapStateToProps, null)(withTranslation()(Filter));