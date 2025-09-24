import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useDispatch, connect } from "react-redux";
import moment from "moment";
// eslint-disable-next-line object-curly-newline
import { Button, Row, Col } from "reactstrap";
import { AvForm, AvField } from "availity-reactstrap-validation";
import { fetchReportStart } from "store/reports/actions";
import CustomPagination from "components/Common/CustomPagination";

import Loader from "components/Common/Loader";
import { downloadReport } from "apis/reports";
import SendReportEmail from "./SendReportEmail";
import AvFieldSelect from "components/Common/AvFieldSelect";

function UsersAddModal(props) {
  const dispatch = useDispatch();
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedValues, setSelectedValues] = useState({});
  const [reportType, setReportType] = useState("");

  const submitReportSearch = (e, values) => {
    props.setReportColumns(values.reportType);
    setSelectedValues(values);
    dispatch(fetchReportStart(values));
    props.setPayload({
      ...values,
      type: reportType,
    });
  };
  const paginationLoad = (page) => {
    dispatch(
      fetchReportStart({
        ...selectedValues,
        page,
        limit: sizePerPage,
      })
    );
  };
  useEffect(() => {
    if (selectedValues && selectedValues.reportType) {
      dispatch(
        fetchReportStart({
          ...selectedValues,
          page: 1,
          limit: sizePerPage,
        })
      );
    }
  }, [sizePerPage]);
  const defaultValues = {
    reportType: "deposits",
    dateFrom: moment().subtract(1, "months").format("YYYY-MM-DD"),
    dateTo: moment().add(1, "day").format("YYYY-MM-DD"),
  };

  return (
    <React.Fragment>
      <div className=" me-2 mb-2">
        <div className="position-relative">
          <AvForm
            className="p-1"
            onValidSubmit={(e, v) => {
              submitReportSearch(e, v);
            }}
            model={defaultValues}
          >
            <Row>
              <Col xs={12} md={4} lg={2}>
                <label>Select Report Type</label>
                <AvFieldSelect
                  type="select"
                  name="reportType"
                  required
                  onChange={(e) => {
                    setReportType(e);
                  }}
                  options={[
                    {
                      value: "deposits",
                      label: props.t("Deposits By Login"),
                    },
                    {
                      value: "client-deposits",
                      label: props.t("Deposits By Client"),
                    },
                    {
                      value: "withdrawals",
                      label: props.t("Withdrawals By Login"),
                    },
                    {
                      value: "client-withdrawals",
                      label: props.t("Withdrawals By Client"),
                    },
                    {
                      value: "commission",
                      label: props.t("Commission"),
                    },
                    {
                      value: "credit-in",
                      label: props.t("Credit In"),
                    },
                    {
                      value: "credit-out",
                      label: props.t("Credit Out"),
                    },
                    {
                      value: "unfunded-accounts",
                      label: props.t("Unfunded Accounts"),
                    },
                    {
                      value: "summary",
                      label: props.t("Summary"),
                    },
                    {
                      value: "lead-converted",
                      label: props.t("Lead Converted"),
                    },
                    {
                      value: "lead-call-status",
                      label: props.t("Lead Call Status"),
                    },
                    {
                      value: "last-login",
                      label: props.t("Last Login"),
                    },
                    {
                      value: "ib-summary",
                      label: props.t("IB wise Summary"),
                    },
                  ]}
                  errorMessage={props.t("please select report Type")}
                  validate={{ required: { value: true } }}
                >
                  {/* <option value="">{props.t("Select Report")}</option>
                  <option value="deposits">{props.t("Deposits By Login")}</option>
                  <option value="client-deposits">{props.t("Deposits By Client")}</option>
                  <option value="withdrawals">{props.t("Withdrawals By Login")}</option>
                  <option value="client-withdrawals">{props.t("Withdrawals By Client")}</option>
                  <option value="commission">{props.t("Commission")}</option>
                  <option value="credit-in">{props.t("Credit In")}</option>
                  <option value="credit-out">{props.t("Credit Out")}</option>
                  <option value="unfunded-accounts">{props.t("Unfunded Accounts")}</option>
                  <option value="summary">{props.t("Summary")}</option>
                  <option value="lead-converted">{props.t("Lead Converted")}</option>
                  <option value="lead-call-status">{props.t("Lead Call Status")}</option>
                  <option value="last-login">{props.t("Last Login")}</option> */}
                </AvFieldSelect>
              </Col>
              <Col xs={12} md={4} lg={2}>
                <AvField
                  name="dateFrom"
                  label={props.t("Date From")}
                  type="date"
                  errorMessage={props.t("Select date From")}
                  validate={{ required: { value: true } }}
                />
              </Col>
              <Col xs={12} md={4} lg={2}>
                <AvField
                  name="dateTo"
                  label={props.t("Date To")}
                  type="date"
                  errorMessage={props.t("Select date To")}
                  validate={{ required: { value: true } }}
                />
              </Col>
              <Col className="col-3">
                <AvFieldSelect
                  type="select"
                  name="agent"
                  label={props.t("Agent")}
                  options={[
                    {
                      label: props.t("All"),
                      value: "",
                    },
                    ...props?.salesAgent?.map((obj) => ({
                      label: `${obj.firstName} ${obj.lastName}`,
                      value: obj._id,
                    })),
                  ]}
                  errorMessage={props.t("Select Agent")}
                ></AvFieldSelect>
              </Col>
              <Col
                xs={12}
                md={4}
                lg={4}
                className="text-center d-flex justify-content-end align-items-center"
              >
                {props.addLoading ? (
                  <Loader />
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    className="w-100 py-2"
                    disabled={props.loading || !reportType}
                  >
                    {props.t("Search")}
                  </Button>
                )}
              </Col>
            </Row>
            <div className="d-flex justify-content-end gap-2">
              <Button
                color="primary"
                size="sm"
                disabled={!selectedValues.reportType}
                onClick={() => {
                  downloadReport(selectedValues).then((blob) => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute(
                      "download",
                      `${selectedValues.reportType}.xlsx`
                    );
                    document.body.appendChild(link);
                    link.click();
                  });
                }}
              >
                {props.t("Download Report")}
              </Button>
              <SendReportEmail reportValues={selectedValues} />
            </div>
          </AvForm>
        </div>
      </div>
      <div className="table-rep-plugin">
        <div className="table-responsive mb-0" data-pattern="priority-columns">
          {props.children}
          <CustomPagination
            {...props.reportsReducer}
            setSizePerPage={setSizePerPage}
            sizePerPage={sizePerPage}
            onChange={paginationLoad}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.reportsReducer.loading || false,
  salesAgent: state.usersReducer.salesAgent || [],
  reportsReducer: state.reportsReducer || {},
});
export default connect(mapStateToProps, null)(withTranslation()(UsersAddModal));
