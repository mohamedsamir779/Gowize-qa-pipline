const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const FeeGroupController = require('./feegroup.controller');
const vldtns = require('./feegroup.validations');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('feeGroups', 'create'), validationMiddleware(vldtns.create), FeeGroupController.createRecord);

// for getting records with pagination
router.get('/', authorizeMW('feeGroups', 'get'), validationMiddleware(vldtns.listing, true), FeeGroupController.getPaginate);

// for get record  by id
router.get('/:id', authorizeMW('feeGroups', 'get'), validationPathMiddleware(vldtns.getFeeGroup), FeeGroupController.getRecordById);

// for updating record by id
router.patch('/:id', authorizeMW('feeGroups', 'update'), validationPathMiddleware(vldtns.getFeeGroup), validationMiddleware(vldtns.update), FeeGroupController.updateRecordById);

// for deleting record by id
router.delete('/:id', authorizeMW('feeGroups', 'delete'), validationPathMiddleware(vldtns.getFeeGroup), FeeGroupController.deleteRecordById);

module.exports = router;
module.exports.routerName = 'fee-groups';
