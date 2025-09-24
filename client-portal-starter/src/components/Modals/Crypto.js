import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "../../store/actions";
import AddBankAccountModal from "../BankAccounts/AddBankAccountModal";
import CryptoDeposit from "../Deposit/Crypto/CryptoDeposit";
import QuickBuySellModal from "../QuickBuy";
import Convert from "../Convert/Convert";

import CryptoWithdraw from "../Withdraw/Crypto/CryptoWithdraw";
import Details from "components/QuickBuy/Details";

function CryptoModals() {
  const dispatch = useDispatch();
  const { currentModal, modalData } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
    modalData: state.Layout.modalData,
  }));
  return (
    <>
      {currentModal === "cryptoDeposit" && <CryptoDeposit
        isOpen={currentModal === "cryptoDeposit"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></CryptoDeposit>}
      {currentModal === "transfer" && <Convert
        isOpen={currentModal === "transfer"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></Convert>}
      {currentModal === "AddBankAccountModal" &&
      <AddBankAccountModal
        isOpen={currentModal === "AddBankAccountModal"}
        toggleOpen={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></AddBankAccountModal>}
      {currentModal === "cryptoWithdraw" &&   
        <CryptoWithdraw
          isOpen={currentModal === "cryptoWithdraw"}
          toggleOpen={() => {
            dispatch(toggleCurrentModal(""));
          }}
        ></CryptoWithdraw>}
    
      {modalData && currentModal === "quickBuy" && (
        <QuickBuySellModal
          isOpen={currentModal === "quickBuy"}
          toggleOpen={() => {
            dispatch(toggleCurrentModal("", modalData));
          }}
          type="buy"
          market={modalData}
        ></QuickBuySellModal>
      )}
      {modalData && currentModal === "quickSell" && (
        <QuickBuySellModal
          isOpen={currentModal === "quickSell"}
          toggleOpen={() => {
            dispatch(toggleCurrentModal("", modalData));
          }}
          type="sell"
          market={modalData}
        ></QuickBuySellModal>
      )}

      {modalData && currentModal === "sellBuyDetail" && (
        <Details
          isOpen={currentModal === "sellBuyDetail"}
          toggleOpen={() => {
            dispatch(toggleCurrentModal("", modalData));
          }}
          type="detail"
          market={modalData}
        ></Details>
      )}
    </>
  );
}

export default CryptoModals;
