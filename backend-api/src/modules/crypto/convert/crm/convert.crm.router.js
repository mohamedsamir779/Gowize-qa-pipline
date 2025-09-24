const express = require('express');

const router = express.Router();
const {
  authMiddleware,
  attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./convert.validations');

const ConvertController = require('./convert.controller');

// for adding record
router.use(authMiddleware);
router.post('/', attachCustomerMW(false), ConvertController.createConvert);

// for paginate records
router.get('/', attachCustomerMW(true), ConvertController.getPaginate);

// for getting all records with paginate
router.get('/all', ConvertController.getAllPaginate);

router.get('/preview', ConvertController.previewConvert);

// for get record by id
router.get('/:id', ConvertController.getRecordById);

// for preview conversion

module.exports = router;
module.exports.routerName = 'convert';
