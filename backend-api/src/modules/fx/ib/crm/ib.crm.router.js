const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware,
  authMiddleware, authorizeMW, attachCustomerMW,
  haveFxIb, verifyIbAccMw,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./ib.controller');
const vldtns = require('./ib.validations');

router.use(authMiddleware);

// // for creating IB account
// router.post('/ib-account',
//     authorizeMW('tradingAccount', 'create'),
//     validationMiddleware(vldtns.getCustomer),
//     attachCustomerMW(false),
//     ctrl.createIbAccount);

router.get('/referrals/:clientId', validationMiddleware(vldtns.getClients, true),
  validationPathMiddleware(vldtns.getClient, true), ctrl.getClientReferrals);

router.get('/parents/:clientId', validationPathMiddleware(vldtns.getClient, true), ctrl.getIbParents);

router.patch('/link-client/:clientId', validationPathMiddleware(vldtns.getClient),
  validationMiddleware(vldtns.linkClient), ctrl.linkClient);

router.patch('/unlink-ib/:clientId', validationPathMiddleware(vldtns.getClient), ctrl.unLinkIb);

router.patch('/unlink-clients', ctrl.unLinkClients);

router.post('/internalTransfer',
  validationMiddleware(vldtns.makeInternalTransfer),
  verifyIbAccMw,
  ctrl.makeInternalTransfer);

router.get('/statement',
  validationMiddleware(vldtns.getStatement, true),
  attachCustomerMW(true),
  haveFxIb,
  ctrl.getStatement);

router.get('/statement/deals',
  validationMiddleware(vldtns.getStDeals, true),
  attachCustomerMW(true),
  haveFxIb,
  ctrl.getStDeals);

module.exports = router;
