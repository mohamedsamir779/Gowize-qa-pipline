/* eslint-disable indent */
import React, { useEffect, useState } from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Dropdown,
} from "reactstrap";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import ClientAdd from "./ClientAdd";
import ClientFilter from "./ClientFilter";
import TodoAdd from "components/Common/TodoAdd";

import { fetchClientsStart } from "store/client/actions";
import "./ClientList.styles.scss";
import SearchBar from "components/Common/SearchBar";
import { Link, useLocation } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import AgentForm from "./AgentDropDown";
import formatDate from "helpers/formatDate";
import { getCustomerCategory } from "common/utils/getCustomerCategory";
import CallStatusDropdown from "components/Common/CallStatusDropdown";
import AddIb from "./AddIb";
import ToolTipData from "components/Common/ToolTipData";
import FeatherIcon from "feather-icons-react";

function ClientsList(props) {
  // get query paramerters from url
  const search = useLocation().search;
  const query = new URLSearchParams(search);

  const [addModal, setAddReminderToClientModal] = useState(false);
  const [type, setType] = useState(0);
  const [selectedClient, setSelectedClient] = useState({});
  const [assignedClients, setAssignedClients] = useState([]);

  const baseColumns = [
    {
      dataField: "checkbox",
      text: (
        <div className="d-flex align-items-center justify-content-center">
          {/* <i className="mdi mdi-circle font-size-11 me-2" style={{ color: "#c3c3c3" }}></i> */}
          <input
            type="checkbox"
            id="select-all-clients"
            onChange={(e) => {
              checkAllBoxes("select-all-clients", ".client-checkbox");
              setAssignedClients(() => {
                if (e.target.checked) {
                  return [...props.clients];
                } else if (!e.target.checked) {
                  return [];
                }
              });
            }}
          />
        </div>
      ),
      formatter: (val) => (
        <div className="d-flex align-items-center justify-content-center">
          {/* <i
          className="mdi mdi-circle font-size-11 me-2"
          style={{
            color: enableCallStatusColors && callStatusColors[val.callStatus] ? callStatusColors[val.callStatus] : "#f3f3f3",
          }}></i> */}
          <input
            type="checkbox"
            onChange={(e) =>
              setAssignedClients((preValue) => {
                if (e.target.checked) {
                  return [val, ...preValue];
                } else if (!e.target.checked) {
                  return preValue.filter((client) => client._id !== val._id);
                }
              })
            }
            className="client-checkbox"
          />
        </div>
      ),
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt, "DD/MM/YYYY"),
    },
    {
      dataField: "name",
      text: props.t("Name"),
      formatter: (client) => (
        <div>
          <Link
            to={{
              pathname: "/clients/" + client._id + "/profile",
              state: { clientId: client._id },
            }}
          >
            <strong className="text-capitalize">{`${client.firstName}  ${
              client.lastName ? client.lastName : ""
            }`}</strong>
          </Link>
        </div>
      ),
    },
    {
      dataField: "mt5",
      text: props.t("FX Account"),
      formatter: (val) => {
        if (val?.fx?.isIb) {
          if (val?.fx?.ibMT5Acc) return val.fx.ibMT5Acc[0];
          else if (val?.fx?.ibMT4Acc) return val.fx.ibMT4Acc[0];
          else if (val?.fx?.ibCTRADERAcc){
            const filtered =  val?.fx?.ibCTRADERAcc.find(arg => arg != null);
            return filtered;
          }
        }
        if (val?.fx?.liveAcc) {
          const filtered =  val?.fx?.liveAcc.find(arg => arg != null);
          return filtered;
        }
        else if (val?.fx?.demoAcc) {
          const filtered =  val?.fx?.demoAcc.find(arg => arg != null);
          return filtered;
        } //return val?.fx?.demoAcc.find(arg => arg != null);
      },
    },
    {
      dataField: "category",
      text: props.t("Type"),
      formatter: (val) => (val ? getCustomerCategory(val) : "-"),
    },
    {
      dataField: "Category",
      text: props.t("Category"),
      formatter: (val) => {
        let categories = [];
        if (val?.fx?.isClient) {
          val?.isCorporate
            ? categories.push("Corporate")
            : categories.push("Individual");
        }
        if (val?.fx?.isIb) {
          categories.push("ib");
        }
        return categories.toString();
      },
    },
    {
      dataField: "email",
      text: props.t("Email"),
      formatter: (val, index) => {
        return (
          <>
            <span id={`ClientEmailToolTip_${index}`}>{val.email}</span>
            <ToolTipData
              target={`ClientEmailToolTip_${index}`}
              placement="top"
              data={val.email}
            />
          </>
        );
      },
    },
    {
      dataField: "phone",
      text: props.t("Phone"),
      formatter: (val, index) => {
        if (!val.phone) return "-";
        return (
          <>
            <span id={`ClientPhoneToolTip_${index}`}>{val.phone}</span>
            <ToolTipData
              target={`ClientPhoneToolTip_${index}`}
              placement="top"
              data={val.phone}
            />
          </>
        );
      },
    },
    {
      dataField: "callStatus",
      text: props.t("Status"),
      formatter: (val) => {
        return <CallStatusDropdown client={val} />;
      },
    },
    {
      dataField: "country",
      text: props.t("Country"),
      formatter: (val, index) =>
        val && val.country ? (
          <>
            <span id={`ClientCountryToolTip_${index}`}>
              {captilazeFirstLetter(val.country)}
            </span>
            <ToolTipData
              target={`ClientCountryToolTip_${index}`}
              placement="top"
              data={captilazeFirstLetter(val.country)}
            />
          </>
        ) : (
          "-"
        ),
    },
    {
      dataField: "agent",
      isDummyField: true,
      editable: false,
      text: props.t("Agent"),
      formatter: (val) =>
        val && val.agent
          ? captilazeFirstLetter(`${val.agent.firstName} ${val.agent.lastName}`)
          : "Unassigned",
    },
    {
      dataField: "ib",
      text: props.t("IB"),
      formatter: (val) =>
        val?.parentId ? (
          <Link
            to={{
              pathname: "/clients/" + val.parentId._id + "/profile",
              state: { valId: val.parentId._id },
            }}
          >
            {captilazeFirstLetter(
              `${val.parentId.firstName} ${val.parentId.lastName}`
            )}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      dataField: "source",
      text: props.t("Source"),
      formatter: (val) =>
        val && val.source === "REGISTER_DEMO" ? "Register Demo" : val.source,
    },
    {
      dataField: "stages",
      text: props.t("KYC"),
      formatter: (val) => {
        if (val.stages) {
          const { kycUpload, kycApproved, kycRejected } = val.stages;
          if (!kycUpload) {
            return (
              <div>
                <span>No Documents</span>
              </div>
            );
          }
          if (kycUpload && !kycApproved && !kycRejected) {
            return (
              <div>
                <span>Pending Verification</span>
              </div>
            );
          }
          if (kycApproved) {
            return (
              <div>
                <span>Verified</span>
              </div>
            );
          }
          if (kycRejected) {
            return (
              <div>
                <span>Rejected</span>
              </div>
            );
          }
        }
      },
    },
    {
      dataField: "actions",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (client) => (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="i"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedClient(client);
            }}
          >
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem
              onClick={() => {
                setAddReminderToClientModal(true);
                setType(1);
              }}
            >
              {props.t("Add Reminder")}
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setAddReminderToClientModal(true);
                setType(0);
              }}
            >
              {props.t("Add Task")}
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setAddReminderToClientModal(true);
                setType(2);
              }}
            >
              {props.t("Add Note")}
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setAddReminderToClientModal(true);
                setType(3);
              }}
            >
              {props.t("Add Remark")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  const [sizePerPage, setSizePerPage] = useState(50);
  const [searchInputText, setSearchInputText] = useState("");

  const initFilteredValues = {
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    country: "",
    filterDate: {
      fromDate: query.get("fromDate") || "",
      toDate: "",
    },
    type: "",
    source: "",
    agent: "",
    kyc: query.get("kyc") || "",
    assigne: query.get("assigne") || "",
    callStatus: query.get("callStatus") || "",
    login: "",
    categories: "",
    parentId: "",
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const [headers, setHeaders] = useState(false);
  const [columns, setColumns] = useState([...baseColumns]);

  const handleSearchInput = (e) => setSearchInputText(e.target.value);
  const dispatch = useDispatch();

  useEffect(() => {
    loadClients(1, sizePerPage);
  }, [
    sizePerPage,
    1,
    searchInputText,
    filteredValues,
    props.assignAgent.success,
  ]);

  const loadClients = (page, limit) => {
    if (searchInputText !== "" && searchInputText.length >= 3) {
      const searchText = searchInputText.split("@").shift();
      dispatch(
        fetchClientsStart({
          limit,
          page,
          searchText,
          filteredValues: filteredValues,
        })
      );
    } else if (searchInputText === "") {
      dispatch(
        fetchClientsStart({
          limit,
          page,
          filteredValues: filteredValues,
        })
      );
    }
  };

  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <TodoAdd
            show={addModal}
            selectedClient={selectedClient}
            onClose={() => {
              setAddReminderToClientModal(false);
            }}
            hidenAddButton={true}
            type={type}
          />
          <h2>{props.t("Clients List")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex flex-row justify-content-between align-items-center">
                    <CardTitle className="color-primary">
                      <h5>{props.t("Client List")} ({props.totalDocs}) <FeatherIcon
                        icon="refresh-cw"
                        className="icon-lg ms-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => { loadClients(1, sizePerPage) }}
                      /></h5>
                      
                    </CardTitle>
                  </div>
                  <div className="d-flex flex-column flex-md-row gap-2 align-items-center justify-content-between">
                    <div className="d-flex flex-row align-items-center gap-2">
                      <SearchBar handleSearchInput={handleSearchInput} />
                      <ClientFilter
                        filterChangeHandler={filterChangeHandler}
                        filteredValues={filteredValues}
                      />
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-between gap-2">
                      {props.clientPermissions.create &&
                        assignedClients.length > 0 && (
                          <AgentForm clients={[...assignedClients]} />
                        )}
                      <AddIb />
                      <ClientAdd />
                      <Dropdown
                        color="primary"
                        isOpen={headers}
                        toggle={() => setHeaders(!headers)}
                      >
                        <DropdownToggle
                          caret
                          color="primary"
                          className="btn btn-primary"
                          size="md"
                        >
                          {props.t("Headers")}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem header>Header</DropdownItem>
                          {baseColumns
                            ?.filter((c) => !["checkbox"].includes(c.dataField))
                            .map((column, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() => {
                                  if (
                                    columns.find(
                                      (c) => c.dataField === column.dataField
                                    )
                                  ) {
                                    setColumns(
                                      columns.filter(
                                        (c) => c.dataField !== column.dataField
                                      )
                                    );
                                  } else {
                                    const index = baseColumns.findIndex(
                                      (c) => c.dataField === column.dataField
                                    );
                                    setColumns([
                                      ...columns.slice(0, index),
                                      column,
                                      ...columns.slice(index),
                                    ]);
                                  }
                                }}
                              >
                                {columns.find(
                                  (c) => c.dataField === column.dataField
                                ) ? (
                                  <i className="mdi mdi-check me-1" />
                                ) : (
                                  <i className="mdi mdi-close me-1" />
                                )}
                                {column.text}
                              </DropdownItem>
                            ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
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
                        className="table table-hover table-clients"
                      >
                        <Thead className="text-center table-light">
                          <Tr>
                            {columns.map((column, index) =>
                              <Th data-priority={index} key={index}>
                                <span className="color-primary">{column.text}</span>
                              </Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody
                          className="text-center"
                          style={{ fontSize: "13px" }}
                        >
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading &&
                            props.clients.map((row, rowIndex) => (
                              <Tr
                                key={rowIndex}
                                style={{ overflow: "visible" }}
                              >
                                {columns.map((column, index) => (
                                  <Td
                                    key={`${rowIndex}-${index}`}
                                    style={{
                                      overflow:
                                        column.dataField === "actions" &&
                                        "visible",
                                      maxWidth:
                                        column.dataField === "actions" &&
                                        "140px",
                                    }}
                                  >
                                    {column.formatter
                                      ? column.formatter(row, rowIndex)
                                      : row[column.dataField]}
                                  </Td>
                                ))}
                              </Tr>
                            ))}
                        </Tbody>
                      </Table>
                      <CustomPagination
                        {...props}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={loadClients}
                        docs={props.clients}
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
  loading: state.clientReducer.loading || false,
  clients: state.clientReducer.clients || [],
  page: state.clientReducer.page || 1,
  totalDocs: state.clientReducer.totalDocs || 0,
  totalPages: state.clientReducer.totalPages || 0,
  hasNextPage: state.clientReducer.hasNextPage,
  hasPrevPage: state.clientReducer.hasPrevPage,
  limit: state.clientReducer.limit,
  nextPage: state.clientReducer.nextPage,
  pagingCounter: state.clientReducer.pagingCounter,
  prevPage: state.clientReducer.prevPage,
  clientPermissions: state.Profile.clientPermissions || {},
  docs: state.usersReducer.docs || [],
  assignAgent: state.usersReducer.assignAgent,
});
export default connect(mapStateToProps, null)(withTranslation()(ClientsList));
