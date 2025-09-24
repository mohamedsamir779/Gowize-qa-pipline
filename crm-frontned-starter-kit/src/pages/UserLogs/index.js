import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
import moment from "moment-timezone";
import {
  Row, Col, Card, CardBody,
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { fetchUserLogs } from "store/actions";
import { LOG_LEVELS, LOG_TYPES } from "constants/logs";
import { MetaTags } from "react-meta-tags";
import { getNoteType } from "common/utils/getNoteType";
import { startCase } from "lodash";

const formatDate = (date, format = "DD/MM/YYYY, hh:mm A") => {
  let d = new Date(date);
  return `${moment(d).format(format)}`;
};

function Activities(props) {
  const [sizePerPage, setSizePerPage] = useState(10);
  const generateLogs = (data) => {
    const {
      type,
      content = {},
      details = {}
    } = data;
    const { error } = details;
    let message = "";
    if (error) {
      message = error;
      return message;
    }
    // destruct log content here
    //   const {
    // } = content;
    switch (type) {
      case LOG_TYPES.UPDATE_LEAD_STAGE:
        message = `${props.t("Lead stage updated from")} ${props.t(`${startCase(content.oldStage)}`)} ${props.t("to")} ${props.t(`${startCase(content.newStage)}`)}`;
        break;
      case LOG_TYPES.CREATE_USER:
        message = props.t(`New user (${content.email}) created`);
        break;
      case LOG_TYPES.UPDATE_USER:
        message = props.t(`User (${details.previousData.email}) updated`);
        break;
      case LOG_TYPES.DELETE_USER:
        message = props.t(`User (${content.deletedUserEmail}) deleted`);
        break;
      case LOG_TYPES.CREATE_TEAM:
        message = props.t(`New team (${content.title}) created`);
        break;
      case LOG_TYPES.UPDATE_TEAM:
        message = props.t(`Team (${details.newData.title}) updated`);
        break;
      case LOG_TYPES.ADD_TEAM_MEMBER:
        message = props.t(`New team member (${content?.member?.email}) added to ${content?.team}`);
        break;
      case LOG_TYPES.DELETE_TEAM_MEMBER:
        message = props.t(`Team member (${content.member}) deleted from ${content.team}`);
        break;
      case LOG_TYPES.ROLES:
        message = props.t(`New role (${content.title}) created`);
        break;
      case LOG_TYPES.UPDATE_ROLE:
        message = props.t(`Role (${details.newData.title}) updated`);
        break;
      case LOG_TYPES.DELETE_ROLE:
        message = props.t(`Role (${content.deletedRole}) deleted`);
        break;
      case LOG_TYPES.CREATE_LEAD:
        message = props.t(`Lead (${content.lead}) added`);
        break;
      case LOG_TYPES.ASSIGN_AGENT:
        message = props.t(`Assigned agent (${content.agent}) to client (${content.name})`);
        break;
      case LOG_TYPES.CHANGE_CALL_STATUS:
        message = props.t(`Call Status changed from (${content.oldCallStatus ?? "Nothing"}) to (${content.newCallStatus}) for client (${content.name})`);
        break;
      case LOG_TYPES.ENABLE_2FA:
        message = props.t(`User (${content.name}) activated two factor authentication.`);
        break;
      case LOG_TYPES.DISABLE_2FA:
        message = props.t(`User (${content.name}) disabled two factor authentication.`);
        break;
      case LOG_TYPES.ADD_TODO:
      case LOG_TYPES.EDIT_TODO:
      case LOG_TYPES.DELETE_TODO:
        content.type = getNoteType(content.type);
        if (type === LOG_TYPES.ADD_TODO) {
          message = props.t(`Added new ${content.type} (${content.id}) for client ${content.customerName}`);
        } else if (type === LOG_TYPES.EDIT_TODO) {
          message = props.t(`Edited ${content.type} (${content.id}) for client ${content.customerName}`);
        } else if (type === LOG_TYPES.DELETE_TODO) {
          message = props.t(`Deleted ${content.type} (${content.id}) for client ${content.customerName}`);
        }
        break;
      case LOG_TYPES.ADD_CAMPAIGN_TEMPLATE:
        message = props.t(`New campaign template (${content.title}) created`);
        break;
      case LOG_TYPES.EDIT_CAMPAIGN_TEMPLATE:
        message = props.t(`Campaign template (${content.newData.title}) updated`);
        break;
      case LOG_TYPES.DELETE_CAMPAIGN_TEMPLATE:
        message = props.t(`Campaign tmeplate (${content.title}) deleted`);
        break;
      case LOG_TYPES.ADD_CAMPAIGN:
        message = props.t(`New campaign (${content.name}) scheduled on ` + formatDate(content.scheduleDate, "DD/MM/YYYY, hh;mm A"));
        break;
      case LOG_TYPES.EDIT_CAMPAIGN:
        message = props.t(`Campaign (${content.newData.name}) updated`);
        break;
      case LOG_TYPES.DELETE_CAMPAIGN:
        message = props.t(`Campaign (${content.name}) deleted`);
        break;
      case LOG_TYPES.RUN_CAMPAIGN:
        message = props.t(`Campaign (${content.name}) has run successully`);
        break;
    }

    return message;
  };

  const getTriggeredBy = (val) => {
    let name = "";
    if (val.userLog && val.userId) {
      const {
        firstName,
        lastName,
      } = val.userId;
      name = `${firstName} ${lastName}`;
    } else {
      name = "System";
    }
    return name;
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
    dispatch(fetchUserLogs({
      page: page || 1,
      limit: sizePerPage,
      userLog: true
    }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [sizePerPage, 1]);

  return (
    <React.Fragment>
      <MetaTags>
        <title>
          {props.t("User Logs")}
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <h2>{props.t("User Logs")}</h2>
              <Card>
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
