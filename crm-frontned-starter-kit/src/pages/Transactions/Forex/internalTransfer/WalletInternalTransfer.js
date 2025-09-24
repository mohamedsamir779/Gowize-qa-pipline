/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import SearchBar from "components/Common/SearchBar";
import CustomPagination from "components/Common/CustomPagination";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import CustomDropdown from "components/Common/CustomDropDown";
import TableLoader from "components/Common/TableLoader";
import Notification from "components/Common/Notification";
import logo from "../../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import Badge from "components/Common/Badge";
import Filter from "./Filter";
import formatDate from "helpers/formatDate";
import {
  approveWalletTransfer,
  fetchWalletTransfer,
  rejectWalletTransfer,
} from "store/wallet/transfer/actions";
import FeatherIcon from "feather-icons-react";
import InternalTransferModal from "./InternalTransferModal";

function WalletInternalTransfer(props) {
  const dispatch = useDispatch();

  const [searchInput, setSearchInput] = useState("");
  const [showNotification, setShowNotifaction] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [selectedFilter, setSelectedFilter] = useState("ALL");

  const { requests, loading, requestsPagination, clearingCounter } =
    useSelector((state) => state.walletReducer.transfers);
  const { addInternalTransferClearingCounter } = useSelector(
    (state) => state.internalTransferReducer
  );
  const { actions } = useSelector((state) => state.Profile.depositsPermissions);

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
      dataField: "Client",
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
                {val?.customerId
                  ? `${captilazeFirstLetter(
                      val?.customerId?.firstName
                    )} ${captilazeFirstLetter(val?.customerId?.lastName)}`
                  : ""}
              </span>
            </Link>
          </div>
        );
      },
    },
    {
      dataField: "baseCurrency",
      text: props.t("From Currency"),
    },
    {
      dataField: "targetCurrency",
      text: props.t("To Currency"),
    },
    {
      dataField: "fromId",
      text: props.t("From"),
      formatter: (item) =>
        item.source === "WALLET"
          ? `WALLET - ${item?.fromId?.asset}`
          : `Trading Account -${item?.fromId?.login}`,
    },
    {
      dataField: "toId",
      text: props.t("To"),
      formatter: (item) =>
        item.destination === "WALLET"
          ? `WALLET - ${item?.toId?.asset}`
          : `Trading Account -${item?.toId?.login}`,
    },
    {
      dataField: "fee",
      text: props.t("Fee"),
    },
    {
      dataField: "amount",
      text: props.t("Base Amount"),
    },
    {
      dataField: "conversionRate",
      text: props.t("Conversion Rate"),
      formatter: (val) => val?.conversionRate?.toFixed(2),
    },
    {
      dataField: "targetAmount",
      text: props.t("Converted Amount"),
      formatter: (val) => val?.targetAmount?.toFixed(2),
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => (
        <Badge className={val?.status} status={val?.status} />
      ),
    },
    {
      dataField: "dropdown",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
    },
  ];

  const handleApproveRequest = (request) =>
    dispatch(approveWalletTransfer(request._id));

  const handleRejectRequest = (request) =>
    dispatch(rejectWalletTransfer(request._id));

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const initFilteredValues = {
    customerId: "",
    filterDate: {
      fromDate: "",
      toDate: "",
    },
    status: "",
    currency: "",
    amount: "",
    fee: "",
    tradingAccountFrom: "",
    tradingAccountTo: "",
    agent: "",
  };
  const [filteredValues, setFilteredValues] = useState(initFilteredValues);
  const filterChangeHandler = (filteredValuesData) => {
    setFilteredValues(filteredValuesData);
  };
  const loadTransfers = (page, limit) => {
    if (searchInput && searchInput.length > 3) {
      dispatch(
        fetchWalletTransfer({
          limit,
          page,
          filteredValues,
          searchText: searchInput,
        })
      );
    } else {
      dispatch(
        fetchWalletTransfer({
          limit,
          page,
          filteredValues,
        })
      );
    }
  };

  const closeNotification = () => {
    setShowNotifaction(false);
  };

  useEffect(() => {
    loadTransfers(1, sizePerPage);
  }, [
    clearingCounter,
    sizePerPage,
    filteredValues,
    searchInput,
    selectedFilter,
    addInternalTransferClearingCounter,
  ]);

  return (
    <>
      <Notification
        onClose={closeNotification}
        body={props.t("The internal transfer has been updated successfully")}
        show={showNotification}
        header={props.t("Wallet Transfer Requests")}
        logo={logo}
      />
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="color-primary">
                  {props.t(
                    `Wallet Transfer Requests(${requestsPagination?.totalDocs})`
                  )}
                  <FeatherIcon
                    icon="refresh-cw"
                    className="icon-lg ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      loadTransfers(1, sizePerPage);
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
                  <Filter
                    filterChangeHandler={filterChangeHandler}
                    filteredValues={filteredValues}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <InternalTransferModal />
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
                        {columns.map((column, index) => (
                          <Th data-priority={index} key={index}>
                            <span className="color-primary">{column.text}</span>
                          </Th>
                        ))}
                      </Tr>
                    </Thead>

                    {requests?.length === 0 ? (
                      <Tbody>
                        {loading && <TableLoader colSpan={4} />}
                        {!loading && (
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
                        {loading && <TableLoader colSpan={4} />}
                        {!loading &&
                          requests?.map((row, rowIndex) => (
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
                                    <CustomDropdown
                                      permission={actions}
                                      status={row?.status}
                                      approve={() => handleApproveRequest(row)}
                                      reject={() => handleRejectRequest(row)}
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
                    {...requestsPagination}
                    setSizePerPage={setSizePerPage}
                    sizePerPage={sizePerPage}
                    onChange={loadTransfers}
                    docs={requests}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default withTranslation()(WalletInternalTransfer);
