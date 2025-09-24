import { all, fork } from "redux-saga/effects";

import LayoutSaga from "./layout/saga";
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import resetPasswordSaga from "./auth/resetPassword/saga";
import twoFactorAuthSaga from "./auth/twoFactorAuth/saga";
import checkEmailSaga from "./auth/checkEmail/saga";
import socketsSaga from "./sockets/saga";
import assetsSaga from "./assets/saga";
import documentsSaga from "./documents/saga";
import logsSaga from "./logs/saga";
import dictSaga from "./dictionary/saga";
import conversionRateSaga from "./conversionRates/saga";
import subscriptionsSaga from "./subscriptions/saga";
import notificationsSaga from "./notifications/saga";

export default function* sharedSaga() {
  yield all([
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(LayoutSaga),
    fork(socketsSaga),
    fork(documentsSaga),
    fork(assetsSaga),
    fork(resetPasswordSaga),
    fork(twoFactorAuthSaga),
    fork(logsSaga),
    fork(checkEmailSaga),
    fork(dictSaga),
    fork(conversionRateSaga),
    fork(subscriptionsSaga),
    fork(notificationsSaga),
  ]);
}