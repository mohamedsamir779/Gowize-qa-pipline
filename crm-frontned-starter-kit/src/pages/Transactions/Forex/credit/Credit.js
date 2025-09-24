import React, {
  useState, useEffect
} from "react";
import { useDispatch, connect } from "react-redux";
import {
  Row, Col, Card, CardBody, CardHeader, CardTitle, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledDropdown
} from "reactstrap";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
import {
  Table, Thead, Tbody, Tr, Th, Td
} from "react-super-responsive-table";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link, useLocation } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import { fetchCredits } from "store/forexTransactions/credit/actions";
import AddCreditModal from "./AddCreditModal";
import Badge from "components/Common/Badge";
import Filter from "./Filter";
import formatDate from "helpers/formatDate";
import FeatherIcon from "feather-icons-react";

function Credit(props) {
  // get query paramerters from url
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
      text: <input type="checkbox" id="check-all-deposits" onChange={() => checkAllBoxes("check-all-deposits", ".deposit-checkbox")} />
    },
    
    {
      dataField: "recordId",
      text: props.t("Credit Id")
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => formatDate(val.createdAt)
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
      formatter: (item) => {
        if (item.amount < 0) {
          return (
            parseFloat(-1 * (item?.amount?.$numberDecimal)) || parseFloat(-1 * (item?.amount)) || "-"
          );
        } else {
          return (
            parseFloat(item?.amount?.$numberDecimal) || parseFloat(item?.amount) || "-"
          );
        }
      }
    },
    {
      dataField: "type",
      text: props.t("Credit Type"),
      formatter: (item) => (
        item.amount < 0
          ?
          "Credit out"
          :
          "Credit in"
      )
    },
    {
      dataField: "login",
      text: props.t("Trading Account"),
      formatter: (val) => val?.tradingAccountId?.login
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
                state: { clientId: val.customerId }
              }}>
              <span className="no-italics" style={{ fontWeight: "bold" }}>{val.customerId ? `${captilazeFirstLetter(val.customerId.firstName)} ${captilazeFirstLetter(val.customerId.lastName)}` : ""}</span>
            </Link>
          </div>
        );
      }
    },
    {
      dataField: "currency",
      text: props.t("Currency"),

    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => (
        <Badge status={val.status}></Badge>
      )
    },
    {
      dataField: "note",
      text: props.t("Note")
    },
    {
      dataField: "dropdown",
      text: props.t("Actions"),
      formatter: (val) => (
        <UncontrolledDropdown disabled={val?.status === "APPROVED"}>
          <DropdownToggle tag="i" className={` ${val?.status === "APPROVED" ? "text-muted" : ""} `} style={{ cursor: "pointer" }}>
            <i className="mdi mdi-dots-horizontal font-size-18" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem onClick={() => { }} href="#">{props.t("Approve")}</DropdownItem>
            <DropdownItem onClick={() => { }} href="#">{props.t("Reject")}</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      )
    }
  ];

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const initFilteredValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: ""
    },
    status: query.get("status") || "",
    currency: "",
    creditType: "",
    amount: "",
    agent: ""
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };
  const loadCredits = (page, limit) => {
    if (searchInput && searchInput.length > 3) {
      dispatch(fetchCredits({
        limit,
        page,
        filteredValues,
        searchText: searchInput
      }));
    } else {
      dispatch(fetchCredits({
        limit,
        page,
        filteredValues
      }));
    }
  };

  const closeNotifaction = () => {
    setShowNotifaction(false);
  };

  useEffect(() => {
    loadCredits(1, sizePerPage);
  }, [props.addCreditSuccess, sizePerPage, 1, searchInput, filteredValues, selectedFilter, props.depositResponseMessage]);

  return (
    <React.Fragment>
      <Notification
        onClose={closeNotifaction}
        body={props.t("Credit has been updated successfully")}
        show={showNotication}
        header={props.t("Credit Update")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">

                <CardTitle className="color-primary">{props.t(`Credits(${props.totalDocs})`)}
                  <FeatherIcon
                    icon="refresh-cw"
                    className="icon-lg ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => { loadCredits(1, sizePerPage) }}
                  />
                </CardTitle>
              </div>
              <div className="d-flex flex-row align-items-center justify-content-between">
                <div className="d-flex flex-row align-items-center">
                  <SearchBar handleSearchInput={handleSearchInput} placeholder={props.t("Search for credits")} />
                  <Filter filterChangeHandler={filterChangeHandler} filteredValues={filteredValues} />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <AddCreditModal />

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
                    className="table  table-hover "
                  >
                    <Thead className="text-center table-light" >
                      <Tr>
                        {columns.map((column, index) =>
                          <Th data-priority={index} key={index}><span className="color-primary">{column.text}</span></Th>
                        )}
                      </Tr>
                    </Thead>
                    {
                      props.totalDocs === 0
                        ?
                        <Tbody>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading &&
                            <>
                              <Tr>
                                <Td colSpan={"100%"} className="fw-bolder text-center" st>
                                  <h3 className="fw-bolder text-center">No records</h3>
                                </Td>
                              </Tr>
                            </>
                          }
                        </Tbody >
                        :
                        <Tbody style={{
                          fontSize: "12px",
                          textAlign: "center",
                          textTransform: "capitalize"
                        }}>
                          {props.loading && <TableLoader colSpan={4} />}
                          {!props.loading && props.credits.map((row, rowIndex) =>
                            <Tr key={rowIndex}>
                              {columns.map((column, index) =>
                                <Td key={`${rowIndex}-${index}`} className="pt-4">
                                  {column.dataField === "checkbox" ? <input className="deposit-checkbox" type="checkbox" /> : ""}
                                  {column.formatter ? column.formatter(row, rowIndex) : row[column.dataField]}
                                </Td>
                              )}
                            </Tr>
                          )}
                        </Tbody>
                    }
                  </Table>
                  <CustomPagination
                    {...props}
                    setSizePerPage={setSizePerPage}
                    sizePerPage={sizePerPage}
                    onChange={loadCredits}
                    docs={props.credits}
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
  loading: state.creditReducer.loading || false,
  credits: state.creditReducer.credits || [],
  page: state.creditReducer.page || 1,
  totalDocs: state.creditReducer.creditsTotalDocs || 0,
  totalPages: state.creditReducer.totalPages || 0,
  hasNextPage: state.creditReducer.hasNextPage,
  hasPrevPage: state.creditReducer.hasPrevPage,
  limit: state.creditReducer.limit,
  nextPage: state.creditReducer.nextPage,
  pagingCounter: state.creditReducer.pagingCounter,
  prevPage: state.creditReducer.prevPage,
  depositsPermissions: state.Profile.depositsPermissions || {},
  depositResponseMessage: state.creditReducer.depositResponseMessage,
  tradingAccounts: state.tradingAccountReducer.tradingAccounts,
  addCreditSuccess: state.creditReducer.addCreditSuccess,
  creditPermissions: state.Profile.creditPermissions
});
export default connect(mapStateToProps, null)(withTranslation()(Credit));