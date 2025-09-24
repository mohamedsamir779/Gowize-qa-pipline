const express = require('express');

const router = express.Router();
const {
  validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../bankaccount.validations');

const ctr = require('./bankaccount.controller');

router.use(authMiddleware);

router.get('/', authorizeMW('companyBanks', 'get'), ctr.getRecords);
router.post('/', authorizeMW('companyBanks', 'create'), ctr.createRecord);
router.patch('/:id', authorizeMW('companyBanks', 'update'), validationPathMiddleware(vldtns.getBank), ctr.updateRecordById);
router.delete('/:id', authorizeMW('companyBanks', 'delete'), validationPathMiddleware(vldtns.getBank), ctr.deleteRecordById);

module.exports = router;
module.exports.routerName = 'company-bank-accounts';
