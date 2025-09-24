/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import CustomDropdown from "components/Common/CustomDropDown";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link, useLocation } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import {
  approveInternalTransfer,
  fetchInternalTransfers,
  rejectInternalTransfer,
} from "store/forexTransactions/internalTransfers/actions";
import Badge from "components/Common/Badge";
import Filter from "./Filter";
import formatDate from "helpers/formatDate";
import FeatherIcon from "feather-icons-react";
import InternalTransferModal from "./InternalTransferModal";

function Credit(props) {
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [showNotication, setShowNotifaction] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const columns = [
    {
      dataField: "checkbox",
      text: (
        <input
          type="checkbox"
          id="check-all-deposits"
          onChange={() =>
            checkAllBoxes("check-all-deposits", ".deposit-checkbox")
          }
        />
      ),
    },
    {
      dataField: "recordId",
      text: props.t("Transaction Id"),
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      dataField: "Client",
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
              <span className="no-italics" style={{ fontWeight: "bold" }}>
                {val?.customerId
                  ? `${captilazeFirstLetter(
                      val?.customerId?.firstName
                    )} ${captilazeFirstLetter(val?.customerId?.lastName)}`
                  : ""}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
    },
    {
      dataField: "tradingAccountFrom",
      text: props.t("From Account"),
      formatter: (item) =>
        item.tradingAccountFrom && item.tradingAccountFrom.login,
    },
    {
      dataField: "tradingAccountTo",
      text: props.t("To Account"),
      formatter: (item) => item.tradingAccountTo && item.tradingAccountTo.login,
    },
    {
      dataField: "fee",
      text: props.t("Fee"),
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <Badge status={val.status} />,
    },
    {
      dataField: "dropdown",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
    },
  ];

  const handleApproveRequest = (request) => {
    dispatch(
      approveInternalTransfer({
        id: request._id,
      })
    );
  };

  const handleRejectRequest = (request) => {
    dispatch(
      rejectInternalTransfer({
        id: request._id,
      })
    );
  };

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const initFilteredValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: "",
    },
    status: query.get("status") || "",
    currency: "",
    amount: "",
    fee: "",
    tradingAccountFrom: "",
    tradingAccountTo: "",
    agent: "",
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };
  const loadInternalTransfers = (page, limit) => {
    if (searchInput && searchInput.length > 3) {
      dispatch(
        fetchInternalTransfers({
          limit,
          page,
          filteredValues,
          searchText: searchInput,
        })
      );
    } else {
      dispatch(
        fetchInternalTransfers({
          limit,
          page,
          filteredValues,
        })
      );
    }
  };

  const closeNotifaction = () => {
    setShowNotifaction(false);
  };

  useEffect(() => {
    loadInternalTransfers(1, sizePerPage);
  }, [
    props.addInternalTransferLoading,
    sizePerPage,
    1,
    filteredValues,
    searchInput,
    selectedFilter,
  ]);

  return (
    <React.Fragment>
      <Notification
        onClose={closeNotifaction}
        body={props.t("The internal transfer has been updated successfully")}
        show={showNotication}
        header={props.t("Internal Transfer Update")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="color-primary">
                  {props.t(
                    `Internal Transfers(${props.internalTransfersTotalDocs})`
                  )}
                  <FeatherIcon
                    icon="refresh-cw"
                    className="icon-lg ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      loadInternalTransfers(1, sizePerPage);
                    }}
                  />
                </CardTitle>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-between gap-2">
                <div className="d-flex flex-row align-items-center">
                  <SearchBar
                    handleSearchInput={handleSearchInput}
                    placeholder={props.t("Search Transaction Id")}
                  />
                  <Filter
                    filterChangeHandler={filterChangeHandler}
                    filteredValues={filteredValues}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <InternalTransferModal />
                </div>
              </div>
            </CardHeader>
            <CardBody>
              <div className="table-rep-plugin">
                <div
                  className="table-responsive mb-0"
                  data-pattern="priority-columns"
                >
                  <Table id="tech-companies-1" className="table  table-hover ">
                    <Thead className="text-center table-light">
                      <Tr>
                        {columns.map((column, index) =>
                          <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                        )}
                      </Tr>
                    </Thead>

                    {props.internalTransfersTotalDocs === 0 ? (
                      <Tbody>
                        {props.fetchInternalTransfersLoading && (
                          <TableLoader colSpan={4} />
                        )}
                        {!props.fetchInternalTransfersLoading && (
                          <>
                            <Tr>
                              <Td
                                colSpan={"100%"}
                                className="fw-bolder text-center"
                                st
                              >
                                <h3 className="fw-bolder text-center">
                                  No records
                                </h3>
                              </Td>
                            </Tr>
                          </>
                        )}
                      </Tbody>
                    ) : (
                      <Tbody
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize",
                        }}
                      >
                        {props.loading && <TableLoader colSpan={4} />}
                        {!props.loading &&
                          props.internalTransfers.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {columns.map((column, index) => (
                                <Td
                                  key={`${rowIndex}-${index}`}
                                  className="pt-4"
                                >
                                  {column.dataField === "checkbox" ? (
                                    <input
                                      className="deposit-checkbox"
                                      type="checkbox"
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {column.formatter
                                    ? column.formatter(row, rowIndex)
                                    : row[column.dataField]}
                                  {column.dataField === "dropdown" && (
                                    <CustomDropdown
                                      permission={
                                        props.internalTransferPermissions
                                          .actions
                                      }
                                      status={row.status}
                                      approve={() => handleApproveRequest(row)}
                                      reject={() => handleRejectRequest(row)}
                                    />
                                  )}
                                </Td>
                              ))}
                            </Tr>
                          ))}
                      </Tbody>
                    )}
                  </Table>
                  <CustomPagination
                    {...props}
                    setSizePerPage={setSizePerPage}
                    sizePerPage={sizePerPage}
                    onChange={loadInternalTransfers}
                    docs={props.internalTransfers}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  fetchInternalTransfersLoading:
    state.internalTransferReducer.fetchInternalTransfersLoading || false,
  internalTransfers: state.internalTransferReducer.internalTransfers || [],
  page: state.internalTransferReducer.page || 1,
  internalTransfersTotalDocs:
    state.internalTransferReducer.internalTransfersTotalDocs || 0,
  totalPages: state.internalTransferReducer.totalPages || 0,
  hasNextPage: state.internalTransferReducer.hasNextPage,
  hasPrevPage: state.internalTransferReducer.hasPrevPage,
  limit: state.internalTransferReducer.limit,
  nextPage: state.internalTransferReducer.nextPage,
  pagingCounter: state.internalTransferReducer.pagingCounter,
  prevPage: state.internalTransferReducer.prevPage,
  depositsPermissions: state.Profile.depositsPermissions || {},
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  addInternalTransferLoading:
    state.internalTransferReducer.addInternalTransferLoading,
  internalTransferPermissions: state.Profile.depositsPermissions,
  totalDocs: state.internalTransferReducer.totalDocs || 0,
});
export default connect(mapStateToProps, null)(withTranslation()(Credit));
