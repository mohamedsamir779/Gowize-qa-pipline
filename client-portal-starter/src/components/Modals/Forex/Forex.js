import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, toggleCurrentModal } from "../../../store/actions";
import CreateAccModal from "components/Forex/Accounts/CreateAccModal";
import LeverageModal from "pages/Forex/Accounts/LeverageModal";
import SelectDepositMethod from "components/Forex/Deposit/SelectDepositMethod";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function ForexModals() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { currentModal, modalData } = useSelector((state) => ({
    currentModal: state.Layout.currentModal,
    modalData: state.Layout.modalData,
  }));
  return (
    <>
      {currentModal === "CreateAccModal" && <CreateAccModal
        type={modalData}
        isOpen={currentModal === "CreateAccModal"}
        toggle={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></CreateAccModal>}

      {currentModal === "LeverageModal" && <LeverageModal
        accounts={modalData}
        isOpen={currentModal === "LeverageModal"}
        toggle={() => {
          dispatch(toggleCurrentModal(""));
        }}
      ></LeverageModal>}

      {currentModal === "ForexDeposit" && <SelectDepositMethod
        isOpen={currentModal === "ForexDeposit"}
        toggle={()=>{
          dispatch(toggleCurrentModal(""));
        }}
      >
      </SelectDepositMethod>}
    </>
  );
}

export default ForexModals;
