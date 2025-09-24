const express = require('express');

const router = express.Router();
const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const AssetController = require('./asset.controller');

router.use(authMW);

// for paginate records
router.get('/all', AssetController.getRecords);

module.exports = router;
module.exports.routerName = 'asset';
