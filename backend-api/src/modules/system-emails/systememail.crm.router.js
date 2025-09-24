const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./systememail.validations');
const ctrl = require('./systememail.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('systemEmails', 'create'), validationMiddleware(vldtns.create), ctrl.createRecord);
router.post('/user', validationMiddleware(vldtns.createUserTemplate), ctrl.createUserTemplate);

// // for getting records with pagination
router.get('/', authorizeMW('systemEmails', 'get'), validationMiddleware(vldtns.listing, true), ctrl.getPaginate);
router.get('/user', validationMiddleware(vldtns.listing, true), ctrl.getUserTemplates);

// // for get record  by id
router.get('/:id', authorizeMW('systemEmails', 'get'), validationPathMiddleware(vldtns.getSystemEmail), ctrl.getRecordById);

// // for updating content by id
router.patch('/:id/content', authorizeMW('systemEmails', 'update'), validationPathMiddleware(vldtns.getSystemEmail), validationMiddleware(vldtns.updateContent), ctrl.updateContentById);

// // for updating record by id
router.patch('/:id', authorizeMW('systemEmails', 'update'), validationPathMiddleware(vldtns.getSystemEmail), validationMiddleware(vldtns.update), ctrl.updateRecordById);

// // for deleting record by id
router.delete('/:id', authorizeMW('systemEmails', 'delete'), validationPathMiddleware(vldtns.getSystemEmail), ctrl.deleteRecordById);

// // for preview content by id
router.get('/:id/preview/:lang', authorizeMW('systemEmails', 'get'), validationPathMiddleware(vldtns.previewEmail), ctrl.getContentPreview);

// for activating or deactivating email
router.post('/:id/:status', authorizeMW('systemEmails', 'update'), validationPathMiddleware(vldtns.emailStatus), ctrl.updateRecordStatus);

module.exports = router;
