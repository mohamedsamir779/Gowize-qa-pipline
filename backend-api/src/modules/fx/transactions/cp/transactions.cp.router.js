const express = require('express');

const router = express.Router();
const {
  valMW,
  authMW,
  verifyAccMw,
} = require('src/shared/middlewares/cp-mw');
const ctrl = require('./transaction.controller');
const vldtns = require('./transaction.validations');

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

// deposit apis
router.post('/deposits', multerMW, valMW(vldtns.deposit), verifyAccMw(false), ctrl.makeDeposit);
router.get('/deposits', valMW(vldtns.listing, true), verifyAccMw(true, false), ctrl.getDeposits);
router.get('/deposits-gateways', ctrl.getDepositGateways);

// withdrawals apis
router.post('/withdrawals', valMW(vldtns.withdrawl), verifyAccMw(false), ctrl.makeWithdrawal);
router.get('/withdrawals', valMW(vldtns.listing, true), verifyAccMw(true, false), ctrl.getWithdrawals);
router.get('/withdrawals-gateways', ctrl.getWithdrawalGateways);

// Internal Transfer Endpoints.
router.post('/internalTransfers', valMW(vldtns.internalTransfer), verifyAccMw(false), ctrl.createInternalTransferRequest);
// TODO: Handle the below Request.
router.post('/internalTransfers', valMW(vldtns.internalTransfer), verifyAccMw(false), ctrl.makeInternalTransfer);
router.get('/internalTransfers', valMW(vldtns.listing, true), verifyAccMw(true, false), ctrl.getInternalTransfers);

router.get('/all', valMW(vldtns.listing, true), verifyAccMw(true, false), ctrl.getTransactions);

module.exports = router;
module.exports.routerName = 'fxtransactions';
