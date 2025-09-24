const express = require('express');
const multer = require('multer');

const router = express.Router();

const {
  validationMiddleware,
  validationPathMiddleware,
  authMiddleware,
  authorizeMW,
  checkTeamAndAddMembers,
  checkCountLimitations,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../customer.validations');
const ctr = require('./lead.controller');

const upload = multer(
  {
    dest: 'uploads/',
  },
);
const multerMw = upload.single('leads');

router.get('/check-email', validationMiddleware(vldtns.emailCheck, true), ctr.checkEmail);

// create a new lead from exinitic website
router.post('/website', ctr.createLeadFromWebsite);

router.use(authMiddleware);

router.post('/', authorizeMW('leads', 'create'), validationMiddleware(vldtns.create), checkCountLimitations('leads'), ctr.createLead);
router.post('/excel', authorizeMW('leads', 'create'), multerMw, ctr.createExcelLead);
router.get('/', authorizeMW('leads', ['get', 'getAssigned']), checkTeamAndAddMembers, validationMiddleware(vldtns.listing, true), ctr.getPaginate);
router.get('/:id', authorizeMW('leads', ['get', 'getAssigned']), validationPathMiddleware(vldtns.getCustomer), ctr.getRecordById);
router.patch('/:id/call-status', authorizeMW('leads', 'update'), validationPathMiddleware(vldtns.getCustomer), validationMiddleware(vldtns.updateCallStatus), ctr.updateCallStatus);
router.patch('/:id', authorizeMW('leads', 'update'), validationPathMiddleware(vldtns.getCustomer), validationMiddleware(vldtns.update), ctr.updateRecordById);
router.delete('/:id', authorizeMW('leads', 'delete'), validationPathMiddleware(vldtns.getCustomer), ctr.deleteRecordById);

module.exports = router;
module.exports.routerName = 'leads';
