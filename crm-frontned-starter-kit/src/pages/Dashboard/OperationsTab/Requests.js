import React, { useEffect, useState } from "react";
import {
  Card, CardBody, CardTitle, CardSubtitle, Table
} from "reactstrap";
import { getRequestStats } from "apis/dashboard";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const RequestsStats = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(null);
  useEffect(async () => {
    const st = await getRequestStats();
    setStatus(st);
  }, []);
  return (
    <React.Fragment>
      <Card className="card-animate">
        <CardBody>
          <CardTitle className="color-primary">
            <h5 className="color-primary">{t("Requests Stats")}</h5>
          </CardTitle>
          <CardSubtitle className="mb-3">
          </CardSubtitle>
          <div className="table-responsive">
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
                    <Link to={"/requests/ib"}>
                      {t("Partnership")}
                    </Link>
                  </th>
                  <td>
                    <Link to={`/requests/ib?status=${"PENDING"}`}>
                      {status?.PARTNERSHIP?.PENDING ?? 0}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/requests/ib?status=${"REJECTED"}`}>
                      {status?.PARTNERSHIP?.REJECTED ?? 0}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/requests/ib?status=${"APPROVED"}`}>
                      {status?.PARTNERSHIP?.APPROVED ?? 0}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-start" scope="row">
                    <Link to={"/requests/leverage"}>
                      {t("Leverage")}
                    </Link>
                  </th>
                  <td>
                    <Link to={`/requests/leverage?status=${"PENDING"}`}>
                      {status?.LEVERAGE?.PENDING ?? 0}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/requests/leverage?status=${"REJECTED"}`}>
                      {status?.LEVERAGE?.REJECTED ?? 0}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/requests/leverage?status=${"APPROVED"}`}>
                      {status?.LEVERAGE?.APPROVED ?? 0}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="text-start" scope="row">
                    <Link to={"/requests/accounts"}>
                      {t("Accounts")}
                    </Link>
                  </th>
                  <td>
                    <Link to={`/requests/accounts?status=${"PENDING"}`}>
                      {status?.ACCOUNT?.PENDING ?? 0}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/requests/accounts?status=${"REJECTED"}`}>
                      {status?.ACCOUNT?.REJECTED ?? 0}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/requests/accounts?status=${"APPROVED"}`}>
                      {status?.ACCOUNT?.APPROVED ?? 0}
                    </Link>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
          
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RequestsStats;