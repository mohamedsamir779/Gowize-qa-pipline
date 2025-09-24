import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "../../../store/actions";
import TransferModal from "./Transfer";

function WalletModals() {
  const dispatch = useDispatch();
  const { currentModal } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
  }));
  return (
    <>
      {
        currentModal === "Transfer" && <TransferModal 
          isOpen={currentModal === "Transfer"}
          toggle={() => dispatch(toggleCurrentModal(""))}
        ></TransferModal>
      }
    </>
  );
}

export default WalletModals;
