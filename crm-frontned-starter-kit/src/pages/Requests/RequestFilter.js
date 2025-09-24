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
import { Link, useLocation } from "react-router-dom";
import React, {
  useState,
  useEffect,
} from "react";
import { AvForm, AvField } from "availity-reactstrap-validation";
import ClientDropDown from "../../components/Common/Filters/ClientDropDown";
import FromToDate from "../../components/Common/Filters/FromToDate";
import SearchableAgentDropdown from "components/Common/SearchableAgentDropdown";

function Filter(props) {

  // get query parametrs from url
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const [openCanvas, setOpenCanvas] = useState(false);

  const initValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: ""
    },
    status: query.get("status") || "",
    kyc: "",
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
  const kycOptions = [
    {
      lable: "Yet to upload",
      value: "kycNotUpload"
    },
    {
      lable: "Kyc Rejected",
      value: "kycRejected"
    },
    {
      lable: "Kyc Approved",
      value: "kycApproved"
    },

    {
      lable: "Kyc Not Approved",
      value: "kycNotApproved"
    }
  ];
  

  const clientChangeHandler = (obj) => {
    setValues({
      ...values,
      customerId: obj.value
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
              <Col md="6">
                <div className="mb-3">
                  <AvField type="select" name="kyc" label={props.t("KYC Status")} value={props.filteredValues?.kyc || values.kyc}
                    onChange={(e) => {
                      setValues({
                        ...values,
                        kyc: e.target["value"]
                      });
                    }}
                  >
                    <option key={""} value={""}>
                      {props.t("All")}
                    </option>
                    {kycOptions.map((item) => {
                      return (
                        <option key={item.value} value={item.value}>
                          {props.t(item.lable)}
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

            <div className="mb-3">
              <FromToDate
                filterDate={values.filterDate}
                dateChangeHandler={dateChangeHandler}
              />
            </div>
            <div className="mb-3">
              <ClientDropDown
                defaultValue={props.filteredValues?.customerId || values.selectCountry}
                clientChangeHandler={clientChangeHandler}
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