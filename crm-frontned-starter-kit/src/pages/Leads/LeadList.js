import React, { useEffect, useState } from "react";
import {
  useDispatch, useSelector, connect
} from "react-redux";
import {
  Row, Col, Card, CardBody, CardTitle, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Link, useLocation } from "react-router-dom";

import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import "./LeadList.scss";
import { fetchLeadsStart } from "../../store/leads/actions";
import LeadForm from "pages/Leads/LeadAdd";
import AgentForm from "../Clients/AgentDropDown";
import SearchBar from "components/Common/SearchBar";
import { withTranslation } from "react-i18next";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { MetaTags } from "react-meta-tags";
import LeadFilter from "./LeadFilter";
import formatDate from "helpers/formatDate";
import TodoAdd from "components/Common/TodoAdd";
import CallStatusDropdown from "components/Common/CallStatusDropdown";
import ToolTipData from "components/Common/ToolTipData";
import ImportExcel from "./ImportExcel";
function LeadsList(props) {

  // get query paramerters from url
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const location = useLocation();

  const [assignedLeads, setAssignedLeads] = useState([]);

  const columns = [
    {
      dataField: "checkbox",
      text: <div className="d-flex align-items-center justify-content-center">
        {/* <i className="mdi mdi-circle font-size-11 me-2" style={{ color: "#c3c3c3" }}></i> */}
        <input type="checkbox" className="" id="select-all-leads-checkbox" onChange={(e) => {
          checkAllBoxes("select-all-leads-checkbox", ".leads-checkbox");
          setAssignedLeads(() => {
            if (e.target.checked) {
              return [...props.leads];
            }
            else if (!e.target.checked) {
              return [];
            }
          });
        }} />
      </div>,
      formatter: (val) => <div className="d-flex align-items-center justify-content-center">
        {/* <i
          className="mdi mdi-circle font-size-11 me-2"
          style={{
            color: enableCallStatusColors && callStatusColors[val.callStatus] ? callStatusColors[val.callStatus] : "#f3f3f3",
          }}></i> */}
        <input type="checkbox" onChange={(e) => setAssignedLeads(preValue => {
          if (e.target.checked) {
            return [val, ...preValue];
          }
          else if (!e.target.checked) {
            return preValue.filter(lead => lead._id !== val._id);
          }
        })} className="leads-checkbox" />
      </div>,
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt, "DD/MM/YYYY")
    },
    {
      dataField: "name",
      text: props.t("Name"),
      formatter: (client) => (
        <div>
          <Link
            to={{
              pathname: "/clients/" + client._id + "/profile",
              state: { clientId: client._id }
            }}
          >
            <strong className="text-capitalize">{client.firstName + " " + client.lastName}</strong>
          </Link>
        </div>
      )
    },
    {
      dataField: "mt5",
      text: props.t("MT5"),
      formatter: (val) => (val?.fx?.demoAcc ?? "-"),

    },
    {
      dataField: "email",
      text: props.t("Email"),
      formatter: (val, index) => {
        return <>
          <span id={`LeadEmailToolTip_${index}`}>{val.email}</span>
          <ToolTipData
            target={`LeadEmailToolTip_${index}`}
            placement="top"
            data={val.email}
          />
        </>;
      }
    },
    {
      dataField: "phone",
      text: props.t("Phone"),
    },
    {
      dataField: "callStatus",
      text: props.t("Status"),
      formatter: (val) => {
        return (
          <CallStatusDropdown
            client={val}
          />
        );
      }
    },
    {
      dataField: "country",
      text: props.t("Country"),
      formatter: (val) => (captilazeFirstLetter(val.country))
    },
    {
      dataField: "ib",
      text: props.t("IB"),
      formatter: (val) => (val?.parentId ?
        <Link to={{
          pathname: "/clients/" + val.parentId._id + "/profile",
          state: { valId: val.parentId._id }
        }}
        >
          {captilazeFirstLetter(`${val.parentId.firstName} ${val.parentId.lastName}`)}
        </Link>
        : "-"),
    },
    {
      dataField: "agent",
      text: props.t("Agent"),
      formatter: (val) => (val.agent ? captilazeFirstLetter(`${val.agent.firstName} ${val.agent.lastName}`) : "-"),
    },
    {
      dataField: "source",
      text: props.t("Source"),
    },
    {
      dataField: "actions",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
      formatter: (client) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="i" style={{ cursor: "pointer" }} onClick={() => { setSelectedClient(client) }}>
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem onClick={() => { setAddReminderToClientModal(true); setType(1) }} >{props.t("Add Reminder")}</DropdownItem>
            <DropdownItem onClick={() => { setAddReminderToClientModal(true); setType(0) }} >{props.t("Add Task")}</DropdownItem>
            <DropdownItem onClick={() => { setAddReminderToClientModal(true); setType(2) }} >{props.t("Add Note")}</DropdownItem>
            <DropdownItem onClick={() => { setAddReminderToClientModal(true); setType(3) }} >{props.t("Add Remark")}</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },

  ];
  const page = JSON.parse(localStorage.getItem(location.pathname))?.page || 1;

  const { totalDocs } = useSelector(state => state.leadReducer);
  const [sizePerPage, setSizePerPage] = useState(
    JSON.parse(localStorage.getItem(location.pathname))?.sizePerPage || 10
  );
  const [selectedClient, setSelectedClient] = useState({});
  const [searchInputText, setSearchInputText] = useState("");
  const [addModal, setAddReminderToClientModal] = useState(false);
  const [type, setType] = useState(0);
  const dispatch = useDispatch();

  const initFilteredValues = {
    agent: "",
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    country: "",
    filterDate: {
      fromDate: query.get("fromDate") || "",
      toDate: ""
    },
    type: "",
    source: "",
    assigne: query.get("assigne") || "",
    callStatus: query.get("callStatus") || "",
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };

  useEffect(() => {
    loadLeads(page, sizePerPage);
    setAssignedLeads([]);
  }, [searchInputText, filteredValues, props.assignAgent.success, props.addClearingCounter]);

  useEffect(() => {
    localStorage.setItem(location.pathname, JSON.stringify({
      sizePerPage: sizePerPage,
    }));
    loadLeads(page, sizePerPage);
  }, [sizePerPage]);

  const loadLeads = (page, limit) => {
    if (searchInputText !== "" && searchInputText.length >= 3) {
      dispatch(fetchLeadsStart({
        limit,
        page,
        searchText: searchInputText,
        filteredValues: filteredValues
      }));
    }
    else if (searchInputText === "") {
      dispatch(fetchLeadsStart({
        limit,
        page,
        filteredValues: filteredValues
      }));
    }
  };

  const handleSearchInput = (e) => (setSearchInputText(e.target.value));

  return (
    <React.Fragment>
      <TodoAdd
        show={addModal}
        selectedClient={selectedClient}
        onClose={() => { setAddReminderToClientModal(false) }}
        hidenAddButton={true}
        type={type}
      />

      <MetaTags>
        <title>
          Leads
        </title>
      </MetaTags>
      <div className="page-content">
        <div className="container-fluid">
          <h2 >{props.t("Leads List")}</h2>
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex flex-column gap-3">
                  <div className="d-flex justify-content-between  align-items-center">
                    <CardTitle className="color-primary">{props.t("Leads List")} ({totalDocs})</CardTitle>
                  </div>
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <div className="d-flex flex-row align-items-center">
                      <SearchBar handleSearchInput={handleSearchInput} />
                      <LeadFilter filterChangeHandler={filterChangeHandler} filteredValues={filteredValues} />
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-between">
                      <div className="px-2">
                        {props?.leadsPermissions?.create && <ImportExcel />}
                      </div>
                      <div className="px-2">
                        {assignedLeads.length > 0 && <AgentForm clients={[...assignedLeads]} />}
                      </div>
                      {props?.leadsPermissions?.create && <LeadForm />}
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
                        <Tbody className="text-center" style={{ fontSize: "13px" }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.leads.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`}
                                  style={{
                                    overflow: column.dataField === "actions" && "visible",
                                    maxWidth: column.dataField === "actions" && "140px"
                                  }}>
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
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
                        onChange={loadLeads}
                        docs={props.leads}
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
  loading: state.leadReducer.loading || false,
  leads: state.leadReducer.leads || [],
  page: state.leadReducer.page || 1,
  totalDocs: state.leadReducer.totalDocs || 0,
  totalPages: state.leadReducer.totalPages || 0,
  hasNextPage: state.leadReducer.hasNextPage,
  hasPrevPage: state.leadReducer.hasPrevPage,
  limit: state.leadReducer.limit,
  nextPage: state.leadReducer.nextPage,
  pagingCounter: state.leadReducer.pagingCounter,
  prevPage: state.leadReducer.prevPage,
  assignAgent: state.usersReducer.assignAgent,
  leadsPermissions: state.Profile.leadsPermissions || {},
  addClearingCounter: state.leadReducer.addClearingCounter || 0,
});

export default connect(mapStateToProps, null)(withTranslation()(LeadsList));
