const express = require('express');
const {
  authMiddleware,
} = require('src/shared/middlewares/crm-mw');

const router = express.Router();

router.use(authMiddleware);

const SystemEmailConfigController = require('./config.controller');

router.get('/', SystemEmailConfigController.getSystemEmailConfig);

router.post('/', SystemEmailConfigController.updateSystemEmailConfig);

router.post('/active', SystemEmailConfigController.activateSystemEmailConfig);

router.post('/test', SystemEmailConfigController.testSystemEmailConfig);

module.exports = router;
module.exports.routerName = 'email-config';
