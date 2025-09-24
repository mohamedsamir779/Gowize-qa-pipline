const express = require('express');

const router = express.Router();
const {
  authMiddleware,
  authorizeMW,
} = require('src/shared/middlewares/crm-mw');

const IbWalletController = require('./ib-wallet.controller');

router.use(authMiddleware);

// for adding record
router.post('/:id', authorizeMW('wallets', 'create'), IbWalletController.generateWalletForCustomerId);

// for get record by id
router.get('/:id', authorizeMW('wallets', 'get'), IbWalletController.getRecordByCustomerId);

module.exports = router;
module.exports.routerName = 'ib-wallet';
