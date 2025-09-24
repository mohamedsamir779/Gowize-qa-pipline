const express = require('express');

const router = express.Router();
const {
  validationMiddleware: valMw,
  authMiddleware,
  authorizeMW: authMw,
  attachTradingAccountMW: atcAcc,
  attachCustomerMW,
  haveFxIb,
  validationPathMiddleware,
} = require('src/shared/middlewares/crm-mw');
const ctrl = require('./ibagrement.controller');
const vldtns = require('./ibagrement.validations');

router.use(authMiddleware);

router.get('/products', authMw('ibAgrement', 'get'), ctrl.getFxProducts);
router.get('/', authMw('ibAgrement', 'get'), valMw(vldtns.listing, true), attachCustomerMW(true), ctrl.getAgrements);
router.post(
  '/master',
  authMw('ibAgrement', 'create'),
  valMw(vldtns.masterAgrement),
  attachCustomerMW(false),
  haveFxIb,
  ctrl.createMasterAgrement,
);
router.post(
  '/shared',
  authMw('ibAgrement', 'create'),
  valMw(vldtns.sharedAgrement),
  ctrl.createSharedAgrement,
);
router.patch(
  '/master/:id',
  authMw('ibAgrement', 'update'),
  valMw(vldtns.masterAgrement),
  validationPathMiddleware(vldtns.updateAgreementPath),
  ctrl.updateMasterAgreement,
);
router.patch(
  '/shared/:id',
  authMw('ibAgrement', 'update'),
  valMw(vldtns.sharedAgrement),
  validationPathMiddleware(vldtns.updateAgreementPath),
  ctrl.updateSharedAgreement,
);
router.delete('/:id', authMw('ibAgrement', 'delete'), validationPathMiddleware(vldtns.updateAgreementPath), ctrl.deleteAgreement);

module.exports = router;
module.exports.routerName = 'ibagrements';
