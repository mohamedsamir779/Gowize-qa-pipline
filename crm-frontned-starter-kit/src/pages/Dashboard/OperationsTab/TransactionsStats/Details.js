import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";


function ForexTransactions({ status, showCredit }) {
  const { t } = useTranslation();
  return (<div className="table-responsive">
    <Table className="table table-borderless mb-0">
      <thead>
        <tr className="text-center">
          <th></th>
          <th>{t("Pending")}</th>
          <th>{t("Rejected")}</th>
          <th>{t("Approve")}</th>
        </tr>
      </thead>
      <tbody className="text-center">
        <tr>
          <th className="text-start" scope="row">
            <Link to={"/transactions/deposit"}>
              {t("Deposit")}
            </Link>
          </th>
          <td>
            <Link to={`/transactions/deposit?status=${"PENDING"}`}>
              {status?.DEPOSIT?.PENDING ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/deposit?status=${"REJECTED"}`}>
              {status?.DEPOSIT?.REJECTED ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/deposit?status=${"APPROVED"}`}>
              {status?.DEPOSIT?.APPROVED ?? 0}
            </Link>
          </td>
        </tr>
        <tr>
          <th className="text-start" scope="row">
            <Link to={"/transactions/withdrawals"}>
              {t("Withdrwals")}
            </Link>
          </th>
          <td>
            <Link to={`/transactions/withdrawals?status=${"PENDING"}`}>
              {status?.WITHDRAW?.PENDING ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/withdrawals?status=${"REJECTED"}`}>
              {status?.WITHDRAW?.REJECTED ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/withdrawals?status=${"APPROVED"}`}>
              {status?.WITHDRAW?.APPROVED ?? 0}
            </Link>
          </td>
        </tr>
        <tr>
          <th className="text-start" scope="row">
            <Link to={"/transactions/internal-transfer"}>
              {t("Internal Transfers")}
            </Link>
          </th>
          <td>
            <Link to={`/transactions/internal-transfer?status=${"PENDING"}`}>
              {status?.INTERNAL_TRANSFER?.PENDING ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/internal-transfer?status=${"REJECTED"}`}>
              {status?.INTERNAL_TRANSFER?.REJECTED ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/internal-transfer?status=${"APPROVED"}`}>
              {status?.INTERNAL_TRANSFER?.APPROVED ?? 0}
            </Link>
          </td>
        </tr>
        {showCredit && <tr>
          <th className="text-start" scope="row">
            <Link to={"/transactions/credit"}>
              {t("Credits")}
            </Link>
          </th>
          <td>
            <Link to={`/transactions/credit?status=${"PENDING"}`}>
              {status?.CREDIT?.PENDING ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/credit?status=${"REJECTED"}`}>
              {status?.CREDIT?.REJECTED ?? 0}
            </Link>
          </td>
          <td>
            <Link to={`/transactions/credit?status=${"APPROVED"}`}>
              {status?.CREDIT?.APPROVED ?? 0}
            </Link>
          </td>
        </tr>}
      </tbody>
    </Table>
  </div>  );
}

export default ForexTransactions;