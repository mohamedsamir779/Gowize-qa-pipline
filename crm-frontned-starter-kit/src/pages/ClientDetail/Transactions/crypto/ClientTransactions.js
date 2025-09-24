import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody, 
  CardTitle, CardHeader, 
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { 
  fetchClientWithdrawals, withdrawApproveStart, withdrawRejectStart 
} from "store/transactions/withdrawal/action";
import {
  depositRejectStart, 
  depositApproveStart,
  fetchClientDeposits  
} from "store/transactions/deposit/action";
// import Notification from "components/Common/Notification";
// import logo from "assets/images/logo-sm.svg";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import formatDate from "helpers/formatDate";
import Badge from "components/Common/Badge";


function ClientTransactions(props) {
  const clientId = props.clientId;
  // const [showNotication, setShowNotifaction] = useState(false);
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedTransactionType, setSelectedTransactionType] = useState("Withdrawal");
  const transactionTypes = ["Withdrawal", "Deposit"];
  const dispatch = useDispatch();

  const changeTransactionTypeHandler = (e) => {
    setSelectedTransactionType(e.target.innerText);
  };
  const loadClientTransactionsdetails = () => {
    dispatch(fetchClientDeposits({ 
      clientId,
      type: "LIVE" 
    }));
    dispatch(fetchClientWithdrawals({ 
      clientId,
      type: "LIVE"
    }));
  };
  useEffect(() => {
    loadClientTransactionsdetails();
  }, [selectedTransactionType]);

  const depositApprove = (deposit)=>{
    dispatch(depositApproveStart({
      id: deposit._id,
      customerId: deposit.customerId._id 
    }));
    // setShowNotifaction(true);
  };
  const depositReject = (deposit)=>{
    dispatch(depositRejectStart({
      id: deposit._id,
      customerId: deposit.customerId._id 
    }));
    // setShowNotifaction(true);
  };
  // const closeNotifaction = () => {
  //   setShowNotifaction(false);
  // };

  const withdrawApprove = (withdrawal) => {
    dispatch(withdrawApproveStart({
      id: withdrawal._id,
      customerId: withdrawal.customerId._id 
    }));
    // setShowNotifaction(true);
  };
  const withdrawReject = (withdrawal) => {
    dispatch(withdrawRejectStart({
      id: withdrawal._id,
      customerId: withdrawal.customerId._id 
    }));
    // setShowNotifaction(true);
  };

  const columns = [
    {
      dataField: "checkbox",
      text: <input type="checkbox"/>
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    }, 
    {
      dataField: "customerId",
      text: props.t("Client"),
      formatter:(val)=>(val.customerId ? `${captilazeFirstLetter(val.customerId?.firstName)} ${captilazeFirstLetter(val.customerId?.lastName)}` : "")
    },
    {
      dataField: "gateway",
      text: props.t("Gateway"),
      formatter: (val) => (val.gateway == "WIRE_TRANSFER" ? "Wire" : val.gateway?.split("_").join(" ")?.toLowerCase())
    },
    {
      dataField: "currency",
      text: props.t("Currency")    
    },
    selectedTransactionType === "Deposit" && {
      dataField: "to",
      text: props.t("To"),
      formatter: (val) => (
        val.to?.length >= 10 ? val.to.substr(0, 4) + "....." + val.to.substr(-5, 4) : val.to
      )
    },
    selectedTransactionType === "Withdrawal" && {
      dataField: "from",
      text: props.t("From"),
      formatter: (val) => (
        val.from?.length >= 10 ? val.from.substr(0, 4) + "....." + val.from.substr(-5, 4) : val.from
      )
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <Badge status={val.status}></Badge>,
    },
    {
      dataField: "reason",
      text: props.t("Reason"),
      formatter: (item) => (
        item.reason ? item.reason : "-"
      )
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
      formatter: (item) => (
        parseFloat(item?.amount?.$numberDecimal) || parseFloat(item?.amount) || "-"
      )
    },
    {
      dataField: "note",
      text: props.t("note"),
      formatter: (item) => (
        item?.note?.length === 0 ? "-" : captilazeFirstLetter(item?.note)
      )
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Tx-id"), 
      formatter: (item) => (
        <Link to="#">
          <i
            className="mdi mdi-clipboard font-size-18"
            id="preview"
            onClick={ () => {navigator.clipboard.writeText(item.txId)} }
          ></i>
        </Link>
      )
    },
    selectedTransactionType === "Deposit" &&
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (item) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="i" className="text-muted" style={{ cursor: "pointer" }}>
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem
              onClick={() => {depositApprove(item)}} 
              href="#">{props.t("Approve")}
            </DropdownItem>
            <DropdownItem 
              onClick={() => {depositReject(item)}}
              href="#">{props.t("Reject")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    },
    selectedTransactionType === "Withdrawal" &&
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (item) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="i" className="text-muted" style={{ cursor: "pointer" }}>
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem 
              onClick={() => {withdrawApprove(item)}} 
              href="#">{props.t("Approve")}
            </DropdownItem>
            <DropdownItem 
              onClick={() => {withdrawReject(item)}}
              href="#">{props.t("Reject")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
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
                    {props.t("Transactions list")} ({selectedTransactionType === "Withdrawal" ? props.withdrawalsTotalDocs : props.depositsTotalDocs})
                  </CardTitle>
                  <Dropdown
                    isOpen={btnprimary1}
                    toggle={() => {setBtnprimary1(!btnprimary1)}}
                  >
                    <DropdownToggle tag="button" className="btn btn-primary">
                      {selectedTransactionType} <i className="mdi mdi-chevron-down" />
                    </DropdownToggle>
                    <DropdownMenu>
                      {transactionTypes.map((transactionType) => (
                        <DropdownItem 
                          key={transactionTypes.indexOf(transactionType)}
                          onClick={(e) => {changeTransactionTypeHandler(e)}}
                        >
                          {props.t(transactionType)}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
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
                        {/* if no records show "No records" otherwise show records */}
                        {
                          // if deposits is selected then render clientDeposits
                          selectedTransactionType === "Deposit"
                            ?
                            // if deposits is selected but no data to show
                            props.depositsTotalDocs === 0 
                              ?
                              <Tbody>
                                {props.loading && <TableLoader colSpan={4} />}                            
                                {!props.loading && /*props.totalDocs === 0 && */
                                  <>
                                    <Tr>
                                      <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                        <h3 className="fw-bolder text-center">No records</h3>
                                      </Td>
                                    </Tr>
                                  </>
                                }
                              </Tbody>
                              :
                              // if deposits is selected and there is data to show
                              <Tbody style = {{
                                fontSize: "12px",
                                textAlign: "center",
                                textTransform: "capitalize"
                              }}>
                                {props.loading && <TableLoader colSpan={4} />}
                                {!props.depositLoading && props.clientDeposits.map((row, rowIndex) =>
                                  <Tr key={rowIndex}>
                                    {columns.map((column, index) =>
                                      <Td key={`${rowIndex}-${index}`}>
                                        { column.dataField === "checkbox" ? <input type="checkbox"/> : ""}
                                        { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                      </Td>
                                    )}
                                  </Tr>
                                )}
                              </Tbody>
                            :
                            // if withdrawals is selected 
                            props.withdrawalsTotalDocs === 0 
                              ?
                              // if withdrawals is seleceted but no data to show
                              <Tbody>
                                {props.loading && <TableLoader colSpan={4} />}  
                                {!props.withdrawalLoading &&
                                  <>
                                    <Tr>
                                      <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                        <h3 className="fw-bolder text-center">No records</h3>
                                      </Td>
                                    </Tr>
                                  </>
                                }
                              </Tbody>
                              :
                              // if withdrawals is selected and there is data to show
                              <Tbody style = {{
                                fontSize: "12px",
                                textAlign: "center",
                                textTransform: "capitalize"
                              }}>
                                {props.loading && <TableLoader colSpan={4} />}
                                {(!props.loading && props.clientWithdrawals) && props.clientWithdrawals.map((row, rowIndex) =>
                                  <Tr key={rowIndex}>
                                    {columns.map((column, index) =>
                                      <Td key={`${rowIndex}-${index}`}>
                                        { column.dataField === "checkbox" ? <input type="checkbox"/> : ""}
                                        { column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                      </Td>
                                    )}
                                  </Tr>
                                )}
                              </Tbody>
                        }
                      </Table>
                      {/* if deposits is selected */}
                      {
                        (props.clientDeposits && selectedTransactionType === "Deposit") && 
                        <CustomPagination
                          {...props}
                          docs={props.clientDeposits}
                          setSizePerPage={setSizePerPage}
                          sizePerPage={sizePerPage}
                          onChange={loadClientTransactionsdetails}
                        />
                      }
                      {/* if withdrawals is selected */}
                      {
                        (props.clientWithdrawals && selectedTransactionType === "Withdrawal") && 
                        <CustomPagination
                          {...props}
                          docs={props.clientWithdrawals}
                          setSizePerPage={setSizePerPage}
                          sizePerPage={sizePerPage}
                          onChange={loadClientTransactionsdetails}
                        />
                      }
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
  depositLoading: state.depositReducer.loading,
  withdrawalLoading: state.withdrawalReducer.loading,
  error: state.clientReducer.error,
  clientDeposits: state.depositReducer.clientDeposits,
  clientWithdrawals: state.withdrawalReducer.clientWithdrawals,
  errorDetails: state.clientReducer.errorDetails,
  depositsTotalDocs: state.depositReducer.depositsTotalDocs,
  withdrawalsTotalDocs: state.withdrawalReducer.withdrawalsTotalDocs
});

export default connect(mapStateToProps, null)(withTranslation()(ClientTransactions));
