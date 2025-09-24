/* eslint-disable no-case-declarations */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { keys, ResponseMessages } = require('src/common/data');
const { redis, logger } = require('src/common/lib');
const { CustomError, parseJoiObject, addCustomerPortals } = require('src/common/handlers');

const service = require('src/modules/services').usersService;
const {
  customerService, settingService, userService,
} = require('src/modules/services');
const { accountService } = require('src/modules/services');
const { teamService } = require('src/modules/services');

module.exports.authMiddleware = async (req, res, next) => {
  const ip = req.headers['x-real-ip'];
  logger.info(['Request IP => ', ip, req.params, req.body, req.query, req.headers, req.url, req.method, req.path]);
  req.isAuth = true;
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    return next(new CustomError(ResponseMessages.MISSING_TOKEN));
  }
  token = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, keys.jwtKey);
    if (!decoded || !decoded._id) {
      return next(new CustomError(ResponseMessages.INVALID_TOKEN));
    }
    const user = await redis.getKey(`${decoded._id}:${token}`);
    if (!user || user === '') {
      return next(new CustomError(ResponseMessages.INVALID_TOKEN));
    }
    req.user = user;
    req.token = token;
    // const user = await service.getUserById(decoded._id);
    // req.user = {
    //   ...user,
    //   _id: decoded._id,
    // };
    return next();
  } catch (ex) {
    return next(new CustomError(ResponseMessages.INVALID_TOKEN));
  }
};

const checkPerms = (perms, group, permission) => {
  let showAll = false;
  let showMine = false;
  if (group !== 'clients' && group !== 'leads') {
    if (perms.clients.getAssigned) {
      showMine = true;
    }
    if (perms.clients.get) {
      showAll = true;
    }
  } else {
    if (perms[group].getAssigned) {
      showMine = true;
    }
    if (perms[group].get) {
      showAll = true;
    }
  }
  return {
    showMine,
    showAll,
  };
};

module.exports.authorizeMW = (group = '', permission = '') => (req, res, next) => {
  if (!req.user || !req.user.roleId || !req.user.roleId.permissions) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  const perms = req.user.roleId.permissions;
  req.user.showAll = false;
  req.user.showMine = false;
  if (typeof permission === 'object') {
    let perm = false;
    permission.forEach((element) => {
      if (perms[group] && perms[group][element]) {
        permission = element;
        perm = true;
      }
    });
    if (perm) {
      const { showAll, showMine } = checkPerms(perms, group, permission);
      req.user.showAll = showAll;
      req.user.showMine = showMine;
      return next();
    }
  } else if (perms[group] && perms[group][permission]) {
    const { showAll, showMine } = checkPerms(perms, group, permission);
    req.user.showAll = showAll;
    req.user.showMine = showMine;
    return next();
  }
  return next(new CustomError(ResponseMessages.ACCESS_DENIED));
};

module.exports.checkTeamAndAddMembers = async (req, res, next) => {
  if (!req.user || !req.user.roleId || !req.user.roleId.permissions) {
    return next();
  }
  const perms = req.user.roleId.permissions;
  if (perms.users && perms.users.canBeTeamManager) {
    const teams = await teamService.find({
      managerId: req.user._id,
    });
    req.user.showTeamsOnly = true;
    if (teams && teams.length > 0) {
      req.user.teamMembers = [];
      teams.forEach((team, index) => {
        req.user.teamMembers = [...req.user.teamMembers, ...team.members];
        if (index === teams.length - 1) {
          req.user.teamMembers = [...req.user.teamMembers, mongoose.Types.ObjectId(req.user._id)];
        }
      });
    }
  }
  return next();
};

module.exports.validationMiddleware = (validationObject, isGet = false) => (req, res, next) => {
  req.apiParams = parseJoiObject(validationObject);
  const body = isGet ? req.query || {} : req.body || {};
  const { error } = validationObject && validationObject.validate(body) || {};
  if (error) {
    return next(new CustomError({
      ...ResponseMessages.JOI_VALIDATION_ERROR,
      message: error.message,
    }));
  }
  return next();
};

module.exports.validationPathMiddleware = (validationObject) => (req, res, next) => {
  req.pathParams = parseJoiObject(validationObject);
  const body = req.params;
  const { error } = validationObject && validationObject.validate(body) || {};
  if (error) {
    return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR));
  }
  return next();
};

module.exports.attachCustomerMW = (isGet, isParams = false) => async (req, res, next) => {
  let body = {};
  if (isGet) {
    if (isParams) {
      body = req.params || {};
    } else {
      body = req.query || {};
    }
  } else {
    body = req.body || {};
  }
  const { customerId, belongsTo } = body;
  if (customerId || belongsTo) {
    const customer = await customerService.findById(customerId || belongsTo);
    // eslint-disable-next-line max-len
    if (customer) {
      req.customer = customer;
      addCustomerPortals(customer, req);
    } else { next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  } else { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  return next();
};

module.exports.attachTradingAccountMW = (isGet) => async (req, res, next) => {
  const body = isGet ? req.query || {} : req.body || {};
  const { tradingAccountId, tradingAccountFrom, tradingAccountTo } = body;
  if (tradingAccountId) {
    const tradingAccount = await accountService.findById(tradingAccountId, null, true, [{
      path: 'customerId',
      select: 'firstName lastName email',
    }]);
    // eslint-disable-next-line max-len
    if (tradingAccount) { req.tradingAccount = tradingAccount; } else { next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  } else if (tradingAccountFrom && tradingAccountTo) {
    const [acc1, acc2] = await accountService.find({
      _id: {
        $in: [tradingAccountFrom, tradingAccountTo],
      },
    }, null, true, [{
      path: 'customerId',
      select: 'firstName lastName email',
    }]);
    if (acc1 && acc2) {
      req.tradingAccountFrom = acc1._id.toString() === tradingAccountFrom ? acc1 : acc2;
      req.tradingAccountTo = acc2._id.toString() === tradingAccountTo ? acc2 : acc1;
    } else { next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  } else { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  return next();
};

module.exports.addUniqueId = (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  req.ip = req.ip.split(':')[0];
  req.uid = generateUuid();
  logger.info(['request ID => ', req.uid]);
  return next();
};

module.exports.haveCryptoDemo = async (req, res, next) => {
  if (!req.isCryptoDemo) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveCrypto = async (req, res, next) => {
  if (!req.isCryptoClient) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveFx = async (req, res, next) => {
  if (!req.isFxClient) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveFxDemo = async (req, res, next) => {
  if (!req.isFxDemo) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveFxIb = async (req, res, next) => {
  if (!req.isFxIb) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveFxIbDemo = async (req, res, next) => {
  if (!req.isFxIbDemo) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveGold = async (req, res, next) => {
  if (!req.isGoldClient) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveMM = async (req, res, next) => {
  if (!req.isMMClient) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.vlResetPassMw = async (req, res, next) => {
  try {
    req.isAuth = true;
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) {
      return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
    }
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, keys.jwtKey);
    if (decoded._id) {
      const customer = await service.findById(decoded._id);
      if (customer && customer.isActive === false) {
        return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
      }
    }
    const user = await redis.getKey(`${decoded._id}:forgot_password:${token}`);
    if (!user || user === '') {
      return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
    }
    req.user = decoded;
    redis.getClient.del(`${decoded._id}:forgot_password:${token}`);
    return next();
  } catch (ex) {
    return next(new CustomError(ResponseMessages.INVALID_EXPIRED_TOKEN));
  }
};

module.exports.verifyIbAccMw = async (req, res, next) => {
  let body = {};
  if (req.params && req.params.id) {
    body = {
      ...body,
      tradingAccountId: req.params.id,
    };
  }
  if (req.query) {
    body = {
      ...body,
      ...req.query,
    };
  }
  if (req.body) {
    body = {
      ...body,
      ...req.body,
    };
  }
  const { tradingAccountFrom, tradingAccountTo } = body;
  try {
    if (tradingAccountFrom && tradingAccountTo) {
      const ibAcc = await accountService.findOne({
        login: tradingAccountFrom,
      });
      if (!ibAcc) { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
      const [acc1, acc2] = await accountService.find({
        login: {
          $in: [tradingAccountFrom, tradingAccountTo],
        },
        customerId: ibAcc.customerId._id,
      }, null, true, [{
        path: 'customerId',
        select: 'firstName lastName email',
      }]);
      if (acc1 && acc2) {
        return next();
      }
      const childs = await customerService.getChilds(
        ibAcc.customerId._id, 'LIVE',
      );
      if (!childs) return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR));
      for (let i = 0; i < childs[0].childs.length; i++) {
        const child = childs[0].childs[i];
        if (child.fx.liveAcc.includes(tradingAccountTo)) {
          return next();
        }
      }
      return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR));
    }
  } catch (error) {
    next(new CustomError(error.message));
  }
};

module.exports.checkCountLimitations = (limitation) => async (req, res, next) => {
  try {
    const settings = await settingService.findOne({});
    const { limitations } = settings;
    const limit = limitations[limitation];
    let length;
    switch (limitation) {
      case 'clients':
        length = (await customerService.find({
          $or: [{
            isLead: false,
          },
          {
            isLead: { $exists: false },
          }],
        })).length;
        // documents.length;
        break;
      case 'leads':
        length = (await customerService.find({ isLead: true })).length;

        break;
      case 'users':
        length = (await userService.find({
          $or: [{
            isHidden: false,
          },
          {
            isHidden: {
              $exists: false,
            },
          }],
        })).length;
        break;
      default:
        return next();
    }
    // const documents = await model.find({});
    if (length >= limit) {
      return next(new CustomError(ResponseMessages.LIMIT_EXCEEDED));
    }
    return next();
  } catch (error) {
    return next(new CustomError(ResponseMessages.INTERNAL_SERVER_ERROR));
  }
};
