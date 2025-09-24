const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./team.validations');

const TeamController = require('./team.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('teams', 'create'), validationMiddleware(vldtns.create), TeamController.createRecord);

// for paginate records
router.get('/', authorizeMW('teams', 'get'), validationMiddleware(vldtns.listing, true), TeamController.getPaginate);

router.get('/is-manager', validationMiddleware(vldtns.assignedAgent, true), TeamController.isCurrentUserManagerOfAssignedAgent);

// for get record  by id
router.get('/:id', authorizeMW('teams', 'get'), validationPathMiddleware(vldtns.getTeamById), validationPathMiddleware(vldtns.getTeamById), TeamController.getRecordById);

// for updating record by id
router.patch('/:id', authorizeMW('teams', 'update'), validationPathMiddleware(vldtns.getTeamById), validationMiddleware(vldtns.update), TeamController.updateRecordById);
router.post('/:id/add-member', authorizeMW('teams', 'update'), validationPathMiddleware(vldtns.getTeamById), validationMiddleware(vldtns.addRemoveMember), TeamController.addTeamMember);
router.post('/:id/remove-member', authorizeMW('teams', 'update'), validationPathMiddleware(vldtns.getTeamById), validationMiddleware(vldtns.addRemoveMember), TeamController.removeTeamMember);

// for deleting record by id
router.delete('/:id', authorizeMW('teams', 'delete'), validationPathMiddleware(vldtns.getTeamById), TeamController.deleteRecordById);

module.exports = router;
module.exports.routerName = 'teams';
