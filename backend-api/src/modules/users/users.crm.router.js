const express = require('express');

const router = express.Router();
const {
  validationMiddleware,
  validationPathMiddleware,
  authMiddleware,
  authorizeMW,
  vlResetPassMw,
  checkTeamAndAddMembers,
  checkCountLimitations,
} = require('src/shared/middlewares/crm-mw');
const userValidations = require('./users.validations');

const UserController = require('./users.controller');

router.patch('/reset-password', vlResetPassMw, UserController.resetPassword);
router.patch('/forgot-password', UserController.forgotPassword);
router.get('/check-email', validationMiddleware(userValidations.emailCheck, true), UserController.checkEmailExists);

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('users', 'create'), validationMiddleware(userValidations.create), checkCountLimitations('users'), UserController.createRecord);

// for paginate records
router.get('/', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getPaginate);
router.get('/managers', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getTeamManagers);
router.get('/members', authorizeMW('users', 'get'), validationMiddleware(userValidations.listing, true), UserController.getTeamMembers);
router.get('/assignable', authorizeMW('users', 'get'), checkTeamAndAddMembers, validationMiddleware(userValidations.listing, true), UserController.getAssignable);

// for get record  by id
router.get('/:id', authorizeMW('users', 'get'), validationPathMiddleware(userValidations.getUser), UserController.getRecordById);

// for updating record by id
router.post('/assign', validationPathMiddleware(userValidations.getUser), validationMiddleware(userValidations.assignAgents), UserController.assignAgents);
router.patch('/settings', validationMiddleware(userValidations.updateSettings), UserController.updateUserSettings);
router.patch('/:id/password', authorizeMW('users', 'update'), validationPathMiddleware(userValidations.getUser), validationMiddleware(userValidations.changePassword), UserController.changePassword);
router.patch('/:id/password-change', authorizeMW('users', 'update'), validationMiddleware(userValidations.resetPassword), UserController.userResetPassword);
router.patch('/:id', authorizeMW('users', 'update'), validationPathMiddleware(userValidations.getUser), validationMiddleware(userValidations.update), UserController.updateRecordById);

// for deleting record by id
router.delete('/:id', authorizeMW('users', 'delete'), validationPathMiddleware(userValidations.getUser), UserController.deleteRecordById);

router.post('/disable-2fa', authorizeMW('users', 'update'), validationMiddleware(userValidations.disable2FA), UserController.disableTwoFactorAuth);

router.post('/email-config', UserController.updateEmailConfig);
router.post('/email-config/active', UserController.activateEmailConfig);
router.post('/email-config/test', UserController.testEmailConfig);
router.post('/send-email', UserController.sendEmail);

module.exports = router;
module.exports.routerName = 'users';
