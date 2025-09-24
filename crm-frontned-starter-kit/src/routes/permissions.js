import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from "store/auth/profile/actions";
import { fetchAccountTypes } from "store/tradingAccounts/actions";

import { useEffect } from "react";
function usePermissions(){
  const dispatch = useDispatch();
  const { 
    rolesPermissions,
    userPermissions,
    clientPermissions,
    teamsPermissions,
    leadsPermissions,
    withdrawalsPermissions,
    depositsPermissions,
    feeGroupsPermissions,
    systemEmailsPermissions,
    emailConfigPermissions,
    symbolsPermissions,
    dictionariesPermissions,
    currencyPairsPermissions,
    conversionRatePermissions,
    markupsPermissions,
    transactionFeeGroupsPermissions,
    orderProfitPermissions,
    transactionProfitPermissions,
    companyBanksPermissions,
    userLogsPermissions,
    AccTypesPermissions,
    targetsPermissions,
    emailCampaignPermissions,
  } = useSelector((state) => ({
    rolesPermissions: state.Profile.rolesPermissions || {},
    userPermissions :state.Profile.userPermissions || {}, 
    clientPermissions :state.Profile.clientPermissions || {},
    teamsPermissions : state.Profile.teamsPermissions || {},
    leadsPermissions : state.Profile.leadsPermissions || {},
    withdrawalsPermissions : state.Profile.withdrawalsPermissions || {},
    depositsPermissions : state.Profile.depositsPermissions || {},
    feeGroupsPermissions : state.Profile.feeGroupsPermissions || {},
    systemEmailsPermissions : state.Profile.systemEmailsPermissions || {},
    emailConfigPermissions : state.Profile.emailConfigPermissions || {},
    symbolsPermissions : state.Profile.symbolsPermissions || {},
    dictionariesPermissions : state.Profile.dictionariesPermissions || {},
    currencyPairsPermissions : state.Profile.currencyPairsPermissions || {},
    conversionRatePermissions : state.Profile.conversionRatePermissions || {},
    markupsPermissions : state.Profile.markupsPermissions || {},
    transactionFeeGroupsPermissions : state.Profile.transactionFeeGroupsPermissions || {},
    orderProfitPermissions:state.Profile.orderProfitPermissions || {},
    transactionProfitPermissions:state.Profile.transactionProfitPermissions || {},
    companyBanksPermissions:state.Profile.companyBanksPermissions || {},
    userLogsPermissions:state.Profile.userLogsPermission || {},
    AccTypesPermissions:state.Profile.AccTypesPermissions || {},
    targetsPermissions:state.Profile.targetsPermissions || {},
    emailCampaignPermissions:state.Profile.emailCampaignPermissions || {},
  }));
  useEffect(()=>{
    if (localStorage.getItem("authUser")){
      dispatch(getUserProfile());
      dispatch(fetchAccountTypes());
    }
  }, []);
  return { 
    clientPermissions,
    rolesPermissions, 
    userPermissions,
    teamsPermissions,
    leadsPermissions,
    withdrawalsPermissions,
    depositsPermissions,
    feeGroupsPermissions,
    systemEmailsPermissions,
    emailConfigPermissions,
    symbolsPermissions,
    dictionariesPermissions,
    currencyPairsPermissions,
    conversionRatePermissions,
    markupsPermissions,
    transactionFeeGroupsPermissions,
    orderProfitPermissions,
    transactionProfitPermissions,
    companyBanksPermissions,
    userLogsPermissions,
    AccTypesPermissions,
    targetsPermissions,
    emailCampaignPermissions,
  };
}
export default usePermissions; 