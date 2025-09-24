const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const service = require('src/modules/services').customerService;
const {
  accountService, userService, customerService, customerPinService, settingService,
} = require('src/modules/services');

const { keys, ResponseMessages, CONSTANTS } = require('src/common/data');
const { redis, logger } = require('src/common/lib');
const {
  CustomError, parseJoiObject, generateUuid, addCustomerPortals,
} = require('src/common/handlers');

module.exports.authMW = async (req, res, next) => {
  try {
    const ip = req.headers['x-real-ip'];
    logger.info(['Request IP => ', ip, req.params, req.body, req.query, req.headers, req.url, req.method, req.path]);
    req.isAuth = true;
    let token = req.headers['x-access-token'] || req.headers.authorization;
    if (!token) {
      return next(new CustomError(ResponseMessages.MISSING_TOKEN));
    }
    token = token.replace('Bearer ', '');
    const decoded = jwt.verify(token, keys.jwtKey);
    if (decoded._id) {
      const customer = await service.findById(decoded._id);
      if (customer && customer.isActive === false) {
        return next(new CustomError(ResponseMessages.INVALID_TOKEN));
      }
      req.customer = customer;
      addCustomerPortals(customer, req);
    }
    const user = await redis.getKey(`${decoded._id}:${token}`);
    if (!user || user === '') {
      return next(new CustomError(ResponseMessages.INVALID_TOKEN));
    }
    req.user = decoded;
    return next();
  } catch (ex) {
    return next(new CustomError(ResponseMessages.INVALID_TOKEN));
  }
};

module.exports.valMW = (validationObject, isGet = false) => (req, res, next) => {
  req.apiParams = parseJoiObject(validationObject);
  const body = isGet ? req.query : req.body;
  const { error } = validationObject && validationObject.validate(body) || {};
  if (error) {
    return next(new CustomError({
      ...ResponseMessages.JOI_VALIDATION_ERROR,
      message: error.message,
    }));
  }
  return next();
};

module.exports.vlPathMw = (validationObject) => (req, res, next) => {
  req.pathParams = parseJoiObject(validationObject);
  const body = req.params;
  const { error } = validationObject && validationObject.validate(body) || {};
  if (error) {
    return next(new CustomError({
      ...ResponseMessages.JOI_VALIDATION_ERROR,
      message: error.message,
    }));
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

module.exports.addUniqueId = (req, res, next) => {
  // eslint-disable-next-line prefer-destructuring
  req.ip = req.ip.split(':')[0];
  req.uid = generateUuid();
  logger.info(['request ID => ', req.uid]);
  return next();
};

module.exports.verifyAccMw = (isGet, forceAccChk = true) => async (req, res, next) => {
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
  const { tradingAccountId, tradingAccountFrom, tradingAccountTo } = body;
  if (tradingAccountId) {
    const tradingAccount = await accountService.findOne({
      _id: tradingAccountId,
      customerId: req.user._id,
    }, null, true, [{
      path: 'customerId',
      select: 'firstName lastName email',
    }]);
    // eslint-disable-next-line max-len
    if (tradingAccount) { req.tradingAccount = tradingAccount; } else { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  } else if (tradingAccountFrom && tradingAccountTo) {
    const [acc1, acc2] = await accountService.find({
      _id: {
        $in: [tradingAccountFrom, tradingAccountTo],
      },
      customerId: req.user._id,
    }, null, true, [{
      path: 'customerId',
      select: 'firstName lastName email',
    }]);
    if (acc1 && acc2) {
      req.tradingAccountFrom = acc1._id.toString() === tradingAccountFrom ? acc1 : acc2;
      req.tradingAccountTo = acc2._id.toString() === tradingAccountTo ? acc2 : acc1;
    } else { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  } else if (forceAccChk) { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
  return next();
};

module.exports.haveCrypto = async (req, res, next) => {
  if (!req.isCryptoClient) {
    return next(new CustomError(ResponseMessages.ACCESS_DENIED));
  }
  return next();
};

module.exports.haveCryptoDemo = async (req, res, next) => {
  if (!req.isCryptoDemo) {
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

/* checking if ibRef, Ref or agRef are sent as req query
    if so then checkReqQuery() should add them as params */
module.exports.checkReqQuery = async (req, res, next) => {
  let params = {};

  // adding ibRef
  if (req.query.ibRef) {
    params = {
      ...params,
      ibRef: req.query.ibRef,
    };
  }

  // adding Ref
  if (req.query.Ref) {
    params = {
      ...params,
      Ref: req.query.Ref,
    };
  }

  // adding agRef
  if (req.query.agRef) {
    params = {
      ...params,
      agRef: req.query.agRef,
    };
  }
  req.addedParams = {
    ...params,
  };
  return next();
};

module.exports.verifyIbAccMw = (isGet) => async (req, res, next) => {
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
      const ibAcc = await accountService.find({
        customerId: mongoose.Types.ObjectId(req.user._id),
        login: tradingAccountFrom,
      });
      if (!ibAcc) { return next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR)); }
      const [acc1, acc2] = await accountService.find({
        login: {
          $in: [tradingAccountFrom, tradingAccountTo],
        },
        customerId: req.user._id,
      }, null, true, [{
        path: 'customerId',
        select: 'firstName lastName email',
      }]);
      if (acc1 && acc2) {
        return next();
      }
      const childs = await customerService.getChilds(
        req.user._id, 'LIVE',
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
    next(new CustomError(ResponseMessages.JOI_VALIDATION_ERROR));
  }
};
module.exports.validateEmailPin = async (req, res, next) => {
  try {
    const pinVerified = await customerPinService.verifyEmailPin(req.body.email?.toLowerCase(),
      req.body.emailPin);
    if (!pinVerified) throw new Error('Email Pin is not correct');
    else next();
  } catch (error) {
    next(new CustomError(error));
  }
};
module.exports.checkCountLimitations = (limitation) => async (req, res, next) => {
  try {
    const settings = await settingService.findOne({});
    const { limitations } = settings;
    if(limitations){
      const limit = limitations[limitation];
      if (!limit) next();
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
      if (length >= limit) {
        return next(new CustomError(ResponseMessages.LIMIT_EXCEEDED));
      }
    }
    return next();
  } catch (error) {
    return next(new CustomError(ResponseMessages.INTERNAL_SERVER_ERROR));
  }
};
