import React, { useEffect, useState } from "react";
import { 
  useSelector, 
  useDispatch, 
  connect,
} from "react-redux";
import { withTranslation } from "react-i18next";
import { Card } from "react-bootstrap";
import moment from "moment";
import { AvField, AvForm } from "availity-reactstrap-validation";
import CustomPagination from "components/Common/CustomPagination";
import AvFieldSelect from "components/Common/AvFieldSelect";
import Loader from "components/Common/Loader";
import TableLoader from "components/Common/TableLoader";
import {
  Table, Thead, Tbody, Tr, Th, Td,
} from "react-super-responsive-table";
import { 
  Button, Col, Row
} from "reactstrap";

import { fetchStatement } from "store/client/actions";
import StatementDeals from "./StatementDeals";
import { Link } from "react-router-dom";

const StatementTable = (props) => {
  const columns = [
    {
      dataField: "name",
      text: props.t("Name"),
      formatter: (obj) => {
        return (
          <Link href={`/clients/${(obj.client || {}).firstName}/profile`}>
            <strong className="text-capitalize">{`${(obj.client || {}).firstName} ${(obj.client || {}).lastName}`}</strong>
          </Link>
        );
      }
    },
    {
      dataField: "clientLogin",
      text: props.t("Client Login"),
      formatter: (obj) => {
        return (
          <div onClick={() => setCurrentLogin(obj.clientLogin)}>
            <strong className="text-capitalize">{obj.clientLogin}</strong>
          </div>
        );
      }
    },
    {
      dataField: "lotsOpened",
      text: props.t("Lots Opened"),
      formatter: (val) => (val ? parseFloat(val.lotsOpened)  : "-")
    },
    {
      dataField: "commission",
      text: props.t("Commission"),
    },
    {
      dataField: "lotsClosed",
      text: props.t("Lots Closed"),
      formatter: (val) => (val ? parseFloat(val.lotsClosed)  : "-")
    },
    {
      dataField: "rebate",
      text: props.t("Rebate"),
    },
  ];
  const dispatch = useDispatch();
  const { t } = props;
  const { 
    clientDetails, 
    statementLoading,
  } = useSelector((state) => state.clientReducer);

  const [sizePerPage, setSizePerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState(String(moment().subtract(30, "days").format("YYYY-MM-DD")));
  const [dateTo, setDateTo] = useState(String(moment().add(1, "day").format("YYYY-MM-DD")));
  const [currentLogin, setCurrentLogin] = useState(null);

  const {
    _id,
    statement,
  } = clientDetails;

  const handleDateFrom = (e) => setDateFrom(e.target.value);
  const handleDateTo = (e) => setDateTo(e.target.value);

  const platformOptions = [{
    label: t("CTRADER"), 
    value: "CTRADER",
  }];

  const loadStatement = (page = 1, limit = 10) => {
    _id && dispatch(fetchStatement({
      limit,
      page,
      platform: "CTRADER",
      customerId: _id,
      dateFrom: dateFrom,
      dateTo: dateTo,
    }));
  };

  useEffect(() => {
    loadStatement(1, sizePerPage);
  }, [sizePerPage, 1]);

  return (
    <Card className="p-3 mt-4">
      <div className="d-flex justify-content-between">
        <h3>{t("Statement")}</h3>
        <i className="bx bx-dots-vertical-rounded fs-3 mt-1"></i>
      </div>
      <AvForm onValidSubmit={(e, data) => loadStatement(1, 10)}>
        <Row className="mt-3 justify-content-between align-items-end">
          <Col xs="12" md="3" lg="2">
          </Col>
          <Col xs="12" md="3" lg="2">
            <AvFieldSelect 
              className="mt-1 form-select" 
              name="accountTypeId"
              label={t("Platform")}
              errorMessage={t("Platform is required")}
              validate={{ required: { value: true } }}
              options={platformOptions.map((obj)=>{
                return ({
                  label: obj.label, 
                  value: obj.value,
                });
              })} 
            />
          </Col>
          <Col xs="12" md="3" lg="2">
            <AvField 
              className="mt-1 mb-2"
              type="date" 
              name="dateFrom" 
              label={t("From Date")}
              value={dateFrom}
              validate={ { date: { format: "YYYY-MM-DD" } }} 
              onChange={handleDateFrom}
            />
          </Col>
          <Col xs="12" md="3" lg="2">
            <AvField 
              className="mt-1 mb-2"
              type="date" 
              name="dateTo" 
              label={t("To Date")}
              validate={ { date: { format: "YYYY-MM-DD" } }} 
              value={dateTo}
              onChange={handleDateTo}
            />
          </Col>
          <Col>
            <div className="mb-3">
              <Button
                color="primary"
                className="btn-light mt-3 mt-lg-0 w-100"
                disabled={statementLoading}
              >
                {statementLoading ? <Loader/> : t("Search")}
              </Button>
            </div>
          </Col>
          <Col xs="12" md="3" lg="2">
          </Col>
        </Row>
      </AvForm>
      <hr className="my-4" />
      {
        <div className="table-rep-plugin">
          <div
            className="table-responsive mb-0"
            data-pattern="priority-columns"
          >
            <Table
              id="tech-companies-1"
              className="table table-hover table-clients"
            >
              <Thead className="text-center table-light" >
                <Tr>
                  {columns.map((column, index) =>
                    <Th data-priority={index} key={index}>
                      <span className="color-primary">{column.text}</span>
                    </Th>
                  )}
                </Tr>
              </Thead>
              
              <Tbody className="text-center" style={{ fontSize: "13px" }}>
                {props.loading && <TableLoader colSpan={4} />}
                {!props.loading && statement && statement.docs.map((row, rowIndex) =>
                  <Tr key={rowIndex} >
                    {columns.map((column, index) =>
                      <Td key={`${rowIndex}-${index}`} onClick={() => setCurrentLogin(row?.clientLogin)}>
                        
                        {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                      </Td>
                    )}
                  </Tr>
                )}
              </Tbody>
            </Table>
            <CustomPagination
              {...statement}
              setSizePerPage={setSizePerPage}
              sizePerPage={sizePerPage}
              onChange={loadStatement}
              docs={statement && statement.docs || []}
            />
          </div>
        </div>
      }
      <hr className="my-4" />
      <StatementDeals 
        dateFrom={dateFrom}
        dateTo={dateTo}
        currentLogin={currentLogin}
      />
    </Card>
  );
};

const mapStateToProps = (state) => ({
  loading: state.clientReducer.statementLoading || false,
  stDealsLoading: state.clientReducer.statementDealsLoading || false,
  clients: state.clientReducer.clients || [],
  page: state.clientReducer.page || 1,
  totalDocs: state.clientReducer.totalDocs || 0,
  totalPages: state.clientReducer.totalPages || 0,
  hasNextPage: state.clientReducer.hasNextPage,
  hasPrevPage: state.clientReducer.hasPrevPage,
  limit: state.clientReducer.limit,
  nextPage: state.clientReducer.nextPage,
  pagingCounter: state.clientReducer.pagingCounter,
  prevPage: state.clientReducer.prevPage,
  clientPermissions: state.Profile.clientPermissions || {},
  docs:state.usersReducer.docs || []
});
export default connect(mapStateToProps, null)(withTranslation()(StatementTable));
