import React, { useEffect } from "react";
import {
  Modal, ModalHeader, ModalBody
} from "reactstrap";
import { withTranslation } from "react-i18next";
import useModal from "hooks/useModal";
import AddForexDepositModal from "pages/Transactions/Forex/deposits/AddForexDepositModal";
import AddForexWithdrawalModal from "pages/Transactions/Forex/withdrawals/AddForexWithdrawalModal";
import AddInternalTransferModal from "pages/Transactions/Forex/internalTransfer/AddInternalTransferModal";
import AddCreditModal from "pages/Transactions/Forex/credit/AddCreditModal";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { fetchTradingAccounts } from "store/actions";
import InternalTransferModal from "pages/Transactions/Forex/internalTransfer/InternalTransferModal";
import CustomSelect from "components/Common/CustomSelect";

const options = [
  {
    value: "deposit",
    label: "Deposit"
  },
  {
    value: "withdraw",
    label: "Withdraw"
  },
  {
    value: "transfer",
    label: "Internal Transfer"
  },
  {
    value: "credit",
    label: "Credit"
  },
];

function FxTransaction(props) {
  const dispatch = useDispatch();
  const [show, toggleShow] = useModal(false);
  const [deposit, toggleDeposit] = useModal(false);
  const [withdraw, toggleWithdraw] = useModal(false);
  const [transfer, toggleTransfer] = useModal(false);
  const [credit, toggleCredit] = useModal(false);

  const tradingAccounts = useSelector((state) => state.tradingAccountReducer.accounts.docs);  
  useEffect(() => {
    if (props.clientId && !tradingAccounts) {
      dispatch(fetchTradingAccounts({ customerId: props.clientId }));
    }
  }, [props.clientId]);

  const toggleTransaction = (e) => {
    switch (e.value) {
      case "deposit":
        toggleDeposit();
        break;
      case "withdraw":
        toggleWithdraw();
        break;
      case "transfer":
        toggleTransfer();
        break;
      case "credit":
        toggleCredit();
        break;
    }
    toggleShow();
  };

  return (
    <>
      <button
        type="button"
        disabled={props.isLead}
        className="btn btn-primary waves-effect waves-light w-100 me-1"
        onClick={toggleShow}
      >
        {props.t("Add Transaction")}
      </button>
      <Modal isOpen={show} toggle={toggleShow} centered={true}>
        <ModalHeader toggle={toggleShow} tag="h4">
          {props.t("Select Transaction Type")}
        </ModalHeader>
        <ModalBody >
          <CustomSelect
            options={options}
            onChange={toggleTransaction}
          >
            <div>test</div>
          </CustomSelect>
        </ModalBody>
      </Modal>
      <div className="d-none">
        <AddForexDepositModal show={deposit} customerId={props.clientId} />
        <AddForexWithdrawalModal show={withdraw} toggleShow={toggleWithdraw} customerId={props.clientId} />
        <InternalTransferModal show={transfer} customerId={{
          _id: props.clientId,
        }} />
        <AddCreditModal show={credit} toggleShow={toggleCredit} customerId={props.clientId} />
      </div>
    </>
  );
}
export default withTranslation()(FxTransaction);