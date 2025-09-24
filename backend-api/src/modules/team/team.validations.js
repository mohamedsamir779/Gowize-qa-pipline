const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.getTeamById = Joi.object({
  id: Joi.string(),
});

module.exports.create = Joi.object({
  title: Joi.string().required(),
  managerId: Joi.string().required(),
  // members: Joi.array().required().items(Joi.string()),
});

module.exports.update = Joi.object({
  title: Joi.string().required(),
  managerId: Joi.string().required(),
});

module.exports.addRemoveMember = Joi.object({
  members: Joi.array().required().items(Joi.string().required()),
});

module.exports.assignedAgent = Joi.object({
  assignedAgentId: Joi.string().required(),
});

// module.exports.addUpdateManager = Joi.object({
//   managerId: Joi.string().required(),
// });

// module.exports.addUpdateDeleteMembers = Joi.object({
//   members: Joi.array().required().items(Joi.string()),
// });
