import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "../../../store/actions";
import SelectDepositMethodModal from "./SelectDepositMethodModal";
import Deposit from "components/Deposit/Deposit";

function DepositsModal() {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
    modalData: state.Layout.modalData,
  }));
  return (
    <>
      {(currentModal === "fiatDeposit" || currentModal === "mt5Deposit" ) && <Deposit
        isOpen={(currentModal === "fiatDeposit") || (currentModal === "mt5Deposit")}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
        type={currentModal}
      ></Deposit>}
      {currentModal === "selectDepositMethodModal" && <SelectDepositMethodModal
        isOpen={currentModal === "selectDepositMethodModal"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></SelectDepositMethodModal>}

    </>
  );
}

export default DepositsModal;
