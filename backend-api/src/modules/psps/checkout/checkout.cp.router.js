const express = require('express');

const router = express.Router();
const CheckoutController = require('./checkout.controller');
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('./checout.schema');
const azureUpload = require('../../azure-multer/file-handler');
const upload= azureUpload.uploadInMemory.single('file');

router.post('/uploadprofile', upload, authMW, CheckoutController.uploadProfile);
router.post('/pay', authMW, valMW(vldtns.checkoutSchema), CheckoutController.pay);
router.post('/deposit/callback', CheckoutController.depositCallback);

module.exports = router;
module.exports.routerName = 'psp/checkout';
