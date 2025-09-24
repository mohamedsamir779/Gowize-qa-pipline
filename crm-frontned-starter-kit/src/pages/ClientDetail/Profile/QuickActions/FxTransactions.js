import React, { useState } from "react";
import {
  Dropdown, DropdownToggle, DropdownItem, DropdownMenu
} from "reactstrap";
import { withTranslation } from "react-i18next";
import useModal from "hooks/useModal";
import AddForexDepositModal from "pages/Transactions/Forex/deposits/AddForexDepositModal";
import AddForexWithdrawalModal from "pages/Transactions/Forex/withdrawals/AddForexWithdrawalModal";
import AddInternalTransferModal from "pages/Transactions/Forex/internalTransfer/AddInternalTransferModal";
import AddCreditModal from "pages/Transactions/Forex/credit/AddCreditModal";
function FxTransaction(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [deposit, toggleDeposit] = useModal(true);
  const [withdraw, toggleWithdraw] = useModal(true);
  const [transfer, toggleTransfer] = useModal(true);
  const [credit, toggleCredit] = useModal(true);

  return (
    <>
      <Dropdown
        isOpen={isOpen}
        disabled={props.isLead}
        toggle={() => setIsOpen(!isOpen)}
        className="chat-noti-dropdown"
      >
        <DropdownToggle tag="div" className={`btn btn-primary waves-effect waves-light w-100 me-1 ${props.isLead ? "disabled" : ""}`} style={{ cursor: "pointer" }}>
          <div className="py-2">{props.t("Add Transaction")}</div>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={toggleDeposit} href="#">{props.t("Deposit")}</DropdownItem>
          <DropdownItem onClick={toggleWithdraw}  href="#">{props.t("Withdraw")}</DropdownItem>
          <DropdownItem onClick={toggleTransfer}  href="#">{props.t("Internal Transfer")}</DropdownItem>
          <DropdownItem onClick={toggleCredit}  href="#">{props.t("Credit")}</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div className="d-none">
        <AddForexDepositModal show={deposit} customerId={props.clientId} />
        <AddForexWithdrawalModal show={withdraw} customerId={props.clientId} />
        <AddInternalTransferModal show={transfer} customerId={props.clientId} />
        <AddCreditModal show={credit} customerId={props.clientId} />
      </div>
    </>
  );
}
export default withTranslation()(FxTransaction);