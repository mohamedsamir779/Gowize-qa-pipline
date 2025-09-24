//
const express = require('express');

const router = express.Router();

const localesRouter = require('./modules/locales/locales.router');

router.use('', localesRouter);

module.exports = router;
