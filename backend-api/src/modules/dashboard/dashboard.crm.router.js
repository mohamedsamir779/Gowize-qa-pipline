const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, attachCustomerMW, authorizeMW, checkTeamAndAddMembers,
} = require('src/shared/middlewares/crm-mw');

const DashboardController = require('./dashboard.controller');

router.use(authMiddleware);

router.get('/stats/customers-countries', DashboardController.getCustomerCountriesStats);
router.get('/stats/customers', checkTeamAndAddMembers, DashboardController.getCustomerStats);
router.get('/stats/requests', checkTeamAndAddMembers, DashboardController.getRequestStats);
router.get('/stats/transactions', checkTeamAndAddMembers, DashboardController.getTransactionStats);
router.get('/stats/kyc', authorizeMW('clients', ['get', 'getAssigned']), checkTeamAndAddMembers, DashboardController.getKycStats);
router.get('/stats/leads', authorizeMW('leads', ['get', 'getAssigned']), checkTeamAndAddMembers, DashboardController.getLeadStats);

module.exports = router;
