import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "../../../store/actions";
import FiatWithdraw from "components/Withdraw/Fiat/FiatWithdraw";
import Mt5Withdraw from "components/Withdraw/MT5/Mt5";
import SelectWithdrawalMethodModal from "./SelectWithdrawalMethodModal";

function WithdrawModals() {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
    modalData: state.Layout.modalData,
  }));
  return (
    <>
      {currentModal === "fiatWithdraw" && <FiatWithdraw
        isOpen={currentModal === "fiatWithdraw"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></FiatWithdraw>}
      {currentModal === "mt5Withdraw" && <Mt5Withdraw
        isOpen={currentModal === "mt5Withdraw"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      >
      </Mt5Withdraw>}
      {currentModal === "selectWithdrawalMethodModal" && <SelectWithdrawalMethodModal
        isOpen={currentModal === "selectWithdrawalMethodModal"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></SelectWithdrawalMethodModal>}
    </>
  );
}

export default WithdrawModals;
