/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import {
  approveFxWithdrawal,
  fetchForexWithdrawals,
  rejectFxWithdrawal,
} from "store/forexTransactions/withdrawals/actions";
import {
  approveFxDeposit,
  fetchForexDeposits,
  rejectFxDeposit,
} from "store/forexTransactions/deposits/actions";
// import Notification from "components/Common/Notification";
// import logo from "assets/images/logo-sm.svg";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import Badge from "components/Common/Badge";
import formatDate from "helpers/formatDate";
import FxTransactions2 from "pages/ClientDetail/Profile/QuickActions/FxTransactions2";
import sleep from "sleep-promise";

function ForexClientTransactions(props) {
  const clientId = props.clientId;
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedTransactionType, setSelectedTransactionType] =
    useState("Withdrawal");
  const transactionTypes = ["Withdrawal", "Deposit"];
  const dispatch = useDispatch();
  const {
    forexDeposits,
    forexWithdrawals,
    withdrawalsTotalDocs,
    depositsTotalDocs,
    forexDepositsLoading,
    forexWithdrawalLoading,
    pagination,
  } = useSelector((state) => ({
    forexDeposits: state.forexDepositReducer.forexDeposits || [],
    forexWithdrawals: state.forexWithdrawalReducer.forexWithdrawals || [],
    withdrawalsTotalDocs: state.forexWithdrawalReducer.forexTotalDocs || 0,
    depositsTotalDocs: state.forexDepositReducer.forexTotalDocs || 0,
    forexDepositsLoading: state.forexDepositReducer.loading || false,
    forexWithdrawalsLoading: state.forexWithdrawalReducer.loading || false,
    pagination:
      selectedTransactionType === "Withdrawal"
        ? state.forexWithdrawalReducer
        : state.forexDepositReducer,
  }));

  const changeTransactionTypeHandler = (e) => {
    setSelectedTransactionType(e.target.innerText);
  };
  const loadClientForexTransactionsdetails = (page, limit) => {
    dispatch(
      fetchForexDeposits({
        customerId: clientId,
        limit,
        page,
      })
    );
    dispatch(
      fetchForexWithdrawals({
        customerId: clientId,
        page,
        limit,
      })
    );
  };
  useEffect(() => {
    loadClientForexTransactionsdetails(1, sizePerPage);
  }, [selectedTransactionType]);

  const approve = (transaction) => {
    if (selectedTransactionType === "Deposit") {
      dispatch(
        approveFxDeposit({
          id: transaction._id,
          customerId: transaction.customerId._id,
        })
      );
    } else {
      dispatch(
        approveFxWithdrawal({
          id: transaction._id,
          customerId: transaction.customerId._id,
        })
      );
    }
    sleep(1000).then(() => {
      loadClientForexTransactionsdetails(1, sizePerPage);
    });
  };

  const reject = (transaction) => {
    if (selectedTransactionType === "Deposit") {
      dispatch(
        rejectFxDeposit({
          id: transaction._id,
          customerId: transaction.customerId._id,
        })
      );
    } else {
      dispatch(
        rejectFxWithdrawal({
          id: transaction._id,
          customerId: transaction.customerId._id,
        })
      );
    }
    sleep(1000).then(() => {
      loadClientForexTransactionsdetails(1, sizePerPage);
    });
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
      formatter: (val) =>
        val.customerId
          ? `${captilazeFirstLetter(
              val.customerId.firstName
            )} ${captilazeFirstLetter(val.customerId.lastName)}`
          : "",
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
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (transactions) => (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="i"
            className="text-muted"
            style={{ cursor: "pointer" }}
          >
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem onClick={() => approve(transactions)}>
              {props.t("Approve")}
            </DropdownItem>
            <DropdownItem onClick={() => reject(transactions)}>
              {props.t("Reject")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          {/* notification if selected transaction type is deposit */}
          {/* {selectedTransactionType === "Deposit" && 
            <Notification
              onClose={closeNotifaction}
              body={props.t("The deposit has been updated successfully")}
              show={showNotication}
              header={props.t("Deposit Update")}
              logo={logo}
            />
          } */}
          {/* notification if selected transaction type is withdrawal */}
          {/* {selectedTransactionType === "Withdrawal" && 
            <Notification onClose={closeNotifaction}
              body={props.t("The update of the withdraw has been made successfully")}
              show={showNotication}
              header={props.t("Withdraw update")}
              time={props.t("Now")}
              logo={logo}
            />
          } */}
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    {props.t("Transactions list")} (
                    {selectedTransactionType === "Withdrawal"
                      ? withdrawalsTotalDocs
                      : depositsTotalDocs}
                    )
                  </CardTitle>
                  <div className="d-flex gap-2 flex-column flex-md-row">
                    <div className="d-inline-block me-2">
                      <FxTransactions2 clientId={clientId} />
                    </div>
                    <Dropdown
                      isOpen={btnprimary1}
                      className="d-inline-block"
                      toggle={() => {
                        setBtnprimary1(!btnprimary1);
                      }}
                    >
                      <DropdownToggle tag="button" className="btn btn-primary">
                        {selectedTransactionType}{" "}
                        <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        {transactionTypes.map((transactionType) => (
                          <DropdownItem
                            key={transactionTypes.indexOf(transactionType)}
                            onClick={(e) => {
                              changeTransactionTypeHandler(e);
                            }}
                          >
                            {props.t(transactionType)}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </div>
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
                        <Thead className="text-center table-light">
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                            )}
                          </Tr>
                        </Thead>
                        {/* if no records show "No records" otherwise show records */}
                        {
                          // if deposits is selected then render clientDeposits
                          selectedTransactionType === "Deposit" ? (
                            // if deposits is selected but no data to show
                            depositsTotalDocs === 0 ? (
                              <Tbody>
                                {forexDepositsLoading && (
                                  <TableLoader colSpan={4} />
                                )}
                                {!forexDepositsLoading && (
                                  <>
                                    <Tr>
                                      <Td
                                        colSpan={"100%"}
                                        className="fw-bolder text-center"
                                        st="true"
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
                              // if deposits is selected and there is data to show
                              <Tbody
                                style={{
                                  fontSize: "12px",
                                  textAlign: "center",
                                  textTransform: "capitalize",
                                }}
                              >
                                {forexDepositsLoading && (
                                  <TableLoader colSpan={4} />
                                )}
                                {!forexDepositsLoading &&
                                  forexDeposits.map((row, rowIndex) => (
                                    <Tr key={rowIndex}>
                                      {columns.map((column, index) => (
                                        <Td key={`${rowIndex}-${index}`}>
                                          {column.dataField === "checkbox" ? (
                                            <input type="checkbox" />
                                          ) : (
                                            ""
                                          )}
                                          {column.formatter
                                            ? column.formatter(row, rowIndex)
                                            : row[column.dataField]}
                                        </Td>
                                      ))}
                                    </Tr>
                                  ))}
                              </Tbody>
                            )
                          ) : // if withdrawals is selected
                          withdrawalsTotalDocs === 0 ? (
                            // if withdrawals is seleceted but no data to show
                            <Tbody>
                              {forexWithdrawalLoading && (
                                <TableLoader colSpan={4} />
                              )}
                              {!forexWithdrawalLoading && (
                                <>
                                  <Tr>
                                    <Td
                                      colSpan={"100%"}
                                      className="fw-bolder text-center"
                                      st="true"
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
                            // if withdrawals is selected and there is data to show
                            <Tbody
                              style={{
                                fontSize: "12px",
                                textAlign: "center",
                                textTransform: "capitalize",
                              }}
                            >
                              {forexWithdrawalLoading && (
                                <TableLoader colSpan={4} />
                              )}
                              {!forexWithdrawalLoading &&
                                forexWithdrawals.map((row, rowIndex) => (
                                  <Tr key={rowIndex}>
                                    {columns.map((column, index) => (
                                      <Td key={`${rowIndex}-${index}`}>
                                        {column.dataField === "checkbox" ? (
                                          <input type="checkbox" />
                                        ) : (
                                          ""
                                        )}
                                        {column.formatter
                                          ? column.formatter(row, rowIndex)
                                          : row[column.dataField]}
                                      </Td>
                                    ))}
                                  </Tr>
                                ))}
                            </Tbody>
                          )
                        }
                      </Table>
                      {/* if deposits is selected */}
                      {}
                    </div>
                  </div>
                </CardBody>
                <CustomPagination
                  {...pagination}
                  totalDocs={
                    selectedTransactionType === "Deposit"
                      ? depositsTotalDocs
                      : withdrawalsTotalDocs
                  }
                  docs={
                    selectedTransactionType === "Deposit"
                      ? forexDeposits
                      : forexWithdrawals
                  }
                  setSizePerPage={setSizePerPage}
                  sizePerPage={sizePerPage}
                  onChange={loadClientForexTransactionsdetails}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  );
}

export default withTranslation()(ForexClientTransactions);
