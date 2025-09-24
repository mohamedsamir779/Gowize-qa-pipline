const express = require('express');

const router = express.Router();
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('../transaction.validations');

const DepositController = require('./deposit.controller');

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const path = 'uploads/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename(req, file, cb) {
    cb(null, `receipt_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer(
  {
    dest: 'uploads/',
    storage,
  },
);
const multerMW = upload.single('receipt');

router.use(authMW);

// for adding record
router.post('/', multerMW, valMW(vldtns.depositBasic), DepositController.basicDeposit);

router.get('/', valMW(vldtns.listing, true), DepositController.getRecords);

router.get('/gateways', DepositController.getGateways);

module.exports = router;
module.exports.routerName = 'transactions/deposit';
