import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody,
  CardTitle, CardHeader
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { fetchLogs } from "store/actions";
import {
  LOG_LEVELS,
  LOG_TYPES,
} from "constants/logs";
import { getNoteType } from "common/utils/getNoteType";

const formatDate = (date) => {
  let d = new Date(date);
  return `${d.toLocaleDateString()}, ${d.toLocaleTimeString()}`;
};

function Activities(props) {
  //   const clientId = props.clientId;
  // const dispatch = useDispatch();
  const [sizePerPage, setSizePerPage] = useState(10);
  const generateLogs = (data) => {
    const {
      type,
      customerId = {},
      content = {},
      details = {}
    } = data;
    const { ip, error, to, } = details;
    const { firstName = "", lastName = "" } = customerId;
    let message = "";
    if (error) {
      message = error;
      return message;
    }
    const name = `${firstName} ${lastName}`;
    const {
      amount,
      currency,
      status,
      symbol,
      mPrice,
      fromAsset,
      toAsset,
      asset,
    } = content;
    switch (type) {
      case LOG_TYPES.REGISTER:
        message = `${name} ${props.t("has registered from")} ${content?.source} ${props.t("from IP")} ${ip}`;
        break;
      case LOG_TYPES.LOGIN:
        message = `${name} ${props.t("has logged in from")} ${ip}`;
        break;
      case LOG_TYPES.UPDATE_PROFILE:
        message = `${name} ${props.t("has updated their profile")}`;
        break;
      case LOG_TYPES.AVATAR_UPDATED:
        message = `${name} ${props.t("has updated their avatar image")}`;
        break;
      case LOG_TYPES.CONVERT_CUSTOMER:
        message = `${name} ${props.t("has been converted to")} ${props.t(to)}`;
        break;
      case LOG_TYPES.RESET_PASSWORD:
        message = `${name} ${props.t("has changed password from IP")} ${ip}`;
        break;
      case LOG_TYPES.DEPOSIT:
        message = `${name} ${props.t("has made a deposit of")} ${amount.$numberDecimal || amount} ${currency} ${props.t("and it is")} ${status}`;
        break;
      case LOG_TYPES.WITHDRAW:
        message = `${name} ${props.t("has made a withdrawal of")} ${amount.$numberDecimal || amount} ${currency} ${props.t("and it is")} ${status}`;
        break;
      case LOG_TYPES.ORDER:
        message = `${name} ${props.t("has placed an order of")} ${amount} ${symbol} ${props.t("for price")} ${mPrice} ${props.t("and it is")} ${status}`;
        break;
      case LOG_TYPES.CONVERT:
        message = `${name} ${props.t("has converted")} ${amount} ${fromAsset} ${props.t("to")} ${toAsset}`;
        break;
      case LOG_TYPES.WALLET:
        message = `${props.t("Creation of wallet was successful")} (${asset})`;
        break;
      // bank accs
      case LOG_TYPES.ADD_BANK_ACCOUNT:
        message = `${props.t(`New ${content?.bankName} bank account added`)}`;
        break;
      case LOG_TYPES.EDIT_BANK_ACCOUNT:
        message = `${props.t(`${content?.bankName} bank info changed`)}`;
        break;
      case LOG_TYPES.DELETE_BANK_ACCOUNT:
        message = `${props.t("A bank account has been deleted")}`;
        break;
      //docs
      case LOG_TYPES.CHANGE_DOC_STATUS:
        message = `${props.t(`${details?.type} document has been ${details?.status} ${details?.rejectionReason ? `, reason is ${details?.rejectionReason}` : ""}`)}`;
        break;
      case LOG_TYPES.OVERWRITE_DOCS:
        message = `${props.t("Document(s) has been overwritten")}`;
        break;
      case LOG_TYPES.UPLOAD_DOCS:
        message = `${content?.type} ${props.t("document(s) has been uploaded")}`;
        break;
      // todos
      case LOG_TYPES.ADD_TODO:
      case LOG_TYPES.EDIT_TODO:
      case LOG_TYPES.DELETE_TODO:
        content.type = getNoteType(content?.type);
        if (type === LOG_TYPES.ADD_TODO) {
          message = props.t(`Added new ${content?.type} (${content?.id})`);
        } else if (type === LOG_TYPES.EDIT_TODO) {
          message = props.t(`Edited ${content?.type} (${content?.id})`);
        } else if (type === LOG_TYPES.DELETE_TODO) {
          message = props.t(`Deleted ${content?.type} (${content?.id})`);
        }
        break;
      // customer
      case LOG_TYPES.EDIT_CUSTOMER_INFO:
        message = `${props.t("Profile information has been updated")}`;
        break;
      case LOG_TYPES.PROFILE_COMPLETED:
        message = `${props.t("Customer has completed his profile")}`;
        break;
      // 2fa
      case LOG_TYPES.ENABLE_2FA:
        message = props.t("Activated two factor authentication");
        break;
      case LOG_TYPES.DISABLE_2FA:
        message = props.t("Disabled two factor authentication");
        break;
      case LOG_TYPES.IB_REQUEST:
        message = props.t("Requisted Partnership");
        break;
      case LOG_TYPES.UPDATE_IB_REQUEST:
        message = props.t(`Partnership request has been ${status}`);
        break;
      case LOG_TYPES.CREATE_ACCOUNT_REQUEST:
        message = props.t(`Requested trading account. request id ${content?.requestId}`);
        break;
      case LOG_TYPES.UPDATE_ACCOUNT_REQUEST:
        message = props.t(`Trading account request has been ${status}`);
        break;
      case LOG_TYPES.LEVERAGE_REQUEST:
        message = props.t(`Requested to change the leverage from ${content?.from} to ${content?.to} on ${content?.login}. request Id ${content?.requestId}`);
        break;
      case LOG_TYPES.UPDATE_LEVERAGE_REQUEST:
        message = props.t(`Change leverage request from ${content?.from} to ${content?.to} on ${content?.login} has been ${status}`);
        break;
      case LOG_TYPES.ACCOUNT_CREATED:
        message = props.t(`Created a new trading account ${content?.login} (${content?.platform})`);
        break;
      // transactions
      case LOG_TYPES.FX_DEPOSIT:
        message = props.t(`Pending ${content?.gateway} deposit of amount ${content?.amount} to account ${content?.login} (${content?.platform})`);
        break;
      case LOG_TYPES.FX_DEPOSIT_UPDATE:
        message = props.t(`${content?.gateway} Deposit of amount ${content?.amount} to account ${content?.login} (${content?.platform}) is ${content?.status}`);
        break;
      case LOG_TYPES.FX_WITHDRAW:
        message = props.t(`Pending ${content?.gateway} withdraw of amount ${content?.amount} to account ${content?.login} (${content?.platform})`);
        break;
      case LOG_TYPES.FX_WITHDRAW_UPDATE:
        message = props.t(`${content?.gateway} withdraw of amount ${content?.amount} to account ${content?.login} (${content?.platform}) is ${content?.status}`);
        break;
      case LOG_TYPES.FX_INTERNAL_TRANSFER:
        message = props.t(`Pending internal transfer of amount ${content?.amount} from ${content?.from} to ${content?.to}`);
        break;
      case LOG_TYPES.FX_INTERNAL_TRANSFER_UPDATE:
        message = props.t(`Internal transfer of amount ${content?.amount} from ${content?.from} to ${content?.to} is ${content?.status}`);
        break;
      case LOG_TYPES.FX_CREDIT_UPDATE:
        message = props.t(`${content?.type === "CREDIT_IN" ? `Credited ${content?.amount} to` : `Debited ${-content?.amount} from`} account ${content?.login}`);
        break;
      case LOG_TYPES.FX_DEPOSIT_AUTO:
        message = props.t(`Recieved a ${content?.gateway} deposit of amount ${content?.amount} to account ${content?.login} (${content?.platform})`);
        break;
      case LOG_TYPES.FX_WITHDRAW_AUTO:
        message = props.t(`Withdrawn an amount of ${content?.amount} to account ${content?.login} (${content?.platform}) via ${content?.gateway}`);
        break;
      case LOG_TYPES.FX_INTERNAL_TRANSFER_AUTO:
        message = props.t(`Internally transfered an amount of ${content?.amount} from ${content?.from} to ${content?.to}`);
        break;
      case LOG_TYPES.ASSIGN_AGENT:
        message = props.t(`Assigned agent (${content?.agent}) to client`);
        break;
      case LOG_TYPES.CHANGE_CALL_STATUS:
        message = props.t(`Call Status changed from (${content?.oldCallStatus ?? "Nothing"}) to (${content?.newCallStatus})`);
        break;
      case LOG_TYPES.CAMPAIGN_UNSUBSCRIBE:
        message = props.t("Client unsubscribed from email campaigns");
        break;
      case LOG_TYPES.CREATE_MASTER_AGREEMENT:
        message = props.t(`Created a new master agreement (${content?.title})`);
        break;
      case LOG_TYPES.UPDATE_MASTER_AGREEMENT:
        message = props.t(`Updated master agreement (${content?.title})`);
        break;
      case LOG_TYPES.DELETE_AGREEMENT:
        message = props.t(`Deleted agreement (${content?.title})`);
        break;
      case LOG_TYPES.CREATE_SHARED_AGREEMENT:
        message = props.t(`Created a new shared agreement (${content?.title})`);
        break;
      case LOG_TYPES.UPDATE_SHARED_AGREEMENT:
        message = props.t(`Updated shared agreement (${content?.title})`);
        break;
      case LOG_TYPES.LINK_IB:
        message = props.t(`Linked IB (${content?.parentName}) to client (${content?.clientName})`);
        break;  
      case LOG_TYPES.UNLINK_IB:
        message = props.t(`Unlinked IB (${content?.parentName}) from client (${content?.clientName})`);
        break;
    }
    return message;
  };

  const getTriggeredBy = (val) => {
    let message = "";
    if (val.triggeredBy === 0) {
      const {
        firstName = "",
        lastName = "",
      } = val.customerId;
      message = `${firstName} ${lastName}`;
    } else if (val.triggeredBy === 1) {
      const {
        firstName = "",
        lastName = "",
      } = (val?.userId || {});
      message = `${firstName} ${lastName}`;
    } else {
      message = "System";
    }
    return message;
  };

  const columns = [
    {
      dataField: "recordId",
      text: props.t("ID")
    },
    {
      dataField: "triggeredBy",
      text: props.t("Triggered By"),
      formatter: (val) => getTriggeredBy(val),
    },
    {
      dataField: "level",
      text: props.t("Log Level"),
      formatter: (val) => (LOG_LEVELS[val.level] ? LOG_LEVELS[val.level] : "Err"),
    },
    {
      dataField: "type",
      text: props.t("Log Type"),
      formatter: (val) => (LOG_TYPES[val.type] ? LOG_TYPES[val.type] : "Err"),
    },
    {
      dataField: "createdAt",
      text: props.t("Date Created"),
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      dataField: "content",
      text: props.t("Message"),
      formatter: (val) => (generateLogs(val))
    },
  ];

  const dispatch = useDispatch();
  const fetchData = async (page) => {
    dispatch(fetchLogs({
      page: page || 1,
      limit: sizePerPage,
      customerId: props.clientId,
    }));
  };

  useEffect(() => {
    fetchData(1);
  }, [sizePerPage, 1]);

  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between  align-items-center">
                  <CardTitle className="color-primary">
                    {props.t("Activities")}
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
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.todos.length === 0 &&
                            <>
                              <Tr>
                                <Td colSpan={"100%"} className="fw-bolder text-center" st="true">
                                  <h3 className="fw-bolder text-center">No records</h3>
                                </Td>
                              </Tr>
                            </>
                          }
                          {!props.loading && props.todos.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className="text-center">
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>

                      </Table>
                      <CustomPagination
                        {...props.pagination}
                        docs={props.todos}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={fetchData}
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
  clientDetails: state.clientReducer.clientDetails || {},
  todos: state.logsReducer.logs && state.logsReducer.logs.docs || [],
  pagination: state.logsReducer.logs || {},
  loading: state.logsReducer.loading,
  selectedClient: state.clientReducer.clientDetails || {},
});

export default connect(mapStateToProps, null)(withTranslation()(Activities));
