const { CUSTOMER_SUB_PORTALS } = require("./constants");

function documentJourneyValidation(clientData, portal) {
  if (
    clientData.fx &&
    clientData.fx.isIb &&
    clientData.stages &&
    portal == CUSTOMER_SUB_PORTALS.IB
  ) {
    if (!clientData.stages.ib.submitProfile) {
      return false;
    } else if (!clientData.stages.ib.ibQuestionnaire) {
      return false;
    } else return true;
  }
  if (
    clientData.fx &&
    clientData.fx.isClient &&
    clientData.stages &&
    portal == CUSTOMER_SUB_PORTALS.LIVE
  ) {
    if (!clientData.stages.individual.submitProfile) {
      return false;
    } else if (!clientData.stages.openAccount) {
      return true;
    } else return true;
  }
  if (
    clientData.fx &&
    clientData.fx.isInvestor &&
    clientData.stages &&
    portal == CUSTOMER_SUB_PORTALS.INVESTOR
  ) {
    if (!clientData.stages.individual.submitProfile) {
      return false;
    } else if (!clientData.stages.investor.becomeInvestor) {
      return false;
    } else return true;
  }
  if (
    clientData.fx &&
    clientData.fx.isSp &&
    clientData.stages &&
    portal == CUSTOMER_SUB_PORTALS.SP
  ) {
    if (!clientData.stages.individual.submitProfile) {
      return false;
    }
    // else if (!clientData.stages.investor.becomeInvestor) {
    //   return false;
    // }
    else return true;
  }
}
module.exports = documentJourneyValidation;
