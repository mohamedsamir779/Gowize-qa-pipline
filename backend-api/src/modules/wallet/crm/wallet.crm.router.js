const express = require('express');

const router = express.Router();
const {
  validationMiddleware,
  validationPathMiddleware,
  authMiddleware,
  authorizeMW,
  attachCustomerMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./wallet.validations');

const WalletController = require('./wallet.controller');

router.post('/:id/blockchain/incoming', WalletController.tatumWalletIncomingTransaction);
router.post('/:id/blockchain/pending', WalletController.tatumWalletPendingTransaction);
// router.post('/:id/blockchain/transaction', WalletController.tatumWalletUpdate);
// router.post('/:id/blockchain/offchain-withdrawal', WalletController.tatumWalletUpdate);
// router.post('/:id/kms/completed', WalletController.tatumWalletUpdate);
// router.post('/:id/kms/failed', WalletController.tatumWalletUpdate);
router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('wallets', 'create'), validationMiddleware(vldtns.create), WalletController.generateWalletForAsset);

router.patch('/:id', authorizeMW('wallets', 'update'), validationPathMiddleware(vldtns.getWallet), validationMiddleware(vldtns.update), WalletController.updateWallet);

// for paginate records
router.get('/', authorizeMW('wallets', 'get'), validationMiddleware(vldtns.listing, true), attachCustomerMW(true), WalletController.getPaginate);

// for get record by id
router.get('/:id', authorizeMW('wallets', 'get'), validationPathMiddleware(vldtns.getWallet), WalletController.getRecordById);

module.exports = router;
module.exports.routerName = 'wallets';
