/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import FeatherIcon from "feather-icons-react";

import AddDepositForm from "./AddDepositForm";
import {
  fetchDepositsStart,
  depositRejectStart,
  depositApproveStart,
} from "store/transactions/deposit/action";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import Filter from "./DepositFilter";
import Badge from "components/Common/Badge";
import CustomDropDown from "components/Common/CustomDropDown";
import formatDate from "helpers/formatDate";
import ReceiptModal from "../Forex/ReceiptModal";

function Deposit(props) {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [showNotication, setShowNotifaction] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [sizePerPage, setSizePerPage] = useState(10);
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [selected, setSelected] = useState("LIVE");
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
              <i className="no-italics fw-bold">
                {val.customerId
                  ? `${captilazeFirstLetter(
                    val.customerId.firstName
                  )} ${captilazeFirstLetter(val.customerId.lastName)}`
                  : ""}
              </i>
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
      dataField: "currency",
      text: props.t("Currency"),
    },
    {
      dataField: "reason",
      text: props.t("Reason"),
      formatter: (val) =>
        val.reason ? (
          <div data-title={val.reason}>
            {val.reason.length > 20
              ? `${val.reason.slice(0, 20)}...`
              : val.reason}
          </div>
        ) : (
          <>{val?.note}</>
        ),
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
      formatter: (val) => val?.amount?.$numberDecimal || val?.amount || "-",
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <Badge status={val.status}></Badge>,
    },
    {
      dataField: "bankReceipt",
      text: props.t("Bank Receipt"),
      formatter: (val) => {
        if (val?.receipt) {
          return (
            <div className="text-center">
              <div
                className={val.gateway === "WIRE_TRANSFER" || val.gateway === "PERFECT_MONEY" || val.gateway === "حواله بنكيه" ? "" : "text-muted "}
                style={{
                  cursor: "pointer",
                }}
              >
                <i
                  className="mdi mdi-eye font-size-20"
                  id="edittooltip"
                  onClick={() => {
                    if (val.gateway === "WIRE_TRANSFER" || val.gateway === "PERFECT_MONEY" || val.gateway === "حواله بنكيه") {
                      setDetailsModal(true);
                      setSelectedContent({
                        type: "image",
                        content: val?.receipt,
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
      dataField: "additionalDetails",
      text: props.t("Additional Details"),
      formatter: (val) => {
        if (val?.content || val?.rawData) {
          return (
            <div className="text-center">
              <div
                className={
                  ["CRYPTO", "BLOCKCHAIN"].includes(val.gateway)
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
                    if (val.gateway === "CRYPTO") {
                      setDetailsModal(true);
                      setSelectedContent({
                        type: "json",
                        content: val?.content,
                      });
                    } else if (val.gateway === "BLOCKCHAIN") {
                      setDetailsModal(true);
                      setSelectedContent({
                        type: "json",
                        content: {
                          network: `${val?.rawData?.data?.item?.network} ${val?.rawData?.data?.item?.unit}`,
                          referenceId: val?.rawData?.referenceId,
                          amount: val?.rawData?.data?.item?.amount,
                          address: val?.rawData?.data?.item?.address,
                          confirmations:
                            val?.rawData?.data?.item?.currentConfirmations,
                          requiredConfirmations:
                            val?.rawData?.data?.item?.targetConfirmations,
                          transactionId:
                            val?.rawData?.data?.item?.transactionId,
                        },
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
      dataField: "dropdown",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
    },
  ];
  const initFilteredValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: "",
    },
    status: "",
    currency: "",
    amount: "",
    gateway: "",
    agent: "",
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };
  useEffect(() => {
    if (!detailsModal) loadDeposits(1, sizePerPage);
  }, [
    sizePerPage,
    1,
    searchInput,
    selected,
    props.depositResponseMessage,
    props.depositChangeStatusSuccess,
    filteredValues,
  ]);

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };

  const loadDeposits = (page, limit) => {
    if (searchInput !== "" && searchInput.length >= 3) {
      dispatch(
        fetchDepositsStart({
          limit,
          page,
          type: selected,
          searchText: searchInput,
          filteredValues,
        })
      );
    } else if (searchInput === "") {
      dispatch(
        fetchDepositsStart({
          limit,
          page,
          type: selected,
          filteredValues,
        })
      );
    }
  };

  const depositApprove = (deposit) => {
    dispatch(
      depositApproveStart({
        id: deposit._id,
        customerId: deposit.customerId._id,
      })
    );
    // setShowNotifaction(true);
  };

  const depositReject = (deposit) => {
    dispatch(
      depositRejectStart({
        id: deposit._id,
        customerId: deposit.customerId._id,
      })
    );
    // setShowNotifaction(true);
  };

  const closeNotifaction = () => {
    setShowNotifaction(false);
  };

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
                      loadDeposits(1, sizePerPage);
                    }}
                  />
                </CardTitle>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-between gap-2">
                <div className="d-flex flex-row align-items-center">
                  <SearchBar
                    handleSearchInput={handleSearchInput}
                    placeholder={props.t("Enter Transaction Id")}
                  />
                  {/* <div>
                    <Dropdown
                      isOpen={btnprimary1}
                      toggle={() => setBtnprimary1(!btnprimary1)}
                    >
                      <DropdownToggle tag="button" className="btn btn-primary">
                        {selected} <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem value="LIVE" onClick={(e) => { setSelected(e.target.value) }}>Live</DropdownItem>
                        <DropdownItem value="DEMO" onClick={(e) => { setSelected(e.target.value) }}>Demo</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div> */}
                  <Filter
                    filterChangeHandler={filterChangeHandler}
                    filteredValues={filteredValues}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <AddDepositForm />
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
                          props.deposits.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {columns.map((column, index) => (
                                <Td
                                  key={`${rowIndex}-${index}`}
                                  className={`pt-4 ${column.dataField === "dropdown" &&
                                    "d-flex justify-content-center"
                                    }`}
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
                    onChange={loadDeposits}
                    docs={props.deposits}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {/* {<DetailsModal rawData={selectedContent} open={detailsModal} onClose={() => setDetailsModal(false)} />} */}
      {selectedContent && (
        <ReceiptModal
          content={selectedContent}
          open={detailsModal}
          onClose={() => setDetailsModal(false)}
        />
      )}
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  loading: state.depositReducer.loading || false,
  deposits: state.depositReducer.deposits || [],
  page: state.depositReducer.page || 1,
  totalDocs: state.depositReducer.totalDocs || 0,
  totalPages: state.depositReducer.totalPages || 0,
  hasNextPage: state.depositReducer.hasNextPage,
  hasPrevPage: state.depositReducer.hasPrevPage,
  limit: state.depositReducer.limit,
  nextPage: state.depositReducer.nextPage,
  pagingCounter: state.depositReducer.pagingCounter,
  prevPage: state.depositReducer.prevPage,
  depositsPermissions: state.Profile.depositsPermissions || {},
  depositResponseMessage: state.depositReducer.depositResponseMessage,
  depositChangeStatusSuccess: state.depositReducer.depositChangeStatusSuccess,
});
export default connect(mapStateToProps, null)(withTranslation()(Deposit));
