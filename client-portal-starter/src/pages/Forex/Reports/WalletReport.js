import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container, Table, Col, Row, Button,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import { AvField, AvForm } from "availity-reactstrap-validation";
import moment from "moment";
import { fetchReport, fetchWallets } from "store/actions";
import CardWrapper from "components/Common/CardWrapper";
import CustomPagination from "components/Common/CustomPagination";
import { MetaTags } from "react-meta-tags";
import {
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";
import Loader from "components/Common/Loader";

const Transfers = (props) => {
  const dispatch = useDispatch();

  const [sizePerPage, setSizePerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  const { wallets, loading: walletsLoading } = useSelector((state) => state.walletReducer);
  const { data, loading, pagination } = useSelector((state) => state.walletReducer.report);

  const getReport = (page = 1, limit = sizePerPage, v = {}) => {
    const obj = {
      page,
      limit,
      dateFrom,
      dateTo,
      type: v.type || "ALL",
      currency: v.currency || "ALL",
    };
    dispatch(fetchReport(obj));
  };

  useEffect(() => {
    getReport(1, sizePerPage);
  }, [sizePerPage]);

  const getStatusColor = (type) => {
    switch (String(type).toLowerCase()) {
      case "approved":
        return "color-green";
      case "rejected":
        return "color-red";
      default:
        return "color-gray";
    }
  };

  const columns = [
    {
      dateField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => moment(val?.createdAt).format("DD MMM YYYY HH:mm:ss"),
    },
    {
      dateField: "type",
      text: props.t("Type"),
      formatter: (val) => <>{val?.type || "INTERNAL_TRANSFER"}</>,
    },
    {
      dateField: "currency",
      text: props.t("Wallet"),
      formatter: (val) => {
        if (val?.type) {
          return val?.currency;
        }
        else {
          return `${val?.baseCurrency} -> ${val?.targetCurrency}`;
        }
      }
    },
    {
      dateField: "gateway",
      text: props.t("Gateway"),
      formatter: (val) => <>{val?.gateway || "INTERNAL_TRANSFER"}</>,
    },
    {
      dateField: "amount",
      text: props.t("Amount"),
      formatter: (val) => <span className="font-weight-bold color-green">{val?.amount?.$numberDecimal || val?.amount || "-"}</span>,
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <span className={`${getStatusColor(val?.status)} text-capitalize font-weight-bold`}>{val?.status}</span>,
    },
  ];

  useEffect(() => {
    dispatch(fetchWallets());
  }, []);


  return (
    <Container>
      <div className="page-content mt-5">
        <MetaTags>
          <title>{props.t("Reports")}</title>
        </MetaTags>
        <CardWrapper className="mt-3 px-5 py-4 glass-card shadow">
          <div className="d-flex justify-content-between">
            <h3 className="color-primary">{props.t("Wallet Report")}</h3>
            <i className="bx bx-dots-vertical-rounded fs-3 mt-1"></i>
          </div>
          <AvForm onValidSubmit={(e, v) => getReport(1, sizePerPage, v)}>
            <Row className="mt-3 justify-content-between align-items-end">
              <Col xs="12" md="3">
                <AvField type="select" name="type" label={props.t("Transaction Type")} className="mt-1 mb-2 form-select">
                  <option value="">{props.t("All")}</option>
                  {<option value="DEPOSIT">{props.t("Deposits")}</option>}
                  <option value="WITHDRAW">{props.t("Withdraws")}</option>
                  <option value="TRANSFER">{props.t("Internal Transfers")}</option>
                </AvField>
              </Col>
              <Col xs="12" md="3">
                {walletsLoading ? (
                  <Loader />
                ) : (
                  <AvField type="select" name="currency" label={props.t("Wallets")} className="mt-1 mb-2 form-select">
                    <option value="">{props.t("All")}</option>
                    {wallets?.filter(wallet => !wallet.isInventory).map((wallet) => (
                      <option key={wallet.asset} value={wallet.asset}>
                        {wallet.asset}
                      </option>
                    ))}
                  </AvField>
                )}
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
                {loading ? (
                  <Loader />
                ) : (
                  data?.map((item, index) => (
                    <Tr key={index}>
                      {columns.map((column, index) => (
                        <td key={index} data-priority={index}>
                          {column.formatter ? column.formatter(item) : item[column.dateField]}
                        </td>
                      ))}
                    </Tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
          <div className="mt-4">
            <CustomPagination
              {...pagination}
              page={parseInt(pagination.page)}
              limit={parseInt(pagination.limit)}
              setSizePerPage={setSizePerPage}
              sizePerPage={sizePerPage}
              onChange={getReport}
            />
          </div>
        </CardWrapper>
      </div>
    </Container>
  );
};

export default withTranslation()(Transfers);