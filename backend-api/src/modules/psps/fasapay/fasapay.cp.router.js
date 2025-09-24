const express = require('express');
const router = express.Router();
const ctrl = require('./fasapay.controller');
const vldtns = require('./fasapay.validations');

router.post('/status_update', ctrl.statusUpdate);

module.exports = router;
module.exports.routerName = 'psp/myFatoorah';
