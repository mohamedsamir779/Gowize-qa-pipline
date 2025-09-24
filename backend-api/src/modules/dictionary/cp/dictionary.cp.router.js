const express = require('express');

const router = express.Router();
const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const DictionaryController = require('./dictionary.controller');

// router.use(authMW);

// for paginate records
router.get('/', DictionaryController.getDictionary);

module.exports = router;
module.exports.routerName = 'dictionaries';
