
import { useDispatch, useSelector } from "react-redux";
import {
  Table, Col, Row, Spinner
} from "reactstrap";
import { withTranslation } from "react-i18next";

import moment from "moment";

import CardWrapper from "components/Common/CardWrapper";

import CustomPagination from "components/Common/CustomPagination";
import { useState, useEffect } from "react";
import { getTransfersStart } from "store/actions";
import {
  Th,
  Thead,
  Tr
} from "react-super-responsive-table";


const Transfers = (props) => {
  const { transfers } = useSelector((state) => state.forex.accounts);
  const dispatch = useDispatch();
  const [sizePerPage, setSizePerPage] = useState(10);

  useEffect(() => {
    loadTransfers(1, sizePerPage);
  }, [sizePerPage]);

  const loadTransfers = (page = 1, limit = 10) => {
    if (props.accountId) dispatch(getTransfersStart({
      limit,
      page,
      tradingAccountId: props.accountId
    }));
  };

  const getStatusColor = (type) => {
    switch (String(type).toLowerCase()) {
      case "approved":
        return "color-green";
      case "rejected":
        return "color-red";
      default:
        return "";
    }
  };

  const columns = [
    {
      dataField: "tradingAccountId.login",
      text: props.t("Account No."),
      formatter: (val) => val?.tradingAccountId?.login,
    },
    {
      dataField: "createdAt",
      text: props.t("Date"),
      formatter: (val) => moment(val?.createdAt).format("DD MMM YYYY HH:mm:ss"),
    },
    {
      dataField: "recordId",
      text: props.t("Transaction ID"),
    },
    {
      dataField: "amount",
      text: props.t("Amount"),
      formatter: (val) => <span className="text-capitalize">{val?.amount}</span>,
    },
    {
      dataField: "type",
      text: props.t("Transaction Type"),
      formatter: (val) => <span className="text-capitalize">{val?.type}</span>,
    },
    {
      dataField: "status",
      text: props.t("Status"),
      formatter: (val) => <span className={`${getStatusColor(val?.status)} text-capitalize`}>{val?.status}</span>,
    },
  ];

  return (
    <CardWrapper className="mt-3 px-5 py-4 shadow glass-card">
      <Row>
        <Col className="d-flex justify-content-between">
          <h3 className="color-primary">{props.t("Recent Transfers")}</h3>

        </Col>
      </Row>
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
          <tbody className="border-top">
            {transfers.loading
              ? <tr><td className="py-4" colSpan="100%"><Spinner /></td></tr>
              : !props.accountId
                ? <tr><td colSpan="100%" className="my-2">{props.t("Please select an account.")}</td></tr>
                : transfers?.docs?.length === 0
                  ? <tr><td colSpan="100%" className="my-2">{props.t("No recent transfers for this account.")}</td></tr>
                  : transfers?.docs?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((column, index) => (
                        <td key={`${rowIndex}-${index}`} className="font-weight-bold">
                          {column.formatter
                            ? column.formatter(row, rowIndex)
                            : row[column.dataField]}
                        </td>
                      ))}
                    </tr>))
            }
          </tbody>
        </Table>
      </div>
      <div className="mt-4">
        <CustomPagination
          {...transfers}
          setSizePerPage={setSizePerPage}
          sizePerPage={sizePerPage}
          onChange={loadTransfers}
        />
      </div>
    </CardWrapper>
  );
};

export default withTranslation()(Transfers);