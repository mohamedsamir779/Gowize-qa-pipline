const express = require('express');

const router = express.Router();
const { valMW, validateEmailPin, checkCountLimitations } = require('src/shared/middlewares/cp-mw');
const vldtns = require('./register.validations');
const ctr = require('./register.controller');

// crypto individual links
router.post('/crypto/demo', valMW(vldtns.registerDemo), valMW(vldtns.checkReqQuery), validateEmailPin, checkCountLimitations('leads'), ctr.registerCryptoDemo);
router.post('/crypto/live', valMW(vldtns.registerLive), valMW(vldtns.checkReqQuery), validateEmailPin, checkCountLimitations('clients'), ctr.registerCryptoLive);

// crypto corporate links
router.post('/crypto/corporate', valMW(vldtns.registerLive), checkCountLimitations('clients'), ctr.registerCryptoCorporate);
router.post('/send-pin', valMW(vldtns.emailPin), ctr.createRegisterPin);
router.post('/verify-pin', valMW(vldtns.verifyPin), ctr.verifyRegisterPin);
// fx individual links
router.post('/fx/demo', valMW(vldtns.registerDemo), valMW(vldtns.checkReqQuery), validateEmailPin, checkCountLimitations('leads'), ctr.registerFxDemo);
router.post('/fx/live', valMW(vldtns.registerLive), valMW(vldtns.checkReqQuery), validateEmailPin, checkCountLimitations('clients'), ctr.registerFxLive);
router.post('/fx/ib', valMW(vldtns.registerLive), valMW(vldtns.checkReqQuery), validateEmailPin, checkCountLimitations('clients'), ctr.registerFxIb);

// fx corporate links
router.post('/fx/corporate', valMW(vldtns.registerCorporate), checkCountLimitations('clients'), ctr.registerFxCorporate);
router.post('/fx/corporate-ib', valMW(vldtns.registerCorporate), checkCountLimitations('clients'), ctr.registerFxCorporateIb);

module.exports = router;
module.exports.routerName = 'register';
