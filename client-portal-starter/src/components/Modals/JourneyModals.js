import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleCurrentModal } from "../../store/actions";
import SelectDepositMethod from "components/Forex/Deposit/SelectDepositMethod";
import SelectAccType from "components/Forex/Accounts/SelectAccType";
import UploadKycModal from "components/Journey/UploadKycModal";
import StartTrading from "components/Journey/StartTrading";
import { useHistory } from "react-router";
import KYCProgress from "components/Journey/KYCProgress";
import IbQuestionaire from "components/Journey/IbQuestionaire";
import Profiles from "components/Journey/Profiles";

function JourneyModals() {
  const dispatch = useDispatch();
  const history = useHistory();
  const currentModal = useSelector((state) => state.Layout.currentModal);
  return (
    <>
      {
        currentModal === "SubmitIndProfile" && <Profiles
          isOpen={currentModal === "SubmitIndProfile"}
          toggle={() => {
            dispatch(toggleCurrentModal(""));
          }}
          t={(str) => { return str }}
        ></Profiles>
      }
      {
        currentModal === "JourneyCreateAccount" && <SelectAccType
          isOpen={currentModal === "JourneyCreateAccount"}
          toggle={() => {
            dispatch(toggleCurrentModal(""));
          }}
        ></SelectAccType>
      }
      {
        currentModal === "UploadKycModal" && <UploadKycModal
          t={(str) => { return str }}
          show={currentModal === "UploadKycModal"}
          toggle={() => {
            dispatch(toggleCurrentModal(""));
          }}
        ></UploadKycModal>
      }
      {
        currentModal === "JourneyDeposit" && <SelectDepositMethod 
          isOpen={currentModal === "JourneyDeposit"}
          toggle={()=>{
            dispatch(toggleCurrentModal(""));
          }}
        ></SelectDepositMethod>
      }
      {
        currentModal === "KYCProgress" && <KYCProgress
          t={(str) => { return str }}
          isOpen={currentModal === "KYCProgress"}
          toggle={() => {
            dispatch(toggleCurrentModal(""));
          }}
        ></KYCProgress>
      }
      {
        currentModal === "StartTrading" && <StartTrading
          history={history}
          t={(str) => { return str }}
          show={currentModal === "StartTrading"}
          toggle={() => { 
            dispatch(toggleCurrentModal(""));
          }}
        />
      }
      {
        currentModal === "IBQuestionnaire" && <IbQuestionaire
          isOpen={currentModal === "IBQuestionnaire"}
          toggle={() => {
            dispatch(toggleCurrentModal(""));
          }}
        />
      }
    </>
  );
}

export default JourneyModals;
