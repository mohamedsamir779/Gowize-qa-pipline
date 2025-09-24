import React, { useEffect, useState } from "react";
import {
  useDispatch, connect
} from "react-redux";

import { Link } from "react-router-dom";

import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { withTranslation } from "react-i18next";

import { captilazeFirstLetter as capitalizeFirstLetter } from "common/utils/manipulateString";
import { 
  accountRequestApprove,
  accountRequestReject,
  cleanUp,
  fetchAccountRequests
} from "store/requests/actions";
import Badge from "components/Common/Badge";
import { MetaTags } from "react-meta-tags";
import formatDate from "helpers/formatDate";
import FeatherIcon from "feather-icons-react";

function AccountRequest(props) {
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
                state: { clientId: val.customerId },
              }}
            >
              <i className="no-italics fw-bold">
                {val.customerId
                  ? `${capitalizeFirstLetter(
                    val.customerId.firstName
                  )} ${capitalizeFirstLetter(val.customerId.lastName)}`
                  : ""}
              </i>
            </Link>
          </div>
        );
      },
    },
    {
      dataField: "platform",
      text: props.t("Platform"),
      formatter: (val) => val.content.platform,
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
      formatter: (val) => val.content.currency,
    },
    {
      dataField: "type",
      text: props.t("Type"),
      formatter: (val) => val.content.type
    },
    {
      dataField: "leverage",
      text: props.t("Leverage"),
      formatter: (val) => {
        return `1:${val.content.from}`;
      }
    },
    {
      dataField: "reason",
      text: props.t("Reason"),
      formatter: (val) => val.content.reason
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (user) => <Badge status={user.status}></Badge>,
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (item) => (
        <UncontrolledDropdown
          disabled={
            item.status !== "PENDING"
          }
        >
          <DropdownToggle
            tag="i"
            className="text-muted"
            style={{ cursor: "pointer" }}
          >
            <i
              className="mdi mdi-dots-horizontal font-size-18"
              style={{
                color:
                item.status !== "PENDING"
                  ? "lightgray"
                  : "rgb(66, 65, 65)",
              }}
            />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem
              onClick={() => {
                approveRequest(item?._id);
              }}
              href="#"
            >
              {props.t("Approve")}
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                rejectRequest(item?._id); 
              }}
              href="#"
            >
              {props.t("Reject")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  const [sizePerPage, setSizePerPage] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    
    loadAccountRequests(1, sizePerPage);
    return () => {
      dispatch(cleanUp());
    };
  }, [sizePerPage, 1, props.isApproveOrReject, props.clearingCounter]);

  const loadAccountRequests = (page, limit) =>{
    dispatch(fetchAccountRequests({
      page,
      limit,
    }));
  };

  const approveRequest = (id) =>{
    dispatch(accountRequestApprove(id));
  };

  const rejectRequest = (id) =>{
    dispatch(accountRequestReject(id));
  };
  
  return (
    <React.Fragment>
      <div className="page-content">
        <MetaTags>
          <title>
            Account Requests
          </title>
        </MetaTags>
        <div className="container-fluid">
          <h2>Account</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">New Account Requests ({props.totalDocs})
                    <FeatherIcon
                      icon="refresh-cw"
                      className="icon-lg ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => { loadAccountRequests(1, sizePerPage) }}
                    />
                  </CardTitle>
              
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
                          {!props.loading &&
                            props.docs.length === 0  ? (
                              <>
                                <Tr>
                                  <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                    <h4 className="fw-bolder text-center">No records</h4>
                                  </Td>
                                </Tr>
                              </>
                            ) :
                            props.docs.map((row, rowIndex) =>
                              <Tr key={rowIndex}>
                                {columns.map((column, index) =>
                                  <Td key={`${rowIndex}-${index}`}>
                                    { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
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
                        onChange={loadAccountRequests}
                      />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
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
  requestsPermissions : state.Profile.requestsPermissions || {},
  isApproveOrReject: state.requestReducer.isApproveOrReject,
  clearingCounter: state.requestReducer.clearingCounter,

});
export default connect(mapStateToProps, null)(withTranslation()(AccountRequest));
