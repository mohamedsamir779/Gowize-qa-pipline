const express = require('express');

const router = express.Router();
const {
  validationMiddleware: valMw,
  authMiddleware,
  authorizeMW: authMw,
  attachTradingAccountMW: atcAcc,
  authorizeMW,
  validationPathMiddleware,
  attachCustomerMW,
  checkTeamAndAddMembers,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./transaction.controller');
const vldtns = require('./transaction.validations');

router.use(authMiddleware);

// deposit apis
router.post('/deposits', authMw('deposits', 'create'), valMw(vldtns.deposit), atcAcc(false), ctrl.makeDeposit);
router.get('/deposits', authMw('deposits', ['get', 'getAssigned']), checkTeamAndAddMembers, valMw(vldtns.listing, true), ctrl.getDeposits);
router.get('/deposits-gateways', authMw('deposits', ['get', 'getAssigned']), ctrl.getDepositGateways);
router.patch('/deposit/:id/approve', authorizeMW('deposits', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), ctrl.approveDeposit);
router.patch('/deposit/:id/reject', authorizeMW('deposits', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), ctrl.rejectDeposit);

// withdrawals apis
router.post('/withdrawals', authMw('withdrawals', 'create'), valMw(vldtns.withdrawl), atcAcc(false), ctrl.makeWithdrawal);
router.get('/withdrawals', authMw('withdrawals', ['get', 'getAssigned']), checkTeamAndAddMembers, valMw(vldtns.listing, true), ctrl.getWithdrawals);
router.get('/withdrawals-gateways', authMw('withdrawals', ['get', 'getAssigned']), ctrl.getWithdrawalGateways);
router.patch('/withdraw/:id/approve', authorizeMW('withdrawals', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), ctrl.approveWithdraw);
router.patch('/withdraw/:id/reject', authorizeMW('withdrawals', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), ctrl.rejectWithdraw);

// Internal Transfer Endpoints.
router.post('/internalTransfers', authMw('internalTransfers', 'create'), valMw(vldtns.internalTransfer), ctrl.makeInternalTransfer);
router.get('/internalTransfers', authMw('internalTransfers', ['get', 'getAssigned']), checkTeamAndAddMembers, valMw(vldtns.listing, true), ctrl.getInternalTransfers);
router.patch('/internalTransfers/:id/approve', authorizeMW('internalTransfers', 'actions'), validationPathMiddleware(vldtns.update), ctrl.approveInternalTransfer);
router.patch('/internalTransfers/:id/reject', authorizeMW('internalTransfers', 'actions'), validationPathMiddleware(vldtns.update), ctrl.rejectInternalTransfer);

// credit in out apis
router.post('/credits', authMw('credits', 'create'), valMw(vldtns.credit), atcAcc(false), ctrl.makeCredit);
router.get('/credits', authMw('credits', ['get', 'getAssigned']), checkTeamAndAddMembers, valMw(vldtns.listing, true), ctrl.getCredits);

module.exports = router;
module.exports.routerName = 'fxtransactions';
