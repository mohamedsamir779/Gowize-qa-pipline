const express = require('express');

const router = express.Router();
const {
  validationMiddleware: valMW,
  validationPathMiddleware: valPathMW,
  authMiddleware, authorizeMW, attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./accounts.controller');
const vldtns = require('./accounts.validations');

router.use(authMiddleware);

/**
 * account types routes
 */

router.get('/account-types', valMW(vldtns.accountTypeListing, true), ctrl.getAccountTypes);
router.post('/account-types', authorizeMW('accountTypes', 'create'), valMW(vldtns.createAccountType, false), ctrl.createAccountType);
router.patch('/account-types/:id',
  authorizeMW('accountTypes', 'update'),
  valMW(vldtns.updateAccountType, false),
  valPathMW(vldtns.getAccount),
  ctrl.updateAccountType);

/**
 * Trading account routes
 */

// for creating trading account
router.post('/', authorizeMW('tradingAccount', 'create'), attachCustomerMW(false), valMW(vldtns.create), ctrl.createRecord);

// for getting trading accounts with pagination
router.get('/', authorizeMW('tradingAccount', 'get'), valMW(vldtns.listing, true), ctrl.getPaginate);

router.get('/stateless', authorizeMW('tradingAccount', 'get'), ctrl.getAccounts);

// for get trading accounts  by id
router.get('/:id', authorizeMW('tradingAccount', 'get'), valPathMW(vldtns.getAccount), ctrl.getRecordById);

// for updating trading accounts by id
router.patch('/:id', authorizeMW('tradingAccount', 'update'), valPathMW(vldtns.getAccount), valMW(vldtns.update), ctrl.updateRecordById);

router.post('/:id/change-leverage', authorizeMW('tradingAccount', 'update'), valPathMW(vldtns.getAccount), valMW(vldtns.changeLeverage), ctrl.changeLeverage);
router.post('/:id/change-password', authorizeMW('tradingAccount', 'update'), valPathMW(vldtns.getAccount), valMW(vldtns.changePassword), ctrl.changePassword);
router.post('/change-group', authorizeMW('tradingAccount', 'update'), valMW(vldtns.changeGroup), ctrl.changeGroup);
router.post('/change-access', authorizeMW('tradingAccount', 'update'), valMW(vldtns.changeAccess), ctrl.tradingAccess);

router.post('/link', authorizeMW('tradingAccount', 'create'), valMW(vldtns.linkAccount), ctrl.linkAccount);

router.get('/:id/open-positions', valPathMW(vldtns.getAccount), ctrl.getOpenPositions);
router.get('/:id/close-positions', valPathMW(vldtns.getAccount), ctrl.getClosedPositions);

module.exports = router;
module.exports.routerName = 'accounts';
