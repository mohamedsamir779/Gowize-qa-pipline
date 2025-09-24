const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./role.validations');

const RoleController = require('./roles.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('roles', 'create'), validationMiddleware(vldtns.create), RoleController.createRecord);

// for getting records with pagination
router.get('/', authorizeMW('roles', 'get'), validationMiddleware(vldtns.listing, true), RoleController.getPaginate);

// for get record  by id
router.get('/:id', authorizeMW('roles', 'get'), validationPathMiddleware(vldtns.getRole), RoleController.getRecordById);

// for updating record by id
router.patch('/:id', authorizeMW('roles', 'update'), validationPathMiddleware(vldtns.getRole), validationMiddleware(vldtns.update), RoleController.updateRecordById);

// for deleting record by id
router.delete('/:id', authorizeMW('roles', 'delete'), validationPathMiddleware(vldtns.getRole), RoleController.deleteRecordById);

// for activating or deactivating role
router.post('/:id/:status', authorizeMW('roles', 'update'), validationPathMiddleware(vldtns.roleStatus), RoleController.updateRecordStatus);

module.exports = router;
module.exports.routerName = 'roles';
