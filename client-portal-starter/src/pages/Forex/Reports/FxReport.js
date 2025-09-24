import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Table, Col, Row, Button, Spinner,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import moment from "moment";
import { getAccountsStart, getTransfersStart } from "store/actions";
import PageHeader from "components/Forex/Common/PageHeader";
import CardWrapper from "components/Common/CardWrapper";
import Badge from "components/Forex/Common/Badge";
import CustomPagination from "components/Common/CustomPagination";
import { MetaTags } from "react-meta-tags";
import { CUSTOMER_SUB_PORTALS } from "common/constants";
import {
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";

const Transfers = (props) => {
  const dispatch = useDispatch();
  const { accounts, transfers } = useSelector((state) => state.forex.accounts);
  const { subPortal } = useSelector((state) => (state.Layout));

  const [sizePerPage, setSizePerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const [isClientPortal] = useState(subPortal === CUSTOMER_SUB_PORTALS.LIVE);


  const getTransfers = (page = 1, limit = sizePerPage, v = {}) => {
    const { tradingAccountId, transactionType } = v;
    const obj = {
      accountType: isClientPortal ? CUSTOMER_SUB_PORTALS.LIVE : CUSTOMER_SUB_PORTALS.IB,
      page,
      limit,
      dateFrom,
      dateTo,
    };
    transactionType ? (obj.type = transactionType) : (!isClientPortal && (obj.type = "ibAll"));
    tradingAccountId && (obj.tradingAccountId = tradingAccountId);
    dispatch(getTransfersStart(obj));
  };

  useEffect(() => {
    dispatch(getAccountsStart({
      type: isClientPortal ? CUSTOMER_SUB_PORTALS.LIVE : CUSTOMER_SUB_PORTALS.IB,
    }));
    getTransfers(1, sizePerPage);
  }, [sizePerPage]);

  const columns = [
    {
      dateField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => moment(val?.createdAt).format("DD MMM YYYY HH:mm:ss"),
    },
    {
      dateField: "type",
      text: props.t("Type"),
    },
    {
      dateField: "tradingAccountId.login",
      text: props.t("Account"),
    },
    {
      dateField: "gateway",
      text: props.t("Gateway"),
      formatter: (val) => <>{val?.gateway | "-"}</>,
    },
    {
      dateField: "amount",
      text: props.t("Amount"),
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <>{val?.status}</>,
    },
  ];

  return (
    <Container>
      <div className="page-content mt-5">
        <MetaTags>
          <title>{props.t("Reports")}</title>
        </MetaTags>
        <PageHeader title="Reports"></PageHeader>
        <CardWrapper className="mt-3 px-5 py-4 glass-card shadow">
          <div className="d-flex justify-content-between">
            <h3 className="color-primary">{props.t("Fx Report")}</h3>
            <i className="bx bx-dots-vertical-rounded fs-3 mt-1"></i>
          </div>
          <AvForm onValidSubmit={(e, v) => getTransfers(1, sizePerPage, v)}>
            <Row className="mt-3 justify-content-between align-items-end">
              <Col xs="12" md="3">
                <AvField type="select" name="transactionType" label={props.t("Transaction Type")} className="mt-1 mb-2 form-select">
                  <option value="">{props.t("All")}</option>
                  {isClientPortal && <option value="deposit">{props.t("Deposits")}</option>}
                  <option value="withdraw">{props.t("Withdraws")}</option>
                  <option value="internal_transfer">{props.t("Internal Transfers")}</option>
                </AvField>
              </Col>
              <Col xs="12" md="3">
                <AvField type="select" name="tradingAccountId" label={props.t("Trading Account")} className="mt-1 mb-2 form-select">
                  <option value="">{props.t("All")}</option>
                  {accounts?.map((account) =>
                    <option key={account.login} value={account._id}>{account.login}</option>
                  )};
                </AvField>
              </Col>
              <Col xs="12" md="3" lg="2">
                <AvField type="date" name="dateFrom" label={props.t("Date From")} className="mt-1 mb-2"
                  onChange={(e) => { setDateFrom(e.target.value) }}
                  max={dateTo ? moment(dateTo).format("YYYY-MM-DD") : moment().format("YYYY-MM-DD")}
                  required />
              </Col>
              <Col xs="12" md="3" lg="2">
                <AvField type="date" name="dateTo" label={props.t("Date To")} className="mt-1 mb-2"
                  onChange={(e) => { setDateTo(e.target.value) }}
                  max={moment().add(1, "days").format("YYYY-MM-DD")}
                  min={dateFrom && moment(dateFrom).format("YYYY-MM-DD")}
                  required />
              </Col>
              <Col>
                <Button type="submit" className="border-0 color-bg-btn mb-md-2 mt-3 mt-lg-0 w-100">{props.t("Submit")}</Button>
              </Col>
            </Row>
          </AvForm>
          <hr className="my-4" />
          <div className="mt-4 border rounded-3">
            <Table borderless responsive className="text-center mb-0" >
              <Thead className="text-center table-light">
                <Tr>
                  {columns.map((column, index) => (
                    <Th data-priority={index} key={index} className="color-primary"> 
                      {column.text}
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <tbody>
                {
                  transfers.loading
                    ? <tr><td colSpan="100%" className="my-2"><Spinner color="primary" /></td></tr>
                    : transfers?.docs?.length === 0
                      ? <tr><td colSpan="100%" className="my-2">{props.t("No Transfers")}</td></tr>
                      : transfers?.docs?.map((transfer, index) =>
                        <tr key={index} className="border-top">
                          <td>{moment(transfer.createdAt).format("yy-MM-DD HH:mm")}</td>
                          <td>{transfer.type}</td>
                          <td>{transfer.tradingAccountId?.login ?? transfer.tradingAccountFrom?.login}</td>
                          <td>{transfer.gateway ?? "-"}</td>
                          <td className="font-weight-bold color-green">{transfer.amount}</td>
                          <td><Badge status={transfer.status} /></td>
                        </tr>
                      )
                }
              </tbody>
            </Table>
          </div>
          <div className="mt-4">
            <CustomPagination
              {...transfers}
              setSizePerPage={setSizePerPage}
              sizePerPage={sizePerPage}
              onChange={getTransfers}
            />
          </div>
        </CardWrapper>
      </div>
    </Container>
  );
};

export default withTranslation()(Transfers);