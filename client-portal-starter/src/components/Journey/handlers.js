export const JClickHandler = (step, stages, dispatch, toggleCurrentModal, isIb = false) => () => {
  if (!stages.loaded){
    // eslint-disable-next-line no-console
    console.error("Stages not loaded yet.");
    return;
  }
  
  switch (step) {
    case "IbJourney":
      if (!stages.individual.submitProfile) {
        dispatch(toggleCurrentModal("SubmitIndProfile"));
      } else if (!stages.ib.ibQuestionnaire) {
        dispatch(toggleCurrentModal("IBQuestionnaire"));
      } else if (!stages.kycUpload) {
        dispatch(toggleCurrentModal("UploadKycModal"));
      } else if (!stages.kycApproved && stages.kycUpload) {
        dispatch(toggleCurrentModal("KYCProgress"));
      }
      break;
      
    case "kycApproved":
    case "openAccount":
    case "Transfer":
    case "selectDepositMethodModal":
    case "fiatWithdraw":
    case "fiatDeposit":
    case "mt5Deposit":
    case "selectWithdrawalMethodModal":
      if (!stages.individual.submitProfile) {
        dispatch(toggleCurrentModal("SubmitIndProfile"));
      } else if (!stages.kycUpload) {
        dispatch(toggleCurrentModal("UploadKycModal"));
      } else if (!stages.kycApproved && stages.kycUpload) {
        dispatch(toggleCurrentModal("KYCProgress"));
      } else if (!stages.openAccount && !isIb) {
        //console.log({isIb});
        dispatch(toggleCurrentModal("JourneyCreateAccount"));
      } else {
        dispatch(toggleCurrentModal(step));
      }
      break;
    case "startTrading":
      if (!stages.individual.submitProfile) {
        dispatch(toggleCurrentModal("SubmitIndProfile"));
      } else if (!stages.kycUpload) {
        dispatch(toggleCurrentModal("UploadKycModal"));
      } else if (!stages.kycApproved && stages.kycUpload) {
        dispatch(toggleCurrentModal("KYCProgress"));
      } else if (!stages.openAccount) {
        dispatch(toggleCurrentModal("JourneyCreateAccount"));
      } else if (!stages.startTrading) window.location.href = "/platforms";
      break;
    default:
      break;
  }
};