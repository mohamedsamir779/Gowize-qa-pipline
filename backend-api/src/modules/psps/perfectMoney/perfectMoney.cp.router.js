const express = require('express');
const router = express.Router();
const ctrl = require('./perfectMoney.controller');
const vldtns = require('./perfectMoney.validations');

router.post('/status_update', ctrl.pay);
// router.post('/pay', authMiddleware(), validationMiddleware(perfectMoney), PerfectMoneyController.pay);
// router.get('/get-rates', PerfectMoneyController.getRates);
//  router.post('/success', PerfectMoneyController.success);
// router.post('/cancel', PerfectMoneyController.cancel);
// router.get('/cancel', PerfectMoneyController.cancelGet);
module.exports = router;
module.exports.routerName = 'psp/myFatoorah';
