import classNames from "classnames";
import CardWrapper from "components/Common/CardWrapper";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  Button, ButtonGroup, Table
} from "reactstrap";
import { fetchStatementDeals } from "store/actions";
import Loader from "components/Common/Loader";
import CustomPagination from "components/Common/CustomPagination";
import { Thead } from "react-super-responsive-table";

const ListDeals = ({ clientLogin }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [type, setType] = useState("0");
  const [customActiveTab, setcustomActiveTab] = useState("1");
  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const { statementDeals: deals, dealsLoading } = useSelector(state => state.forex.ib.agreements);

  const [sizePerPage, setSizePerPage] = useState(10);

  const loadStatementDeals = (page = 1, limit = 10) => {
    dispatch(fetchStatementDeals({
      limit,
      page,
      platform: "MT5",
      clientLogin,
      entry: type,
    }));
  };
  useEffect(() => {
    clientLogin && loadStatementDeals(1, sizePerPage);
  }, [type, clientLogin, sizePerPage]);

  return (
    <>
      <CardWrapper className="mt-3 px-5 py-4 pb-4 shadow glass-card">
        <div className="d-flex justify-content-between">
          <h3>{t("Deals")}</h3>
          <ButtonGroup className="my-2">
            <Button
              className={classNames("btn btn-light border-0", {
                "text-white color-bg-btn": customActiveTab === "1",
              })}
              onClick={() => {
                toggleCustom("1");
                setType("0");
              }}>
              {t("Commission")}
            </Button>
            <Button
              className={classNames("btn btn-light border-0", {
                "text-white color-bg-btn": customActiveTab === "2",
              })}
              onClick={() => {
                toggleCustom("2");
                setType("1");
              }}>
              {t("Rebate")}
            </Button>
          </ButtonGroup>
        </div>

        <hr className="my-4" />
        <div className="mt-4 border rounded-3">
          <Table borderless responsive className="text-center mb-0" >
            <Thead className="table-light">
              <tr>
                <th>{t("Login")}</th>
                <th>{t("Side")}</th>
                <th>{t("Deal ID")}</th>
                <th>{t("Position ID")}</th>
                <th>{t("Symbol")}</th>
                <th>{t("Deal Time")}</th>
                <th>{t("Profit")}</th>
                <th>{t("Volume")}</th>
                <th>{type === "0" ? t("Commission") : t("Rebate")}</th>
              </tr>
            </Thead>
            <tbody>
              {clientLogin ?
                dealsLoading ?
                  <tr>
                    <td colSpan="8" className="text-center"><Loader /></td>
                  </tr> :
                  deals?.docs?.map((deal, index) =>
                    <tr key={index} className="border-top">
                      <td>{deal?.clientDeal?.login}</td>
                      <td>{deal?.clientDeal?.action === 0 ? "Buy" : "Sell"}</td>
                      <td>{deal?.clientDeal?.dealId}</td>
                      <td>{deal?.clientDeal?.positionId}</td>
                      <td>{deal?.clientDeal?.symbol}</td>
                      <td>{moment(deal?.clientDeal?.time * 1000).format("YYYY-MM-DDTHH:mm")}</td>
                      <td>{deal?.clientDeal?.profit}</td>
                      <td>{type === "0" ? deal?.clientDeal?.volume  : deal?.clientDeal?.volumeClosed}</td>
                      <td>{deal?.profit}</td>
                    </tr>
                  ) :
                <tr>
                  <td colSpan="9" className="text-center">{t("Please select a client to view detailed statement")}</td>
                </tr>
              }
            </tbody>
          </Table>
        </div>
        {clientLogin &&
        <div className="mt-4">
          <CustomPagination
            {...deals}
            setSizePerPage={setSizePerPage}
            sizePerPage={sizePerPage}
            onChange={loadStatementDeals}
          />
        </div>
        }
      </CardWrapper>
    </>
  );
};

export default ListDeals;