const express = require('express');

const router = express.Router();
const {
  validationMiddleware,
  validationPathMiddleware,
  authMiddleware,
  authorizeMW,
  attachCustomerMW,
  checkTeamAndAddMembers,
  checkCountLimitations,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../customer.validations');
const ctr = require('./customer.controller');

router.get('/check-email', validationMiddleware(vldtns.emailCheck, true), ctr.checkEmail);

router.use(authMiddleware);

// for creating client from CRM. TODO: handle the case for both.
router.post('/', authorizeMW('clients', 'create'), validationMiddleware(vldtns.create), checkCountLimitations('clients'), (req, res, next) => (req.body?.category === 'FOREX' ? ctr.createFxRecord(req, res, next) : ctr.createClient(req, res, next)));
router.post('/ib', authorizeMW('clients', 'create'), validationMiddleware(vldtns.create), checkCountLimitations('clients'), (req, res, next) => (ctr.createIbRecord(req, res, next)));
router.get('/', authorizeMW('clients', ['get', 'getAssigned']), checkTeamAndAddMembers, validationMiddleware(vldtns.listing, true), ctr.getPaginate);
router.patch('/:id/call-status', authorizeMW('clients', 'update'), validationPathMiddleware(vldtns.getCustomer), validationMiddleware(vldtns.updateCallStatus), ctr.updateCallStatus);
router.get('/count-client-groups', ctr.countClientGroups);
router.get('/:id', authorizeMW('clients', ['get', 'getAssigned']), validationPathMiddleware(vldtns.getCustomer), ctr.getRecordById);
router.patch('/:id', authorizeMW('clients', 'update'), validationPathMiddleware(vldtns.getCustomer), validationMiddleware(vldtns.update), ctr.updateRecordById);
router.delete('/:id', authorizeMW('clients', 'delete'), validationPathMiddleware(vldtns.getCustomer), ctr.deleteRecordById);
router.patch('/:id/financial-info', authorizeMW('clients', 'update'), ctr.updateFinancialInfo);
router.patch('/:id/experience', authorizeMW('clients', 'update'), ctr.updateEmploymentInfo);

router.patch('/:customerId/convert/ib', attachCustomerMW(true, true), ctr.convertToIB);
router.patch('/:customerId/convert/crypto', authorizeMW('clients', 'update'), attachCustomerMW(true, true), ctr.convertToCrypto);
router.patch('/:customerId/convert/fx', authorizeMW('clients', 'update'), attachCustomerMW(true, true), ctr.convertToFx);
router.patch('/:customerId/convert/live', authorizeMW('clients', 'update'), attachCustomerMW(true, true), ctr.convertToLive);

router.post('/:id/access/:status', authorizeMW('clients', 'security'), validationPathMiddleware(vldtns.customerAccess), ctr.clientAccess);
router.post('/:id/reset-password', authorizeMW('clients', 'security'), validationPathMiddleware(vldtns.getCustomer), ctr.resetPassword);
router.post('/:id/forgot-password', authorizeMW('clients', 'security'), validationPathMiddleware(vldtns.getCustomer), ctr.forgotPassword);
router.post('/disable-2fa', authorizeMW('clients', 'security'), validationMiddleware(vldtns.disable2FA), ctr.disableTwoFactorAuth);
router.post('/send-mail', ctr.sendEmailLink);

router.post('/assign', validationMiddleware(vldtns.assignAgent), ctr.assignAgent);

router.get('/:id/mt5-markups', ctr.getMT5Markups);

module.exports = router;
module.exports.routerName = 'clients';
