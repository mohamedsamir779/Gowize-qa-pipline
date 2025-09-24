const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./todos.validations');

const TodoController = require('./todos.controller');

router.use(authMiddleware);

// for adding record
router.post('/', validationMiddleware(vldtns.create), attachCustomerMW(false), TodoController.createRecord);

// for getting records with pagination
router.get('/', validationMiddleware(vldtns.listing, true), TodoController.getPaginate);

// for get record  by id
router.get('/:id', validationPathMiddleware(vldtns.getTodo), TodoController.getRecordById);

// for updating record by id
router.patch('/:id', validationPathMiddleware(vldtns.getTodo), validationMiddleware(vldtns.update), TodoController.updateRecordById);

// for deleting record by id
router.delete('/:id', validationPathMiddleware(vldtns.getTodo), TodoController.deleteRecordById);

module.exports = router;
module.exports.routerName = 'todos';
