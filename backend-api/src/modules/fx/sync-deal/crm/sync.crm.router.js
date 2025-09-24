const express = require('express');

const router = express.Router();
const {
  authMiddleware,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./sync.controller');

router.use(authMiddleware);

router.post('/', ctrl.getDeals);

router.post('/sync', ctrl.syncDeals);

module.exports = router;
module.exports.routerName = 'sync-deals';
