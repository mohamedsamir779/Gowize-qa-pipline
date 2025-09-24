/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import AddForexDepositModal from "./AddForexDepositModal";
import {
  approveFxDeposit,
  fetchForexDeposits,
  rejectFxDeposit,
} from "store/forexTransactions/deposits/actions";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link, useLocation } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { fetchForexDepositsGatewaysStart } from "store/forexGateway/actions";
import CustomDropdown from "components/Common/CustomDropDown";
import Filter from "./DepositFilter";
import Badge from "components/Common/Badge";
import formatDate from "helpers/formatDate";
import ReceiptModal from "../ReceiptModal";
import FeatherIcon from "feather-icons-react";

function DepositForex(props) {
  // get query paramerters from url
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [showNotication, setShowNotifaction] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");

  const depositApprove = (deposit) => {
    dispatch(
      approveFxDeposit({
        id: deposit._id,
        customerId: deposit.customerId._id,
      })
    );
    // setShowNotifaction(true);
  };

  const depositReject = (deposit) => {
    dispatch(
      rejectFxDeposit({
        id: deposit._id,
        customerId: deposit.customerId._id,
      })
    );
    // setShowNotifaction(true);
  };
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
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      dataField: "recordId",
      text: props.t("Transaction Id"),
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
              <span className="no-italics" style={{ fontWeight: "bold" }}>
                {val.customerId
                  ? `${captilazeFirstLetter(
                    val.customerId.firstName
                  )} ${captilazeFirstLetter(val.customerId.lastName)}`
                  : ""}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      dataField: "gateway",
      text: props.t("Gateway"),
      formatter: (val) =>
        val.gateway == "WIRE_TRANSFER"
          ? "Wire"
          : val.gateway?.split("_").join(" ")?.toLowerCase(),
    },
    {
      dataField: "tradingAccount",
      text: props.t("Trading Account"),
      formatter: (item) => item.tradingAccountId?.login,
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
    },
    {
      dataField: "bankReceipt",
      text: props.t("Bank Receipt"),
      formatter: (val) => {
        if (val?.receipt) {
          return (
            <div className="text-center">
              <div
                className={
                  ["WIRE_TRANSFER", "STRIPE", "PERFECT_MONEY", "حواله بنكيه"].includes(val?.gateway)
                    ? "text-success"
                    : "text-muted "
                }
                style={{
                  cursor: "pointer",
                }}
              >
                <i
                  className="mdi mdi-eye font-size-20"
                  id="edittooltip"
                  onClick={() => {
                    if (val.gateway === "WIRE_TRANSFER" || val.gateway === "حواله بنكيه" || val.gateway === "PERFECT_MONEY") {
                      setDetailsModal(true);
                      setSelectedContent({
                        type: "image",
                        content: val?.receipt,
                      });
                    } else if (val?.gateway === "STRIPE") {
                      window.open(val?.receipt, "_blank");
                    }
                  }}
                ></i>
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <div className={"text-muted "}>
                <i className="mdi mdi-eye font-size-20" id="edittooltip"></i>
              </div>
            </div>
          );
        }
      },
    },
    {
      dataField: "additionalDetails",
      text: props.t("Additional Details"),
      formatter: (val) => {
        if (val?.content) {
          return (
            <div className="text-center">
              <div
                className={val.gateway === "CRYPTO" ? "" : "text-muted "}
                style={{
                  cursor: "pointer",
                }}
              >
                <i
                  className="mdi mdi-eye font-size-20"
                  id="edittooltip"
                  onClick={() => {
                    if (val.gateway === "CRYPTO") {
                      setDetailsModal(true);
                      setSelectedContent({
                        type: "json",
                        content: val?.content,
                      });
                    }
                  }}
                ></i>
              </div>
            </div>
          );
        } else {
          return (
            <div className="text-center">
              <div className={"text-muted "}>
                <i className="mdi mdi-eye font-size-20" id="edittooltip"></i>
              </div>
            </div>
          );
        }
      },
    },
    {
      dataField: "note",
      text: props.t("Note"),
    },
    {
      dataField: "paid",
      text: props.t("paid"),
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
      dataField: "salesRep",
      text: props.t("Sales Rep"),
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <Badge status={val.status}></Badge>,
    },
    {
      dataField: "dropdown",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
    },
  ];

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
    paid: "",
    amount: "",
    fee: "",
    gateway: "",
    tradingAccount: "",
    agent: "",
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };
  const loadForexDeposits = (page, limit) => {
    if (searchInput && searchInput.length > 3) {
      dispatch(
        fetchForexDeposits({
          limit,
          page,
          filteredValues,
          searchText: searchInput,
        })
      );
    } else {
      dispatch(
        fetchForexDeposits({
          limit,
          page,
          filteredValues,
        })
      );
    }
  };

  const loadForexGateways = () => {
    dispatch(fetchForexDepositsGatewaysStart());
  };

  const closeNotifaction = () => {
    setShowNotifaction(false);
  };

  useEffect(() => {
    loadForexDeposits(1, sizePerPage);
  }, [
    props.addLoading,
    sizePerPage,
    1,
    searchInput,
    selectedFilter,
    filteredValues,
    props.depositResponseMessage,
  ]);

  useEffect(() => {
    loadForexGateways();
  }, []);

  return (
    <React.Fragment>
      <Notification
        onClose={closeNotifaction}
        body={props.t("The deposit has been updated successfully")}
        show={showNotication}
        header={props.t("Deposit Update")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="color-primary">
                  {props.t(`Deposits(${props.totalDocs})`)}
                  <FeatherIcon
                    icon="refresh-cw"
                    className="icon-lg ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      loadForexDeposits(1, sizePerPage);
                    }}
                  />
                </CardTitle>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-between gap-2">
                <div className="d-flex flex-row align-items-center">
                  <SearchBar
                    handleSearchInput={handleSearchInput}
                    placeholder={props.t("Search for deposits")}
                  />
                  <Filter
                    filterChangeHandler={filterChangeHandler}
                    filteredValues={filteredValues}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <AddForexDepositModal />
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

                    {props.totalDocs === 0 ? (
                      <Tbody
                        style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize",
                        }}
                      >
                        {props.fetchLoading && <TableLoader colSpan={4} />}
                        {!props.fetchLoading && (
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
                        {props.fetchLoading && <TableLoader colSpan={4} />}
                        {!props.fetchLoading &&
                          props.forexDeposits.map((row, rowIndex) => (
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
                                        props.depositsPermissions.actions && !["FINITIC_PAY"].includes(row.gateway)
                                      }
                                      status={row.status}
                                      approve={() => depositApprove(row)}
                                      reject={() => depositReject(row)}
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
                    onChange={loadForexDeposits}
                    docs={props.forexDeposits}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {
        <ReceiptModal
          content={selectedContent}
          open={detailsModal}
          onClose={() => setDetailsModal(false)}
        />
      }
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  fetchLoading: state.forexDepositReducer.fetchLoading || false,
  addLoading: state.forexDepositReducer.addLoading || false,
  forexDeposits: state.forexDepositReducer.forexDeposits || [],
  page: state.forexDepositReducer.page || 1,
  totalDocs: state.forexDepositReducer.forexTotalDocs || 0,
  totalPages: state.forexDepositReducer.totalPages || 0,
  hasNextPage: state.forexDepositReducer.hasNextPage,
  hasPrevPage: state.forexDepositReducer.hasPrevPage,
  limit: state.forexDepositReducer.limit,
  nextPage: state.forexDepositReducer.nextPage,
  pagingCounter: state.forexDepositReducer.pagingCounter,
  prevPage: state.forexDepositReducer.prevPage,
  depositsPermissions: state.Profile.depositsPermissions || {},
  depositResponseMessage: state.forexDepositReducer.depositResponseMessage,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
});
export default connect(mapStateToProps, null)(withTranslation()(DepositForex));
