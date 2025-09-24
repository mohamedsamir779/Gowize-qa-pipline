/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { useDispatch, connect } from "react-redux";
// eslint-disable-next-line object-curly-newline
import { Row, Col, Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import TableLoader from "components/Common/Loader";
import CustomPagination from "components/Common/CustomPagination";
// eslint-disable-next-line object-curly-newline
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import WithDrawForm from "./WithDrawForm";
import {
  fetchWithdrawalsStart,
  withdrawApproveStart,
  withdrawRejectStart,
} from "store/transactions/withdrawal/action";
import SearchBar from "components/Common/SearchBar";
// import Notification from "components/Common/Notification";
// import logo from "../../../assets/images/logo-sm.svg";
import { withTranslation } from "react-i18next";
import { checkAllBoxes } from "common/utils/checkAllBoxes";
import { Link } from "react-router-dom";
import { captilazeFirstLetter } from "common/utils/manipulateString";
import Badge from "components/Common/Badge";
import CustomDropDown from "components/Common/CustomDropDown";
import formatDate from "helpers/formatDate";
import FeatherIcon from "feather-icons-react";
import Filter from "./DepositFilter";
import ReceiptModal from "../Forex/ReceiptModal";

function Withdrawal(props) {
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [sizePerPage, setSizePerPage] = useState(10);
  // const [showNotication, setShowNotifaction] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState("");
  const [selected, setSelected] = useState("LIVE");
  const [btnprimary1, setBtnprimary1] = useState(false);
  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  };
  const columns = [
    {
      dataField: "checkbox",
      text: (
        <input
          type="checkbox"
          id="check-all-withdrawals"
          onChange={() =>
            checkAllBoxes("check-all-withdrawals", ".withdraw-checkbox")
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
                pathname: val.customerId
                  ? `/clients/${val.customerId._id}/profile`
                  : "",
                state: { clientId: val.customerId ? val.customerId._id : "" },
              }}
            >
              <i className="no-italics">
                {" "}
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
        val.gateway === "WIRE_TRANSFER"
          ? "Wire"
          : val.gateway?.split("_").join(" ")?.toLowerCase(),
    },
    {
      dataField: "currency",
      text: props.t("Currency"),
    },
    {
      dataField: "reason",
      text: "Reason",
      formatter: (val) =>
        val.reason ? (
          <div data-title={val.reason}>
            {val.reason.length > 20
              ? `${val.reason.slice(0, 20)}...`
              : val.reason}
          </div>
        ) : (
          ""
        ),
    },
    {
      dataField: "paid",
      text: props.t("paid"),
      formatter: (val) => val?.paid?.$numberDecimal || val?.paid || "",
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
      formatter: (val) => val?.amount?.$numberDecimal || val?.amount || "",
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (item) => <Badge status={item.status}></Badge>,
    },
    {
      dataField: "dropdown",
      isDummyField: true,
      editable: false,
      text: props.t("Actions"),
    },
    {
      dataField: "",
      isDummyField: true,
      editable: false,
      text: props.t("Details"),
      formatter: (val) => (
        <div className="text-center">
          <Link
            className={`${
              ["CRYPTO", "BLOCKCHAIN", "WIRE_TRANSFER", "حواله بنكيه"].includes(val.gateway)
                ? "text-success"
                : "text-muted"
            }`}
            to="#"
          >
            <i
              className="mdi mdi-eye font-size-20"
              id="edittooltip"
              onClick={() => {
                if (val.gateway === "BLOCKCHAIN") {
                  setDetailsModal(true);
                  setSelectedContent({
                    network:
                      `${val?.rawData?.data?.item?.network} ${val?.rawData?.data?.item?.blockchain}` ||
                      "-",
                    referenceId: val?.rawData?.referenceId || "-",
                    amount: val?.amount?.$numberDecimal || val?.amount || "-",
                    address: val?.rawData?.data?.item?.address || "-",
                    confirmations:
                      val?.rawData?.data?.item?.currentConfirmations || "-",
                    requiredConfirmations:
                      val?.rawData?.data?.item?.targetConfirmations || "-",
                    transactionId:
                      val?.rawData?.data?.item?.transactionId || "-",
                  });
                } else if (val.gateway == "WIRE_TRANSFER") {
                  setDetailsModal(true);
                  setSelectedContent({
                    ...val?.content,
                  });
                } else if (val.gateway == "CRYPTO") {
                  setDetailsModal(true);
                  setSelectedContent({
                    ...val?.content,
                  });
                } else if (val.gateway === "حواله بنكيه") {
                  setDetailsModal(true);
                  setSelectedContent({
                    name: val?.name,
                    address: val?.address,
                    phone: val?.phone,
                  });
                }
              }}
            ></i>
          </Link>
        </div>
      ),
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

  const loadWithdrawals = (page, limit) => {
    if (searchInput !== "" && searchInput.length >= 3) {
      dispatch(
        fetchWithdrawalsStart({
          page,
          limit,
          type: selected,
          searchText: searchInput,
          filteredValues,
        })
      );
    } else if (searchInput === "") {
      dispatch(
        fetchWithdrawalsStart({
          page,
          limit,
          type: selected,
          filteredValues,
        })
      );
    }
  };
  const withdrawApprove = (withdraw) => {
    dispatch(
      withdrawApproveStart({
        id: withdraw._id,
        customerId: withdraw.customerId._id,
      })
    );
  };
  const withdrawReject = (withdraw) => {
    dispatch(
      withdrawRejectStart({
        id: withdraw._id,
        customerId: withdraw.customerId._id,
      })
    );
  };

  useEffect(() => {
    loadWithdrawals(1, sizePerPage);
  }, [
    sizePerPage,
    1,
    searchInput,
    selected,
    props.withdrawResponseMessage,
    props.withdrawChangeStatusSuccess,
    filteredValues,
  ]);

  return (
    <React.Fragment>
      <Row>
        <Col className="col-12">
          <Card>
            <CardHeader className="d-flex flex-column gap-3 ">
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle className="color-primary">
                  {props.t(`Withdrawals(${props.totalDocs})`)}
                  <FeatherIcon
                    icon="refresh-cw"
                    className="icon-lg ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      loadWithdrawals(1, sizePerPage);
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
                  {/* <div >
                    <Dropdown
                      isOpen={btnprimary1}
                      toggle={() => setBtnprimary1(!btnprimary1)}
                      style={{
                        marginRight: 10,
                      }}
                    >
                      <DropdownToggle tag="button" className="btn btn-primary">
                        {selected} <i className="mdi mdi-chevron-down" />
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownItem value="LIVE" onClick={(e)=>{setSelected(e.target.value)}}>LIVE</DropdownItem>
                        <DropdownItem value="DEMO" onClick={(e)=>{setSelected(e.target.value)}}>DEMO</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div> */}
                  <Filter
                    filterChangeHandler={filterChangeHandler}
                    filteredValues={filteredValues}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <WithDrawForm />
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
                    {props.loading && (
                      <Tr className="w-100 d-flex">
                        <TableLoader colSpan={4} />
                      </Tr>
                    )}
                    {props.totalDocs === 0 ? (
                      <Tbody>
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
                        {!props.loading &&
                          props.withdrawals.map((row, rowIndex) => (
                            <Tr key={rowIndex}>
                              {columns.map((column, index) => (
                                <Td
                                  key={`${rowIndex}-${index}`}
                                  className="pt-4"
                                >
                                  {column.dataField === "checkbox" ? (
                                    <input
                                      className="withdraw-checkbox"
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
                                        props.withdrawalsPermissions.actions
                                      }
                                      status={row.status}
                                      approve={() => withdrawApprove(row)}
                                      reject={() => withdrawReject(row)}
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
                    onChange={loadWithdrawals}
                    docs={props.withdrawals}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <ReceiptModal
        open={detailsModal}
        content={{
          type: "json",
          content: selectedContent,
        }}
        onClose={() => setDetailsModal(false)}
      />
    </React.Fragment>
  );
}
const mapStateToProps = (state) => ({
  loading: state.withdrawalReducer.loading || false,
  withdrawals: state.withdrawalReducer.withdrawals || [],
  page: state.withdrawalReducer.page || 1,
  totalDocs: state.withdrawalReducer.totalDocs || 0,
  totalPages: state.withdrawalReducer.totalPages || 0,
  hasNextPage: state.withdrawalReducer.hasNextPage,
  hasPrevPage: state.withdrawalReducer.hasPrevPage,
  limit: state.withdrawalReducer.limit,
  nextPage: state.withdrawalReducer.nextPage,
  pagingCounter: state.withdrawalReducer.pagingCounter,
  prevPage: state.withdrawalReducer.prevPage,
  withdrawalsPermissions: state.Profile.withdrawalsPermissions || {},
  withdrawResponseMessage: state.withdrawalReducer.withdrawResponseMessage,
  withdrawChangeStatusSuccess:
    state.withdrawalReducer.withdrawChangeStatusSuccess,
});
export default connect(mapStateToProps, null)(withTranslation()(Withdrawal));
