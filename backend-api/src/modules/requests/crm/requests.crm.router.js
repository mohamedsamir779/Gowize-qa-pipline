//
const express = require('express');

const router = express.Router();
const {
  validationMiddleware,
  validationPathMiddleware,
  authMiddleware,
  authorizeMW,
  checkTeamAndAddMembers,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./request.validations');

const ctrl = require('./request.controller');

router.use(authMiddleware);

// for getting records with pagination
router.get('/ib', authorizeMW('requests', 'get'), checkTeamAndAddMembers, validationMiddleware(vldtns.listing, true), ctrl.getIbRequests);
router.get('/leverage', authorizeMW('requests', 'get'), checkTeamAndAddMembers, validationMiddleware(vldtns.listing, true), ctrl.getLeverageRequest);

// ib request actions
router.post('/ib/approve', authorizeMW('requests', 'actions'), validationMiddleware(vldtns.ibActions), ctrl.approveIbRequest);
router.post('/ib/reject', authorizeMW('requests', 'actions'), validationMiddleware(vldtns.ibActions), ctrl.rejectIbRequest);

// leverage request action
router.post('/leverage/approve', authorizeMW('requests', 'actions'), validationMiddleware(vldtns.leverageActions), ctrl.approveLeverageRequest);
router.post('/leverage/reject', authorizeMW('requests', 'actions'), validationMiddleware(vldtns.leverageActions), ctrl.rejectLeverageRequest);

// Account Requests
router.get('/account', authorizeMW('requests', 'get'), checkTeamAndAddMembers, validationMiddleware(vldtns.listing, true), ctrl.getAccountRequests);
router.post('/account/approve', authorizeMW('requests', 'actions'), validationMiddleware(vldtns.accountAction), ctrl.approveAccountRequest);
router.post('/account/reject', authorizeMW('requests', 'actions'), validationMiddleware(vldtns.accountAction), ctrl.rejectAccountRequest);

module.exports = router;
module.exports.routerName = 'requests';
