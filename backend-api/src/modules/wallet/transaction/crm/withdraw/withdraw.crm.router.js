const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW, attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../transaction.validations');

const WithdrawController = require('./withdraw.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('withdrawals', 'create'), validationMiddleware(vldtns.withdrawBasic), attachCustomerMW(false), WithdrawController.basicWithdraw);
router.post('/crypto', validationMiddleware(vldtns.withdrawCrypto), WithdrawController.cryptoWithdraw);

router.get('/', authorizeMW('withdrawals', ['get', 'getAssigned']), validationMiddleware(vldtns.listing, true), WithdrawController.getRecords);

router.get('/gateways', authorizeMW('withdrawals', ['get', 'getAssigned']), WithdrawController.getGateways);

router.patch('/:id/approve', authorizeMW('withdrawals', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), WithdrawController.approveWithdraw);

router.patch('/:id/reject', authorizeMW('withdrawals', 'actions'), validationPathMiddleware(vldtns.update), attachCustomerMW(false), WithdrawController.rejectWithdraw);

module.exports = router;
module.exports.routerName = 'transactions/withdraw';
