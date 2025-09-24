const express = require('express');

const router = express.Router();
const {
  valMW, authMW, vlPathMw,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('../bankaccount.validations');

const ctr = require('./bankaccount.controller');

router.use(authMW);

router.post('/', valMW(vldtns.addBankAccount), ctr.addBankAccount);
router.get('/', ctr.getMyBankAccounts);
router.delete('/:id', vlPathMw(vldtns.getById), ctr.checkAccess, ctr.deleteRecordById);
router.patch('/:id', vlPathMw(vldtns.getById), ctr.checkAccess, valMW(vldtns.updateBankAccount), ctr.updateRecordById);

module.exports = router;
module.exports.routerName = 'bank-accounts';
