/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import AddForexWithdrawalModal from "./AddForexWithdrawalModal";
import {
  approveFxWithdrawal,
  fetchForexWithdrawals,
  rejectFxWithdrawal,
} from "store/forexTransactions/withdrawals/actions";
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
import { fetchForexWithdrawalsGatewaysStart } from "store/forexGateway/actions";
import Badge from "components/Common/Badge";
import CustomDropDown from "components/Common/CustomDropDown";
import Filter from "./WithdrawFilter";
import formatDate from "helpers/formatDate";
import FeatherIcon from "feather-icons-react";
import ReceiptModal from "../ReceiptModal";

function WithdrawalForex(props) {
  // get query paramerters from url
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [showNotication, setShowNotifaction] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState({});
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
      dataField: "note",
      text: props.t("Note"),
      formatter: (item) => (item.note ? captilazeFirstLetter(item?.note) : ""),
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
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Details"),
      formatter: (val) => (
        <div className="text-center">
          <Link
            className={`${
              ["CRYPTO", "BLOCKCHAIN", "WIRE_TRANSFER", "حواله بنكيه"].includes(val.gateway)
                ? "text-success"
                : "text-muted"
            }`}
            to="#"
          >
            <i
              className="mdi mdi-eye font-size-20"
              id="edittooltip"
              onClick={() => {
                if (val.gateway === "BLOCKCHAIN") {
                  setDetailsModal(true);
                  setSelectedContent({
                    network:
                      `${val?.rawData?.data?.item?.network} ${val?.rawData?.data?.item?.blockchain}` ||
                      "-",
                    referenceId: val?.rawData?.referenceId || "-",
                    amount: val?.amount?.$numberDecimal || val?.amount || "-",
                    address: val?.rawData?.data?.item?.address || "-",
                    confirmations:
                      val?.rawData?.data?.item?.currentConfirmations || "-",
                    requiredConfirmations:
                      val?.rawData?.data?.item?.targetConfirmations || "-",
                    transactionId:
                      val?.rawData?.data?.item?.transactionId || "-",
                  });
                } else if (val.gateway == "WIRE_TRANSFER" || val.gateway === "حواله بنكيه") {
                  setDetailsModal(true);
                  setSelectedContent({
                    ...val?.content,
                  });
                } else if (val.gateway == "CRYPTO") {
                  setDetailsModal(true);
                  setSelectedContent({
                    ...val?.content,
                  });
                }
              }}
            ></i>
          </Link>
        </div>
      ),
    },
  ];

  const withdrawApprove = (withdraw) => {
    dispatch(
      approveFxWithdrawal({
        id: withdraw._id,
        customerId: withdraw.customerId._id,
      })
    );
  };

  const withdrawReject = (withdraw) => {
    dispatch(
      rejectFxWithdrawal({
        id: withdraw._id,
        customerId: withdraw.customerId._id,
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
  const loadForexWithdrawals = (page, limit) => {
    if (searchInput && searchInput.length > 3) {
      dispatch(
        fetchForexWithdrawals({
          limit,
          page,
          filteredValues,
          searchText: searchInput,
        })
      );
    } else {
      dispatch(
        fetchForexWithdrawals({
          limit,
          page,
          filteredValues,
        })
      );
    }
  };

  const loadWithdrawalForexGateways = () => {
    dispatch(fetchForexWithdrawalsGatewaysStart());
  };

  const closeNotifaction = () => {
    setShowNotifaction(false);
  };

  useEffect(() => {
    loadForexWithdrawals(1, sizePerPage);
  }, [
    props.withdrawalAddLoading,
    sizePerPage,
    1,
    filteredValues,
    searchInput,
    selectedFilter,
    props.fxWithdrawChangeStatusSuccess
  ]);

  useEffect(() => {
    loadWithdrawalForexGateways();
  }, []);

  return (
    <React.Fragment>
      <Notification
        onClose={closeNotifaction}
        body={props.t("Withdrawal has been updated successfully")}
        show={showNotication}
        header={props.t("Withdrawal Update")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="color-primary">
                  {props.t(`Withdrawals(${props.totalDocs})`)}
                  <FeatherIcon
                    icon="refresh-cw"
                    className="icon-lg ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      loadForexWithdrawals(1, sizePerPage);
                    }}
                  />
                </CardTitle>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-between gap-2">
                <div className="d-flex flex-row align-items-center">
                  <SearchBar
                    handleSearchInput={handleSearchInput}
                    placeholder={props.t("Search for withdrawal")}
                  />
                  <Filter
                    filterChangeHandler={filterChangeHandler}
                    filteredValues={filteredValues}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <AddForexWithdrawalModal />
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
                      <Tbody>
                        {props.loading && <TableLoader colSpan={4} />}
                        {!props.loading && (
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
                          props.forexWithdrawals.map((row, rowIndex) => (
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
                                    <CustomDropDown
                                      permission={
                                        props.withdrawalsPermissions.actions
                                      }
                                      status={row.status}
                                      approve={() => withdrawApprove(row)}
                                      reject={() => withdrawReject(row)}
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
                    onChange={loadForexWithdrawals}
                    docs={props.forexWithdrawals}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ReceiptModal
        open={detailsModal}
        content={{
          type: "json",
          content: selectedContent,
        }}
        onClose={() => setDetailsModal(false)}
      />
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.forexWithdrawalReducer.loading || false,
  forexWithdrawals: state.forexWithdrawalReducer.forexWithdrawals || [],
  page: state.forexWithdrawalReducer.page || 1,
  totalDocs: state.forexWithdrawalReducer.forexTotalDocs || 0,
  totalPages: state.forexWithdrawalReducer.totalPages || 0,
  hasNextPage: state.forexWithdrawalReducer.hasNextPage,
  hasPrevPage: state.forexWithdrawalReducer.hasPrevPage,
  limit: state.forexWithdrawalReducer.limit,
  nextPage: state.forexWithdrawalReducer.nextPage,
  pagingCounter: state.forexWithdrawalReducer.pagingCounter,
  prevPage: state.forexWithdrawalReducer.prevPage,
  withdrawalsPermissions: state.Profile.withdrawalsPermissions || {},
  depositResponseMessage: state.forexWithdrawalReducer.depositResponseMessage,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  withdrawalAddLoading: state.forexWithdrawalReducer.withdrawalAddLoading,
  fxWithdrawChangeStatusSuccess:
    state.forexWithdrawalReducer.fxWithdrawChangeStatusSuccess,
});
export default connect(
  mapStateToProps,
  null
)(withTranslation()(WithdrawalForex));
