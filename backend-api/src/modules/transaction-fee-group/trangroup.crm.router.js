const express = require('express');

const router = express.Router();

const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./trangroup.controller');
const vldtns = require('./trangroup.validations');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('transactionFeeGroups', 'create'), validationMiddleware(vldtns.create), ctrl.createRecord);

// for getting records with pagination
router.get('/', authorizeMW('transactionFeeGroups', 'get'), validationMiddleware(vldtns.listing, true), ctrl.getPaginate);

// for get record  by id
router.get('/:id', authorizeMW('transactionFeeGroups', 'get'), validationPathMiddleware(vldtns.getFeeGroup), ctrl.getRecordById);

// for updating record by id
router.patch('/:id', authorizeMW('transactionFeeGroups', 'update'), validationPathMiddleware(vldtns.getFeeGroup), validationMiddleware(vldtns.update), ctrl.updateRecordById);

// for deleting record by id
router.delete('/:id', authorizeMW('transactionFeeGroups', 'delete'), validationPathMiddleware(vldtns.getFeeGroup), ctrl.deleteRecordById);

module.exports = router;
module.exports.routerName = 'transaction-fee-groups';
