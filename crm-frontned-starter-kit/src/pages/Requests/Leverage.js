import React, { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";
import { Link } from "react-router-dom";

import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import FeatherIcon from "feather-icons-react";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

import {
  fetchLeverages, leverageRequestApprove, leverageRequestReject,
} from "store/requests/actions";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { withTranslation } from "react-i18next";
import Filter from "./LeverageFilter";
import Badge from "components/Common/Badge";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";

function Leverage(props){

  const columns = [
    {
      dataField: "recordId",
      text: props.t("Request Id"),
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "customerId",
      text: props.t("Client"),
      formatter: (val) => {
        return (
          <div>
            <Link
              to={{
                pathname: `/clients/${val?.customerId?._id}/profile`,
                state: { clientId: val.customerId }
              }}>
              <i className="no-italics fw-bold">{val.customerId ? `${captilazeFirstLetter(val.customerId.firstName)} ${captilazeFirstLetter(val.customerId.lastName)}` : ""}</i>
            </Link>
          </div>
        );
      }
    },
    {
      dataField: "content",
      text: props.t("Trading account"),
      formatter: (val) => { return val.content?.login }
    },
    {
      dataField: "type",
      text: props.t("Platform"),
      formatter: (val) => { return val.content?.platform }
    },
    {
      dataField: "content",
      text: props.t("Leverage"),
      formatter: (val) => { return val.content?.from }

    },
    {
      dataField: "content",
      text: props.t("Requested Leverage"),
      formatter: (val) => { return val.content?.to }
    },
    {
      dataField:"status",
      text: props.t("Status"),
      formatter: (user) => (
        <Badge status={user.status}/>
      ),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (item) => (
        <UncontrolledDropdown
          disabled={
            !props.requestsPermissions.actions ||
              item?.status === "APPROVED" ||
              item?.status === "REJECTED" ? true : false
          }
        >
          <DropdownToggle tag="i" className="text-muted" style={{ cursor: "pointer" }}>
            <i
              className="mdi mdi-dots-horizontal font-size-18"
              style={{ color: item?.status === "APPROVED" || item?.status === "REJECTED" ? "lightgray" : "rgb(66, 65, 65)" }}
            />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem onClick={() => { leverageApprove(item?._id) }} href="#">{props.t("Approve")}</DropdownItem>
            <DropdownItem onClick={() => { leverageRejected(item?._id) }} href="#">{props.t("Reject")}</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    },
  ];
  const [sizePerPage, setSizePerPage] = useState(10);

  const initFilteredValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: ""
    },
    status: "",
    agent: "",
    "content.login": "",
    "content.from": "",
    "content.to": "",
    "content.platform": ""
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    loadLeverages(1, sizePerPage);
  }, [sizePerPage, 1, props.isApproveOrReject, filteredValues, props.clearingCounter]);

  const loadLeverages = (page, limit) => {
    dispatch(fetchLeverages({
      page,
      limit,
      filteredValues
    }));
  };

  const leverageApprove = (id) => {
    dispatch(leverageRequestApprove(id));
  };
  const leverageRejected = (id) => {
    dispatch(leverageRequestReject(id));
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>
            Change Leverage
          </title>
        </MetaTags>
        <div className="container-fluid">
          <h2>Change Leverage</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">Change Leverage Requests ({props.totalDocs})
                    <FeatherIcon
                      icon="refresh-cw"
                      className="icon-lg ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => { loadLeverages(1, sizePerPage) }}
                    />
                  </CardTitle>
                  <Filter filterChangeHandler={filterChangeHandler} filteredValues={filteredValues} />
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
                      >
                        <Thead className="text-center table-light" >
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody className="text-center" style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize"
                        }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.docs.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}>
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={loadLeverages}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* {<DeleteModal loading={props.deleteLoading} onDeleteClick={deleteRole} show={deleteModal } onCloseClick={()=>{setDeleteUserModal(false)}} />} */}
        </div>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.requestReducer.loading || false,
  docs: state.requestReducer.docs || [],
  changeStatusLoading: state.requestReducer.changeStatusLoading,
  changeStatusLoadingIndex: state.requestReducer.changeStatusLoadingIndex,
  page: state.requestReducer.page || 1,
  totalDocs: state.requestReducer.totalDocs || 0,
  totalPages: state.requestReducer.totalPages || 0,
  hasNextPage: state.requestReducer.hasNextPage,
  hasPrevPage: state.requestReducer.hasPrevPage,
  limit: state.requestReducer.limit,
  nextPage: state.requestReducer.nextPage,
  pagingCounter: state.requestReducer.pagingCounter,
  prevPage: state.requestReducer.prevPage,
  deleteLoading: state.requestReducer.deleteLoading,
  deleteClearingCounter: state.requestReducer.deleteClearingCounter,
  requestsPermissions: state.Profile.requestsPermissions || {},
  isApproveOrReject: state.requestReducer.isApproveOrReject,
  clearingCounter: state.requestReducer.clearingCounter
});
export default connect(mapStateToProps, null)(withTranslation()(Leverage));
