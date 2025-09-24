const express = require('express');

const router = express.Router();
const {
  authMW, valMW, vlPathMw, verifyAccMw,
} = require('src/shared/middlewares/cp-mw');
const ctrl = require('./accounts.controller');
const vldtns = require('./accounts.validations');

router.use(authMW);

/**
 * account types routes
 */

router.get('/account-types', valMW(vldtns.accountTypeListing, true), ctrl.getAccountTypes);

/**
 * Trading account routes
 */

// for creating trading account
router.post('/', valMW(vldtns.create), ctrl.createRecord);

// for getting trading accounts with pagination
router.get('/', valMW(vldtns.listing, true), ctrl.getPaginate);

// for get trading accounts  by id
router.get('/:id', vlPathMw(vldtns.getAccount), ctrl.getRecordById);

// for updating trading accounts by id
router.post('/:id/change-password', vlPathMw(vldtns.getAccount), verifyAccMw(false), valMW(vldtns.changePassword), ctrl.changePassword);
router.post('/:id/change-leverage', vlPathMw(vldtns.getAccount), verifyAccMw(false), valMW(vldtns.changeLeverage), ctrl.changeLeverage);

// for getting deals

router.get('/:id/open-positions', vlPathMw(vldtns.getAccount), verifyAccMw(true), ctrl.getOpenPositions);
router.get('/:id/close-positions', vlPathMw(vldtns.getAccount), verifyAccMw(true), ctrl.getClosedPositions);

module.exports = router;
module.exports.routerName = 'accounts';
