const express = require('express');

const router = express.Router();

const {
  authMW, valMW, verifyIbChild, verifyIbAccMw, haveFxIb,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./ib.controller');
const vldtns = require('./ib.validations');

router.use(authMW);
router.use(haveFxIb);

// router.post('/', valMW(vldtns.create), ctrl.createRecord);

// get ib accounts
router.get('/accounts', ctrl.getIbAccounts);

// get recent live clients { type = live, dateFrom = 01-10-2022 }
// get recent demo clients { type = demo, dateFrom = 01-10-2022 }
// get my live clients { type = live }
// get my demo clients { type = demo }
router.get('/clients', valMW(vldtns.getClients, true), ctrl.getMyClients);

// get my client's live trading accounts
// get my client's demo trading accounts
router.get('/client/accounts', valMW(vldtns.getClientAccounts, true), ctrl.isMyClientMw, ctrl.getMyClientAccounts);

// get all clients accounts just like the above api but instead of getting one client accounts
// it gets all clients accounts
router.get('/all/clients/accounts', valMW(vldtns.getAllClientsAccounts, true), ctrl.areMyClientsMw, ctrl.getAllClientsAccounts);

// get my client's demo trading accounts's open positions
// get my client's live trading accounts's open positions
router.get('/client/account/open-positions', valMW(vldtns.getPositions, true), ctrl.isMyClientAccMw, ctrl.getOpenPositions);

// get my client's demo trading accounts's close positions
// get my client's live trading accounts's close positions
router.get('/client/account/closed-positions', valMW(vldtns.getPositions, true), ctrl.isMyClientAccMw, ctrl.getClosePositions);

// get  recent deposits
// get recent withdrawals
// get my client deposits
// get my client withdrawals
router.get('/client/transactions', valMW(vldtns.getClientTransactions, true), ctrl.getClientTransactions);

//
// get my structures
router.get('/agrements', valMW(vldtns.getAgreements, true), ctrl.getAgrements);

router.get('/referrals', valMW(vldtns.getClients, true), ctrl.getClientReferrals);

// get my statement - totals my client
router.get('/statement', valMW(vldtns.getStatement, true), ctrl.getStatement);

// get my statement deals wise for a ( trading account Or client )
router.get('/statement/deals', valMW(vldtns.getStDeals, true), ctrl.getStDeals);

// get ib summary
router.get('/summary', valMW(vldtns.getSummary, true), ctrl.getSummary);
// do Ib internal transfer
router.post('/internalTransfer', valMW(vldtns.makeInternalTransfer), verifyIbAccMw(false), ctrl.makeInternalTransfer);

router.patch('/questionnaire', ctrl.addQuestionnaire);
module.exports = router;
