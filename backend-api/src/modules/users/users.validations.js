const Joi = require('joi');
const { basePagination } = require('src/common/handlers');

module.exports.listing = Joi.object({
  ...basePagination,
});

module.exports.getRole = Joi.object({
  id: Joi.string(),
});

module.exports.getUser = Joi.object({
  id: Joi.string(),
});

module.exports.emailCheck = Joi.object({
  email: Joi.string().email().required(),
});

module.exports.create = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  roleId: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string(),
  phone: Joi.string(),
});

module.exports.update = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  mobile: Joi.string().allow(''),
  phone: Joi.string().allow(''),
  roleId: Joi.string(),
  isActive: Joi.boolean(),
  settings: Joi.object({
    twoFactorAuthEnabled: Joi.boolean(),
    timezone: Joi.string(),
    salesDashboard: Joi.array().items(Joi.string()),
    salesDashboardLimit: Joi.number(),
    enableCallStatusColors: Joi.boolean(),
    callStatusColors: Joi.object(),
    pushNotifications: Joi.array(),
  }),
});

module.exports.updateSettings = Joi.object({
  settings: Joi.object({
    twoFactorAuthEnabled: Joi.boolean(),
    timezone: Joi.string(),
    salesDashboard: Joi.array().items(Joi.string()),
    salesDashboardLimit: Joi.number(),
    enableCallStatusColors: Joi.boolean(),
    callStatusColors: Joi.object(),
    pushNotifications: Joi.array(),
  }),
});

module.exports.changePassword = Joi.object({
  oldPassword: Joi.string().required().label('Old Password'),
  newPassword: Joi.string().required().label('Password'),
  cnfPassword: Joi.any().equal(Joi.ref('newPassword')).required().label('Confirm password'),
});
module.exports.resetPassword = Joi.object({
  password: Joi.string().required().label('Password'),
  confirm: Joi.string().required().label('Password'),
});

module.exports.assignAgents = Joi.object({
  agent: Joi.object({
    _id: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
  }).required(),
  agentId: Joi.string().required(),
  body: Joi.object({
    clientIds: Joi.array().items(Joi.string()).required(),
  }).required(),
});

module.exports.loginUser = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports.salesAgent = Joi.object({
  assignedTo: Joi.string().required(),
});

module.exports.disable2FA = Joi.object({
  userId: Joi.string().required(),
});
