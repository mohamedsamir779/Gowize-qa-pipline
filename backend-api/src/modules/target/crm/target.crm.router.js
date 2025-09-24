const express = require('express');
const {
  authMiddleware,
  validationMiddleware: valMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../target.validations');
const ctr = require('./target.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/', ctr.getRecords);
router.get('/all', ctr.getCanBeAssignedUsers);
router.patch('/all', valMW(vldtns.updateBulk), ctr.updateBulk);
router.patch('/', valMW(vldtns.addTarget), ctr.updateRecordById);

module.exports = router;
module.exports.routerName = 'target';
