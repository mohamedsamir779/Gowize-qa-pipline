/* eslint-disable indent */
import React, { useState, useEffect } from "react";
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
} from "reactstrap";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import FeatherIcon from "feather-icons-react";
// import { Link } from "react-router-dom";

// i18n
import { withTranslation } from "react-i18next";
import CustomPagination from "components/Common/CustomPagination";
import TableLoader from "components/Common/TableLoader";
import { fetchTradingAccounts } from "store/actions";
import CreateTradingAccount from "components/Common/CreateTradingAccount";
import { useParams } from "react-router-dom";
import formatDate from "helpers/formatDate";
// import DeleteModal from "components/Common/DeleteModal";
import ChangeAccess from "../Profile/QuickActions/tradingAccounts/ChangeAccess";
import LinkMT5 from "../Profile/QuickActions/tradingAccounts/LinkMT5";
import ChangePassword from "../Profile/QuickActions/tradingAccounts/ChangePassword";
import ChangeType from "../Profile/QuickActions/tradingAccounts/ChangeType";
import ChangeLeverage from "../Profile/QuickActions/tradingAccounts/ChangeLeverage";
import useModal from "hooks/useModal";
import Positions from "./Positions";

function Accounts(props) {
  const [sizePerPage, setSizePerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const { clientId } = useParams();

  const [showAccessModal, setShowAccessModal] = useModal();
  const [showLinkModal, setShowLinkModal] = useModal();
  const [showPassModal, setShowPassModal] = useModal();
  const [showTypeModal, setShowTypeModal] = useModal();
  const [showLeverageModal, setShowLeverageModal] = useModal();

  const columns = [
    {
      dataField: "login",
      text: props.t("Login"),
      formatter: (val) => (
        <a
          className="fw-bold"
          style={{ cursor: "pointer" }}
          onClick={() => setAccountId(val._id)}
        >
          {val?.login || ""}
        </a>
      ),
    },
    {
      dataField: "accountTypeId",
      text: props.t("Account Type"),
      formatter: (val) => val?.accountTypeId?.title ?? val.title ?? "",
    },
    {
      dataField: "accountTypeId",
      text: props.t("Platform"),
      formatter: (val) => val?.accountTypeId?.platform ?? val.platform ?? "",
    },
    {
      dataField: "accountTypeId",
      text: props.t("Type"),
      formatter: (val) => val?.accountTypeId?.type ?? val.type ?? "",
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
    },
    {
      dataField: "MarginLeverage",
      text: props.t("Leverage"),
      formatter:(val)=> "1/" + val?.leverageInCents ?? ""
    },
    {
      dataField: "Balance",
      text: props.t("Balance"),
      formatter: (val) => {return val?.balance ??  ""}
    },
    {
      dataField: "Credit",
      text: props.t("Credit"),
      formatter: (val) => {return val?.bonus ??  ""}
    },
    {
      dataField: "Equity",
      text: props.t("Equity"),
      formatter: (val) => {return val?.equity ??  "0.00"}
    },
    {
      dataField: "Margin",
      text: props.t("Margin"),
      formatter: (val) => {return val?.usedMargin ??  "0.00"}
    },
    // {
    //   dataField: "MarginLevel",
    //   text: props.t("Margin Level"),
    // },
    {
      dataField: "MarginFree",
      text: props.t("Margin Free"),
      formatter: (val) => {return val?.freeMargin ??  "0.00"}
    },
    {
      dataField: "createdAt",
      text: props.t("Date Created"),
      formatter: (val) => formatDate(val.createdAt),
    },
    {
      dataField: "dropdown",
      text: props.t("Actions"),
      formatter: (val) => (
        <UncontrolledDropdown>
          <DropdownToggle tag="i" style={{ cursor: "pointer" }}>
            <i
              className="mdi mdi-dots-horizontal font-size-18"
              onClick={() => {
                setSelectedAccount(val);
              }}
            />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-end">
            <DropdownItem onClick={setShowTypeModal} href="#">
              {props.t("Change Type")}
            </DropdownItem>
            {/* <DropdownItem onClick={setShowPassModal} href="#">
              {props.t("Reset Password")}
            </DropdownItem> */}
            {/* <DropdownItem onClick={setShowAccessModal} href="#">
              {props.t("Change Access")}
            </DropdownItem> */}
            <DropdownItem onClick={setShowLeverageModal} href="#">
              {props.t("Change Leverage")}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];
  const dispatch = useDispatch();
  const fetchData = async (page) => {
    dispatch(
      fetchTradingAccounts({
        page: page || 1,
        limit: sizePerPage,
        customerId: clientId,
      })
    );
  };

  useEffect(() => {
    fetchData(1);
    
  }, [sizePerPage, clientId]);

  useEffect(() => {
    if (props.deletingClearCounter > 0 && showDeleteModal) {
      setShowDeleteModal(false);
    }
  }, [props.deletingClearCounter]);

  return (
    <React.Fragment>
      <div className="">
        <div className="container-fluid">
          <Row>
            <Col className="col-12">
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center gap-2">
                  <CardTitle className="color-primary">
                    {props.t("Trading Accounts")} ({props.totalDocs})
                    <FeatherIcon
                      icon="refresh-cw"
                      className="icon-lg ms-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        fetchData(props.currentPage);
                      }}
                    />
                  </CardTitle>
                  <Row className="gap-2">
                    <Col>
                      <LinkMT5
                        show={showLinkModal}
                        toggle={setShowLinkModal}
                        customerId={clientId}
                      />
                    </Col>
                    <Col md="8">
                      <CreateTradingAccount
                        show={showModal}
                        onClose={() => {
                          setShowModal(false);
                        }}
                        hidenAddButton={false}
                        customerId={clientId}
                      />
                    </Col>
                  </Row>
                  {/* <DeleteModal
                    loading={props.deleteLoading}
                    onDeleteClick={deleteRole}
                    show={showDeleteModal }
                    onCloseClick={()=>{setShowDeleteModal(false)}}
                  /> */}
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                      style={{ overflow: "visible" }}
                    >
                      <Table
                        id="tech-companies-1"
                        className="table  table-hover "
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
                        <Tbody>
                          {props.fetchAllTradingAccountsLoading && (
                            <TableLoader colSpan={4} />
                          )}
                          {!props.fetchAllTradingAccountsLoading &&
                            props.accounts.length === 0 && (
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
                          {!props.fetchAllTradingAccountsLoading &&
                            props.accounts.length !== 0 &&
                            props.accounts.map((row, rowIndex) => (
                              <Tr key={rowIndex}>
                                {columns.map((column, index) => (
                                  <Td
                                    key={`${rowIndex}-${index}`}
                                    className="text-center"
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
                        {...props.pagination}
                        docs={props.accounts}
                        setSizePerPage={setSizePerPage}
                        sizePerPage={sizePerPage}
                        onChange={fetchData}
                      />
                    </div>
                  </div>
                </CardBody>
                <hr className="my-2" />
                <Positions accountId={accountId} />
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <div className="d-none">
        <ChangePassword
          show={showPassModal}
          toggle={setShowPassModal}
          customerId={clientId}
          selectedAcc={selectedAccount}
        />
        <ChangeType
          show={showTypeModal}
          toggle={setShowTypeModal}
          customerId={clientId}
          selectedAcc={selectedAccount}
        />
        <ChangeAccess
          show={showAccessModal}
          toggle={setShowAccessModal}
          customerId={clientId}
          selectedAccount={selectedAccount}
        />
        <ChangeLeverage
          show={showLeverageModal}
          toggle={setShowLeverageModal}
          customerId={clientId}
          selectedAccount={selectedAccount}
        />
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => ({
  clientDetails: state.clientReducer.clientDetails || {},
  accounts:
    (state.tradingAccountReducer.accounts &&
      state.tradingAccountReducer.accounts.docs) ||
    [],
  totalDocs:
    (state.tradingAccountReducer.accounts &&
      state.tradingAccountReducer.accounts.totalDocs) ||
    0,
  currentPage:
    (state.tradingAccountReducer.accounts &&
      state.tradingAccountReducer.accounts.page) ||
    1,
  pagination: state.tradingAccountReducer.accounts || {},
  loading: state.tradingAccountReducer.loading,
  fetchAllTradingAccountsLoading:
    state.tradingAccountReducer.fetchAllTradingAccountsLoading,
});

export default connect(mapStateToProps, null)(withTranslation()(Accounts));
