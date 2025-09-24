import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Col, Row, Table, Button, Spinner,
} from "reactstrap";
import { withTranslation } from "react-i18next";
import Icofont from "react-icofont";

import {
  getAccountsStart, clearAccountsState, toggleCurrentModal
} from "../../../store/actions";
import CustomPagination from "components/Common/CustomPagination";
import CardWrapper from "components/Common/CardWrapper";

const Accounts = ({ type, handleAsccountSelect, t }) => {
  const { accounts } = useSelector((state) => state.forex.accounts);
  const { accountsPagination, loading } = useSelector((state) => state.forex.accounts);

  const history = useHistory();
  const dispatch = useDispatch();

  const [sizePerPage, setSizePerPage] = useState(10);

  useEffect(() => {
    dispatch(clearAccountsState());
    handlePageChange(1, sizePerPage);
  }, [type, sizePerPage]);

  const handlePageChange = (page, limit) => {
    dispatch(getAccountsStart({
      type: type.toUpperCase(),
      limit: limit,
      page: page
    }));
  };
  return (
    <CardWrapper className="mt-4 px-5 py-4 glass-card">
      <Row>
        <Col className="d-inline-block d-md-flex justify-content-between">
          <h3>{t(`${type === "live" ? "Live" : "Demo"} Accounts`)}</h3>
          <div className="text-end d-flex d-sm-block flex-column">
            <Button color="light" className="mt-2 mt-md-0 me-0 mx-sm-1 me-md-3" onClick={() => dispatch(toggleCurrentModal("CreateAccModal", type))}>
              <Icofont className="me-2" icon="plus-circle" />
              {t(`Create New ${type === "live" ? "Live" : "Demo"} Account`)}</Button>
            {/* <Button color="light" className="mt-2 mt-md-0 me-0 mx-sm-1 me-md-3"
              onClick={() => history.push("/accounts/password")}
            >{t("Change Password")}</Button> */}
            <Button color="light" className="mt-2 mt-md-0" disabled={accounts?.length > 0 ? false : true} onClick={() => dispatch(toggleCurrentModal("LeverageModal", accounts))}>{t("Change Leverage")}</Button>
          </div>
        </Col>
      </Row>
      <Row className="mt-4 border rounded-3">
        <Table borderless responsive hover className="cursor-pointer text-center mb-0">
          <thead>
            <tr>
              <th>{t("Type")}</th>
              <th>{t("Number")}</th>
              <th>{t("Currency")}</th>
              <th>{t("Balance")}</th>
              <th>{t("Leverage")}</th>
              <th>{t("Credit")}</th>
              <th>{t("Equity")}</th>
              <th>{t("Free Margin")}</th>
              <th>{t("Margin Level")}</th>
              <th>{t("Margin")}</th>
            </tr>
          </thead>
          <tbody className="border-top">
            {(loading || !accounts) 
              ? <tr><td className="py-4" colSpan="100%"><Spinner /></td></tr>
              : accounts.length === 0
                ? <tr><td colSpan="100%" className="my-2">{t(`You currently don't have any ${type} accounts.`)}</td></tr>
                : accounts.map((account, index) =>
                  <tr key={index} className="border-top"
                    onClick={() => handleAsccountSelect(account._id)}>
                    <td className="centerV">{account?.accountTypeId?.title || "-"}</td>
                    <td className="centerV">{account.login}</td>
                    <td className="centerV">{account.currency}</td>
                    <td className="centerV">${account.balance}</td>
                    <td className="centerV">1:{account.MarginLeverage}</td>
                    <td className="centerV">${account.Credit}</td>
                    <td className="centerV">{account.Equity}</td>
                    <td className="centerV">{account.MarginFree}</td>
                    <td className="centerV">{account.MarginLevel}</td>
                    <td className="centerV">{account.Margin}</td>
                  </tr>
                )
            }
          </tbody>
        </Table>
      </Row>
      <div className="mt-4">
        <CustomPagination
          {...accountsPagination}
          setSizePerPage={setSizePerPage}
          sizePerPage={sizePerPage}
          onChange={handlePageChange}
        />
      </div>
    </CardWrapper >
  );
};

export default withTranslation()(Accounts);