//
const express = require('express');
const i18next = require('i18next');

const router = express.Router();

const ctrl = require('./locales.controller');

router.post('/locales/add/:lng/:ns', ctrl.missingKeyHandler);

// multiload backend route
router.get('/locales/:lng/:filename', ctrl.getResourcesHandler);
// can be used like:

module.exports = router;
