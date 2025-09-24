const express = require('express');

const router = express.Router();
const {
  validationMiddleware, authMiddleware, attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../logs.validations');

const LogsController = require('./logs.controller');

router.use(authMiddleware);

// for paginate records
router.get('/', validationMiddleware(vldtns.listing, true), attachCustomerMW(true), LogsController.getPaginate);

router.get('/users', validationMiddleware(vldtns.listing, true), LogsController.getPaginateUsers);

// for get record by id
router.get('/:id', LogsController.getRecordById);

module.exports = router;
module.exports.routerName = 'logs';
