import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { fetchTradingAccounts } from "store/actions";
import { CardBody } from "reactstrap";
import useModal from "hooks/useModal";
import CreateMT5 from "./CreateMT5";
import ChangeLeverage from "./ChangeLeverage";
import ChangePassword from "./ChangePassword";
import LinkMT5 from "./LinkMT5";
import ChangeType from "./ChangeType";
import ChangeAccess from "./ChangeAccess";

const TradingAccountsQuickActions = ({ clientId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTradingAccounts({
      customerId: clientId,
    }));
  }, []);

  const [showAddModal, setShowAddModal] = useModal();
  const [showAccessModal, setShowAccessModal] = useModal();
  const [showLinkModal, setShowLinkModal] = useModal();
  const [showPassModal, setShowPassModal] = useModal();
  const [showTypeModal, setShowTypeModal] = useModal();
  const [showLeverageModal, setShowLeverageModal] = useModal();
  return (
    <CardBody className="quick-actions-card">
      <p className="quick-actions-heading">{t("Trading Accounts")}</p>
      <div className="btn-container">
        <CreateMT5
          show={showAddModal}
          toggle={setShowAddModal}
          customerId={clientId}
        />
        {/* <ChangeAccess
          show={showAccessModal}
          toggle={setShowAccessModal}
        /> */}
        <LinkMT5
          show={showLinkModal}
          toggle={setShowLinkModal}
          customerId={clientId}
        />
        {/* <ChangePassword
          show={showPassModal}
          toggle={setShowPassModal}
        /> */}
        <ChangeType
          show={showTypeModal}
          toggle={setShowTypeModal}
        />
        <ChangeLeverage
          show={showLeverageModal}
          toggle={setShowLeverageModal}
        />
      </div>
    </CardBody>
  );
};

export default TradingAccountsQuickActions;