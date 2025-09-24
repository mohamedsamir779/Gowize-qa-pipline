const express = require('express');

const router = express.Router();

const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./markup.controller');
const vldtns = require('./markup.validations');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('markups', 'create'), validationMiddleware(vldtns.create), ctrl.createRecord);

// for getting records with pagination
router.get('/', authorizeMW('markups', 'get'), validationMiddleware(vldtns.listing, true), ctrl.getPaginate);

// for get record  by id
router.get('/:id', authorizeMW('markups', 'get'), validationPathMiddleware(vldtns.getMarkup), ctrl.getRecordById);

// for updating record by id
router.patch('/:id', authorizeMW('markups', 'update'), validationPathMiddleware(vldtns.getMarkup), validationMiddleware(vldtns.update), ctrl.updateRecordById);

// for deleting record by id
router.delete('/:id', authorizeMW('markups', 'delete'), validationPathMiddleware(vldtns.getMarkup), ctrl.deleteRecordById);

module.exports = router;
module.exports.routerName = 'markups';
