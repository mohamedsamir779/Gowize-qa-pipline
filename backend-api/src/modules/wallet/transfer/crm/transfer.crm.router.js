const { Router } = require('express');
const {
  authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');

const ctrl = require('./transfer.controller');

const router = Router();

router.use(authMiddleware);

// Get all products
router.get('/', authorizeMW('withdrawals', ['get', 'getAssigned']), ctrl.getTransactions);
// approve request
router.patch('/approve/:id', ctrl.approveTransaction);
// reject request
router.patch('/reject/:id', ctrl.rejectTransaction);
//  add approved transactions to wallet
router.post('/', ctrl.addApprovedTransaction);

module.exports = router;
module.exports.routerName = 'wallet/transfers';
