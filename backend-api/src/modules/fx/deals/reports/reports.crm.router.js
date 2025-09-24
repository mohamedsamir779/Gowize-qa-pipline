const express = require('express');

const router = express.Router();
const {
  validationMiddleware: valMw,
  authMiddleware,
  authorizeMW: authMw,
  attachTradingAccountMW: atcAcc,
  attachCustomerMW,
  haveFxIb,
  validationPathMiddleware,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./reports.controller');
const vldtns = require('./reports.validations');

router.use(authMiddleware);

router.get('/deposits', ctrl.getDeposits);
router.get('/client-deposits', ctrl.getClientDeposits);
router.get('/client-withdrawals', ctrl.getClientWithdrawals);
router.get('/withdrawals', ctrl.getWithdrawals);
router.get('/commission', ctrl.getCommission);
router.get('/summary', ctrl.getSummary);
router.get('/lead-converted', ctrl.getLeadConverted);
router.get('/lead-call-status', ctrl.getLeadCallStatus);
router.get('/last-login', ctrl.getLastLogin);
router.get('/credit-in', ctrl.getCreditInReport);
router.get('/credit-out', ctrl.getCreditOutReport);
router.get('/unfunded-accounts', ctrl.getUnfundedAccounts);
router.get('/ib-summary', ctrl.getIbSummary);
router.get('/download/:type', ctrl.downloadReport);
router.get('/stats/:type', ctrl.getStats);

module.exports = router;
module.exports.routerName = 'reports';
