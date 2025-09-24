import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AvField, AvForm } from "availity-reactstrap-validation";
import CardWrapper from "components/Common/CardWrapper";
import { useTranslation } from "react-i18next";
import {
  Button, Col, Row, Table
} from "reactstrap";
import AvFieldSelect from "components/Common/AvFieldSelect";
import moment from "moment";
import { fetchStatement } from "store/actions";
import Loader from "components/Common/Loader";
import CustomPagination from "components/Common/CustomPagination";
import { MetaTags } from "react-meta-tags";
import { Thead } from "react-super-responsive-table";

const platformOptions = [{
  label: "CTRADER",
  value: "CTRADER",
}];
// , {
//   label: "MT5",
//   value: "MT5",
// }, {
//   label: "MT4",
//   value: "MT4",
// }];


const Filteration = ({ onLoginSelect }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { statement, loading } = useSelector(state => state.forex.ib.agreements);


  const [sizePerPage, setSizePerPage] = useState(10);
  const [dateFrom, setDateFrom] = useState(String(moment().subtract(30, "days").format("YYYY-MM-DD")));
  const [dateTo, setDateTo] = useState(String(moment().add(1, "day").format("YYYY-MM-DD")));
  const [platform, setPlatform] = useState(platformOptions[0].value);

  const handleDateFrom = (e) => setDateFrom(e.target.value);
  const handleDateTo = (e) => setDateTo(e.target.value);

  const loadStatement = (page = 1, limit = 10, platform) => {
    dispatch(fetchStatement({
      limit,
      page,
      // setting it to MT5 for now,
      // just remove the assignment to platform when MT4 is ready
      platform: "CTRADER",
      dateFrom: dateFrom,
      dateTo: dateTo,
    }));
  };

  useEffect(() => {
    loadStatement(1, sizePerPage, platform);
  }, [sizePerPage]);

  return (
    <CardWrapper className="mt-3 px-5 py-4 pb-2 glass-card shadow">
      <MetaTags>
        <title>{t("Statement")}</title>
      </MetaTags>
      <AvForm onValidSubmit={() => loadStatement(1, sizePerPage, platform)}>
        <Row className="mt-3 justify-content-between align-items-end">
          <Col xs="12" md="3" lg="3">
            <AvFieldSelect
              className="mt-1 form-select"
              name="platform"
              label={t("Platform")}
              errorMessage={t("Platform is required")}
              validate={{ required: { value: true } }}
              onChange={(e) => setPlatform(e)}
              value={platform}
              options={platformOptions.map((obj) => {
                return ({
                  label: obj.label,
                  value: obj.value,
                });
              })}
            />
          </Col>
          <Col xs="12" md="3" lg="3">
            <AvField
              className="mt-1 mb-2"
              type="date"
              name="dateFrom"
              label={t("From Date")}
              value={dateFrom}
              validate={{ date: { format: "YYYY-MM-DD" } }}
              onChange={handleDateFrom}
            />
          </Col>
          <Col xs="12" md="3" lg="3">
            <AvField
              className="mt-1 mb-2"
              type="date"
              name="dateTo"
              label={t("To Date")}
              validate={{ date: { format: "YYYY-MM-DD" } }}
              value={dateTo}
              onChange={handleDateTo}
            />
          </Col>
          <Col>
            <Button
              className="btn-light color-bg-btn border-0 shadow mb-md-2 mt-3 mt-lg-0 w-100 text-white text-uppercase"
              loading={true}
            >
              {t("search")}
            </Button>
          </Col>
        </Row>
      </AvForm>
      <hr className="my-4" />
      <div className="mt-4 border rounded-3">
        <Table borderless responsive hover className="text-center mb-0">
          <Thead className="table-light">
            <tr>
              <th>{t("Client Login")}</th>
              <th>{t("Lots Opened")}</th>
              <th>{t("Commission")}</th>
              <th>{t("Lots Closed")}</th>
              <th>{t("Rebate")}</th>
            </tr>
          </Thead>
          <tbody>
            {loading ?
              <tr>
                <td colSpan="5" className="text-center"><Loader /></td>
              </tr>
              : statement?.docs?.map((statement, index) =>
                <tr key={index} className="border-top"
                  onClick={() => onLoginSelect(statement.clientLogin)}>
                  <td>{statement.clientLogin}</td>
                  <td>{statement.lotsOpened }</td>
                  <td>{statement.commission}</td>
                  <td>{statement.lotsClosed }</td>
                  <td>{statement.rebate}</td>
                </tr>
              )
            }
          </tbody>
        </Table>
      </div>
      <div className="mt-4">
        <CustomPagination
          {...statement}
          setSizePerPage={setSizePerPage}
          sizePerPage={sizePerPage}
          onChange={loadStatement}
        />
      </div>
    </CardWrapper>
  );
};

export default Filteration;