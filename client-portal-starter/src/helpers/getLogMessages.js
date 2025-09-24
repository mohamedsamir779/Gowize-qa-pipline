import { 
  LOG_TYPES,
} from "common/constants";

export const getLogMessage = (data = {}, t = (m) => m) => {
  const {
    type,
    content = {},
    details = {}
  } = data;
  const { ip, error } = details;
  let message = "";
  if (error) {
    message = error;
    return message;
  }
  const { 
    amount,
    currency,
    status,
    symbol,
    mPrice,
    fromAsset,
    toAsset,
  } = content;
  switch (type) {
    case LOG_TYPES.REGISTER:
      message = `${t("You have registered from IP")}: ${ip}`;  
      break;
    case LOG_TYPES.LOGIN: 
      message = `${t("You have logged in from IP")}: ${ip}`;
      break;
    case LOG_TYPES.UPDATE_PROFILE:
      message = `${t("You have updated your profile")}`;
      break;
    case LOG_TYPES.RESET_PASSWORD:
      message = `${t("You have changed your password from IP")}: ${ip}`;
      break;
    case LOG_TYPES.DEPOSIT:
      message = `${t("You have made a deposit of")} ${amount?.$numberDecimal || amount} ${currency} ${t("and it is")} ${status}`;
      break;
    case LOG_TYPES.WITHDRAW:
      message = `${t("You have made a withdrawal of")} ${amount?.$numberDecimal || amount} ${currency} ${t("and it is")} ${status}`;
      break;
    case LOG_TYPES.ORDER:
      message = `${t("You have placed an order of")} ${amount} ${symbol} ${t("for price")} ${mPrice} ${t("and it is")} ${status}`;
      break;
    case LOG_TYPES.CONVERT:
      message = `${t("You have converted")} ${amount} ${fromAsset} ${t("to")} ${toAsset}`;
      break;
    // bank accs
    case LOG_TYPES.ADD_BANK_ACCOUNT:
      message = `${t(`New ${content.bankName} bank account added`)}`;
      break;
    case LOG_TYPES.EDIT_BANK_ACCOUNT:
      message = `${t(`${content.bankName} bank info changed`)}`;
      break;
    case LOG_TYPES.DELETE_BANK_ACCOUNT:
      message = `${t("A bank account has been deleted")}`;
      break;
    //docs
    case LOG_TYPES.CHANGE_DOC_STATUS:
      message = `${t(`${details.type} document has been ${details.status} ${details.rejectionReason ? `, reason is ${details.rejectionReason}` : ""}`)}`;
      break;
    case LOG_TYPES.OVERWRITE_DOCS:
      message = `${t("Document(s) has been overwritten")}`;
      break;
    case LOG_TYPES.UPLOAD_DOCS:
      message = `${content.type } ${t("document(s) has been uploaded")}`;
      break;
    case LOG_TYPES.PROFILE_COMPLETED:
      message = `${t("You have completed your required profile info")}` ;
      break;
      // 2fa
    case LOG_TYPES.ENABLE_2FA:
      message = t("You have activated two factor authentication");
      break;
    case LOG_TYPES.DISABLE_2FA:
      message = t("You have disabled two factor authentication") ;
      break;
      // requests
    case LOG_TYPES.CREATE_ACCOUNT_REQUEST:
      message = t(`You have requested a new trading account. request Id: ${content.requestId}`);
      break;
    case LOG_TYPES.UPDATE_ACCOUNT_REQUEST:
      message = t(`Your request for new trading account has been ${status}${status === "APPROVED" ? `, login: ${content.login}` : ""}`);
      break;
    case LOG_TYPES.IB_REQUEST:
      message = t(`You have requested to become a partner. request Id: ${content.requestId}`) ;
      break;
    case LOG_TYPES.UPDATE_IB_REQUEST:
      message = t(`Your partnership request has been ${status}`) ;
      break;
    case LOG_TYPES.LEVERAGE_REQUEST:
      message = t(`You have requested to change the leverage from ${content.from} to ${content.to} on ${content.login}. request Id: ${content.requestId}`) ;
      break;
    case LOG_TYPES.UPDATE_LEVERAGE_REQUEST:
      message = t(`Your change leverage request from ${content.from} to ${content.to} on ${content.login} has been ${status}`) ;
      break;
      // create trading acc
    case LOG_TYPES.ACCOUNT_CREATED:
      message = t(`New trading account created ${content.login} (${content.platform})`) ;
      break;
      // transactions
    case LOG_TYPES.FX_DEPOSIT:
      message = t(`You have a pending ${content.gateway} deposit of amount ${content.amount} to account ${content.login} (${content.platform})`) ;
      break;
    case LOG_TYPES.FX_DEPOSIT_UPDATE:
      message = t(`${content.gateway} deposit of amount ${content.amount} to account ${content.login} (${content.platform}) is ${content.status}`) ;
      break;
    case LOG_TYPES.FX_WITHDRAW:
      message = t(`You have a pending ${content.gateway} withdraw of amount ${content.amount} from account ${content.login} (${content.platform})`) ;
      break;
    case LOG_TYPES.FX_WITHDRAW_UPDATE:
      message = t(`${content.gateway} withdraw of amount ${content.amount} to account ${content.login} (${content.platform}) is ${content.status}`) ;
      break;
    case LOG_TYPES.FX_INTERNAL_TRANSFER:
      message = t(`You have a pending internal transfer of amount ${content.amount} from ${content.from} to ${content.to}`) ;
      break;
    case LOG_TYPES.FX_INTERNAL_TRANSFER_UPDATE:
      message = t(`internal transfer of amount ${content.amount} from ${content.from} to ${content.to} is ${content.status}`) ;
      break;
    case LOG_TYPES.FX_CREDIT_UPDATE:
      message = t(`You have been ${content.type === "CREDIT_IN" ? `credited ${content.amount} to` : `debited ${-content.amount} from`} account ${content.login}`) ;
      break;
    case LOG_TYPES.FX_DEPOSIT_AUTO:
      message = t(`You have recieved a ${content.gateway} deposit of amount ${content.amount} to account ${content.login} (${content.platform})`) ;
      break;
    case LOG_TYPES.FX_WITHDRAW_AUTO:
      message = t(`You have a withdrawn an amount of ${content.amount} from account ${content.login} (${content.platform}) via ${content.gateway}`) ;
      break;
    case LOG_TYPES.FX_INTERNAL_TRANSFER_AUTO:
      message = t(`Internally transfered an amount of ${content.amount} from ${content.from} to ${content.to}`) ;
      break;  
  }
  return message;
};

export const getHeaderStatusMessage = (data, t = (m) => m) => {
  const {
    type,
    customerId,
    content = {},
    details = {}
  } = data;
  const { ip, error, to, } = details;
  const { firstName, lastName } = customerId;
  let message = "";
  let header = "";
  let status = "";
  if (error) {
    message = error;
    return message;
  }
  const name = `${firstName} ${lastName}`;
  const { 
    amount,
    currency,
    status: contentStatus,
    symbol,
    fromAsset,
    toAsset,
    gateway,
    type: orderType,
    side,
  } = content;
  switch (type) {
    case LOG_TYPES.REGISTER:
      header = `${t("From IP")}: ${ip}`;
      status = t("Complete");
      message = `${t("You have registered on our portal")}`;  
      break;
    case LOG_TYPES.LOGIN: 
      header = `${t("Login from IP")}: ${ip}`;
      status = t("Complete");
      message = `${t("You have logged into portal")}`;
      break;
    case LOG_TYPES.UPDATE_PROFILE:
      message = `${name} ${t("has updated their profile")}`;
      break;
    case LOG_TYPES.CONVERT_CUSTOMER:
      header = `${t("Login from IP")}: ${ip}`;
      status = t("Complete");
      message = `${t("You have logged into portal")}`;
      message = `${name} ${t("has been converted to")} ${t(to)}`;
      break;
    case LOG_TYPES.RESET_PASSWORD:
      header = `${t("Password has been changed from")}: ${ip}`;
      status = t("Complete");
      message = `${name} ${t("has changed password from IP")} ${ip}`;
      break;
    case LOG_TYPES.DEPOSIT:
    case LOG_TYPES.WITHDRAW:
      header = t(gateway);
      status = t(contentStatus || "PENDING");
      message = `${amount.$numberDecimal || amount} ${currency}`;
      break;
    case LOG_TYPES.ORDER:
      header = t(`${orderType} ${side}`);
      status = t(contentStatus || "Completed");
      message = `${amount.$numberDecimal || amount} ${symbol}`;
      break;
    case LOG_TYPES.CONVERT:
      header = t(`From ${fromAsset} to ${toAsset}`);
      status = t(contentStatus || "Completed");
      message = `${amount.$numberDecimal || amount} ${fromAsset}`;
      break;
    // bank accs
    case LOG_TYPES.ADD_BANK_ACCOUNT:
      header = `${t(`Bank; ${content.bankName}`)}`;
      message = `${t("New bank has been added")}`;
      break;
    case LOG_TYPES.EDIT_BANK_ACCOUNT:
      header = `${t(`Bank; ${content.bankName}`)}`;
      message = `${t("bank info has changed")}`;
      break;
    case LOG_TYPES.DELETE_BANK_ACCOUNT:
      message = `${t("A bank account has been deleted")}`;
      break;
    //docs
    case LOG_TYPES.CHANGE_DOC_STATUS:
      status = t(details.status);
      header = `${t(`Document; ${details.type}`)}`;
      message = `${t("Document status update")} ${t(`${details.rejectionReason ? `, rejection reason ${details.rejectionReason}` : ""}`)}`;
      break;
    case LOG_TYPES.OVERWRITE_DOCS:
      message = `${t("Document(s) has been overwritten")}`;
      break;
    case LOG_TYPES.UPLOAD_DOCS:
      header = `${t(`Document; ${content.type}`)}`;
      message = `${t("document(s) has been uploaded")}`;
      break;
    case LOG_TYPES.PROFILE_COMPLETED:
      message = `${t("You have completed your required profile info")}` ;
      break;    
  }
  return {
    message,
    status,
    header,
  };
};