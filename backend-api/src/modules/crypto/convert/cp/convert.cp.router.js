const express = require('express');

const router = express.Router();
const {
  authMW, valMW, vlPathMw,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('./convert.validations');
const ConvertController = require('./convert.controller');

router.use(authMW);

// for adding record
router.post('/', valMW(vldtns.create), ConvertController.createConvert);

// for paginate records
router.get('/', valMW(vldtns.listing, true), ConvertController.getPaginate);

router.get('/preview', valMW(vldtns.previewConversion, true), ConvertController.previewConvert);

// for get record by id
router.get('/:id', vlPathMw(vldtns.UDConvert), ConvertController.getRecordById);

// for preview conversion

module.exports = router;
module.exports.routerName = 'convert';
