import {
  call, put, takeEvery, delay, takeLatest
} from "redux-saga/effects";
import * as clientApi from "apis/client";
import {
  fetchClientsSuccess,
  apiError, 
  addNewClientSuccess,
  
  fetchClientDetailsSuccess,
  fetchClientDetailsFail,
  fetchClientDetailsClear,

  editClientDetailsSuccess,
  addModalClear,
  fetchClientStagesEnd,
  assignAgentToClientSuccess,
  updateEmploymentStatusSuccess,
  updateFinancialInfoSuccess,
  updateEmploymentInfoFail,
  updateFinancialInfoFail,
  resetPasswordClear,
  editClientDetailsFail,
  clientForgotPasswordClear,
  //ib
  fetchReferralsSuccess,
  fetchIbParentsSuccess,
  fetchStatementSuccess,
  fetchStatementDealsSuccess,
  linkClientSuccess,
  unlinkIbSuccess,
  convertToIBClear,
  convertToClientClear,
  fetchClientsFailed,
  updateClientCallStatusFailed,
  updateClientCallStatusSuccess,
  addNewIbSuccess,
} from "./actions";
import { 
  ADD_NEW_CLIENT, 
  FETCH_CLIENTS_START,
  FETCH_CLIENT_STAGES_START,
  FETCH_CLIENT_DETAILS_REQUESTED,
  EDIT_CLIENT_DETAILS_REQUESTED,
  ASSIGN_AGENT_START,
  UPDATE_EMPLOYMENT_INFO_START,
  UPDATE_FINANCIAL_INFO_START,
  CHANGE_PASSWORD_START,
  SEND_EMAIL_TO_RESET_PASSWORD_START,
  CLIENT_FORGOT_PASSWORD_START,
  CLIENT_DISABLE_2FA_START,
  CLIENT_DISABLE_2FA_SUCCESS,
  CLIENT_DISABLE_2FA_FAIL,
  // ib
  FETCH_REFERRALS_START,
  FETCH_IB_PARENTS_START,
  FETCH_STATEMENT_START,
  FETCH_STATEMENT_DEALS_START,
  LINK_CLIENT_START,
  UNLINK_IB_START,
  CONVERT_TO_IB_SUCCESS,
  CONVERT_TO_IB_FAIL,
  CONVERT_TO_IB_START,
  UNLINK_CLIENTS_START,
  CONVERT_TO_CLIENT_SUCCESS,
  CONVERT_TO_CLIENT_FAIL,
  CONVERT_TO_CLIENT_START,
  GET_MT5_MARKUP_SUCCESS,
  GET_MT5_MARKUP_FAIL,
  GET_MT5_MARKUP_START,
  UPDATE_CLIENT_CALL_STATUS,
  ADD_NEW_IB,
} from "./actionsType"; 
import { showSuccessNotification, showErrorNotification } from "store/notifications/actions";
function *fetchClients(params) {
  try {
    const data = yield call(clientApi.getClients, params);
    yield put(fetchClientsSuccess(data));
  } catch (error){
    yield put(fetchClientsFailed(error));
    yield put(apiError, "Oppos there is a problem in the server");
  }
}

function * addNewClient({ payload }) {
  try {
    const data = yield call(clientApi.addClient, payload);
    const { status } = data;
    const { result:client } = data;
    if (status){
      yield put(addNewClientSuccess(client));
      yield put(showSuccessNotification("Client is added successfully"));
      yield delay(1000);
      yield put(addModalClear());
    }
  } catch (error){
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}

function * addNewIb({ payload }) {
  try {
    const data = yield call(clientApi.addIb, payload);
    const { status } = data;
    const { result: ib } = data;
    if (status){
      yield put(addNewIbSuccess(ib));
      yield put(showSuccessNotification("IB added successfully"));
      yield delay(1000);
      yield put(addModalClear());
    }
  } catch (error){
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}

function * fetchClientDetails(params){
  try {
    const data = yield call(clientApi.getClientById, params);
    yield put(fetchClientDetailsSuccess(data));
    yield delay(2000);
    yield put(fetchClientDetailsClear());
  } catch (error){
    yield put(fetchClientDetailsFail({ error: error.message }));
  }
}

function * editClientDetails(params){
  try {
    yield call(clientApi.updateClientDetails, params);
    const { payload } = params;
    const { values } = payload;
    yield put(editClientDetailsSuccess(values));
    yield put(showSuccessNotification("Client updated sucessfully!"));

    // yield delay(2000);
    // yield put(editClientDetailsClear());
  } catch (error){
    yield put(showErrorNotification(error.message || "Error updating client"));
    yield put(editClientDetailsFail({ errror:error.message }));
  }
}
function * assignAgent (params){
  
  const { payload :{ agent }  } = params;
  const { payload: { body } } = params;
  const { clientIds } = body;
  try {
    
    yield put(assignAgentToClientSuccess({
      clientIds,
      agent
    }));
  } catch (error){
    yield put(showErrorNotification("Error happened while assign the agent"));
  }
  
}
function * fetchClientStages(params){
  try {
    const data = yield call(clientApi.getClientById, params);
    if (data && data.result && data.result.stages) {
      yield put(fetchClientStagesEnd(data.result.stages));
    }
  } catch (error){ }
}
function * updateClientFinancialInfo ({ payload }){
  try {
    const data =  yield call(clientApi.updateClientFinancialInfo, payload);
    const { status } = data;
    if (status){
      yield put(updateFinancialInfoSuccess(payload));
      yield put(showSuccessNotification("Financial Info of the client has been updated"));
    }
  } catch (error){
    yield put(updateFinancialInfoFail());
    yield put(showErrorNotification("Error happened while updating financial info"));
  }
}
function * updateClientEmploymentInfo ({ payload }){
  try {

    const data =  yield call(clientApi.updateClientEmploymentStatus, payload);
    
    const { status } = data;
    if (status) {
      yield put(updateEmploymentStatusSuccess(payload));
      yield put(showSuccessNotification("Employpment Info has been updated successfully"));
    }
  } catch (error){
    yield put(updateEmploymentInfoFail());
    yield put(showErrorNotification("Error happened while updating employment info"));
  }
}
function * changePassword({ payload }){
  try {
    const data =  yield call(clientApi.resetPassowrd, payload);
    const { status } = data;
    if (status){
      yield put(showSuccessNotification("Password has been updated successfully"));
      yield delay(2000);
      yield put(resetPasswordClear());
    }
  } catch (error){
    yield put(showErrorNotification("Error Happend while changing password"));
  }
}

function * disable2FA({ payload }){
  try {
    const res =  yield call(clientApi.disable2FA, payload);
    if (res){
      yield put({
        type: CLIENT_DISABLE_2FA_SUCCESS,
      });
      yield put(showSuccessNotification("Two factor authentication disabled successfully"));
    }
  } catch (error){
    yield put({
      type: CLIENT_DISABLE_2FA_FAIL,
    });
    yield put(showErrorNotification(error.message));
  }
}

function * sendEmail({ payload }){
  try {
    // const data = yield call(clientApi.sendingEmailWithPasswordResetLink, payload);
    // const { status } = data;
    // if (status){
    //   yield put(showSuccessNotification("Email has been sent successfully"));
    //   delay(2000);
    //   yield put(sendEmailModalClear());
    // }
  } catch (error){
    yield put(showErrorNotification("Error happened while sending mail"));
  }
}

function * forgotPassword({ payload }){
  try {
    const data = yield call(clientApi.forgotPassword, payload);
    const { status } = data;
    if (status){
      yield put(showSuccessNotification("Reset email has been sent successfully"));
      delay(2000);
      yield put(clientForgotPasswordClear());
    }
  } catch (error){
    yield put(clientForgotPasswordClear());
    yield put(showErrorNotification("Error happened while sending mail"));
  }
}

function * fetchReferrals(params) {
  try {
    const { result: referrals } = yield call(clientApi.getReferrals, params);
    yield put(fetchReferralsSuccess(referrals));
  } catch (error){
    yield put(apiError, "Opps there is a problem in the server");
  }  
}

function * fetchIbParents(params) {
  try {
    const { result: parents } = yield call(clientApi.getIbParents, params);
    yield put(fetchIbParentsSuccess(parents));
  } catch (error){
    yield put(apiError, "Opps there is a problem in the server");
  }  
}

function * fetchStatement(params) {
  try {
    const { result: referrals } = yield call(clientApi.getStatement, params);
    yield put(fetchStatementSuccess(referrals));
  } catch (error){
    yield put(apiError, "Opps there is a problem in the server");
  }
}

function * fetchStatementDeals(params) {
  try {
    const { result: referrals } = yield call(clientApi.getStatementDeals, params);
    yield put(fetchStatementDealsSuccess(referrals));
  } catch (error){
    yield put(apiError, "Opps there is a problem in the server");
  }
}

function * linkClient ({ payload }){
  try {
    const { message } = yield call(clientApi.linkClient, payload);
    yield put(linkClientSuccess(message));
    yield put(showSuccessNotification("Customer linked successfully."));
  } catch (error){
    yield put(showErrorNotification( error?.message || "Error happened while linking customer."));
  }
}

function * unlinkIb ({ payload }) {
  try {
    const { message } = yield call(clientApi.unlinkIb, payload);
    yield put(unlinkIbSuccess(message));
    yield put(showSuccessNotification("Client unlinked successfully."));
  } catch (error){
    yield put(showErrorNotification("Error happened while unlinking client."));
  }
}

function * unlinkClients ({ payload }) {
  try {
    const { message } = yield call(clientApi.unlinkClients, payload);
    yield put(unlinkIbSuccess(message));
    yield put(showSuccessNotification("Clients unlinked successfully."));
  } catch (error){
    yield put(showErrorNotification("Error happened while unlinking clients."));
  }
}

function * convertToIB({ payload }) {
  try {
    const res =  yield call(clientApi.convertToIB, payload);
    if (res){
      yield put({
        type: CONVERT_TO_IB_SUCCESS,
      });
      delay(2000);
      yield put(convertToIBClear());
      yield put(showSuccessNotification("Converted client to ib successfully"));
    }
  } catch (error){
    yield put({
      type: CONVERT_TO_IB_FAIL,
    });
    yield put(showErrorNotification(error.message));
  }
}

function* convertToClientStart({ payload }) {
  try {
    const res =  yield call(clientApi.convertToClient, payload);
    if (res){
      yield put({
        type: CONVERT_TO_CLIENT_SUCCESS,
      });
      delay(2000);
      yield put(convertToClientClear());
      yield put(showSuccessNotification("Converted demo client to live client successfully"));
    }
  } catch (error){
    yield put({
      type: CONVERT_TO_CLIENT_FAIL,
    });
    yield put(showErrorNotification(error.message));
  }
}

function* getMT5Markups({ payload }) {
  console.log("payload", payload);
  try {
    const res =  yield call(clientApi.getMT5Markups, payload);
    if (res){
      yield put({
        type: GET_MT5_MARKUP_SUCCESS,
        payload: res,
      });
      delay(2000);
    }
  } catch (error) {
    yield put({
      type: GET_MT5_MARKUP_FAIL
    });
    yield put(showErrorNotification(error.message));
  }
}

function* updateCallStatusSaga({ payload }) {
  try {
    const data = yield call(clientApi.updateCallStatus, payload);
    const { isSuccess } = data;
    if (isSuccess) {
      yield put(updateClientCallStatusSuccess(payload.clientId, payload.callStatus));
      yield put(showSuccessNotification("Call status has been updated successfully!"));
    } else {
      yield put(updateClientCallStatusFailed(new Error(data.message || "Call status could not be updated!")));
      yield put(showErrorNotification(data.message || "Call status could not be updated!"));
    }
  }
  catch (error) {
    yield put(updateClientCallStatusFailed(error));
    yield put(showErrorNotification(error.message || "Call status could not be updated!"));
  }
}

function* clientSaga() {
  yield takeEvery(FETCH_CLIENTS_START, fetchClients);
  yield takeEvery(ADD_NEW_CLIENT, addNewClient);
  yield takeEvery(ADD_NEW_IB, addNewIb);
  yield takeEvery(FETCH_CLIENT_DETAILS_REQUESTED, fetchClientDetails);
  yield takeEvery(EDIT_CLIENT_DETAILS_REQUESTED, editClientDetails);
  yield takeEvery(FETCH_CLIENT_STAGES_START, fetchClientStages);
  yield takeEvery(ASSIGN_AGENT_START, assignAgent);
  yield takeEvery(UPDATE_FINANCIAL_INFO_START, updateClientFinancialInfo);
  yield takeEvery(UPDATE_EMPLOYMENT_INFO_START, updateClientEmploymentInfo);
  yield takeEvery(CHANGE_PASSWORD_START, changePassword);
  yield takeEvery(SEND_EMAIL_TO_RESET_PASSWORD_START, sendEmail);
  yield takeEvery(CLIENT_FORGOT_PASSWORD_START, forgotPassword);
  yield takeEvery(CLIENT_DISABLE_2FA_START, disable2FA);
  //ib
  yield takeEvery(FETCH_REFERRALS_START, fetchReferrals);
  yield takeEvery(FETCH_IB_PARENTS_START, fetchIbParents);
  yield takeEvery(FETCH_STATEMENT_START, fetchStatement);
  yield takeEvery(FETCH_STATEMENT_DEALS_START, fetchStatementDeals);
  yield takeEvery(LINK_CLIENT_START, linkClient);
  yield takeEvery(UNLINK_IB_START, unlinkIb);
  yield takeEvery(UNLINK_CLIENTS_START, unlinkClients);
  // convert client actions
  yield takeEvery(CONVERT_TO_IB_START, convertToIB);
  // convert client to live account
  yield takeEvery(CONVERT_TO_CLIENT_START, convertToClientStart);

  yield takeLatest(GET_MT5_MARKUP_START, getMT5Markups);
  yield takeLatest(UPDATE_CLIENT_CALL_STATUS, updateCallStatusSaga);
}

export default clientSaga;