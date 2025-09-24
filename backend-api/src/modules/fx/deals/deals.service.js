//
const { Sequelize, Op } = require('sequelize');
const { logger } = require('src/common/lib');
const moment = require('moment');
const { createPagination } = require('src/common/handlers');
const { Model, IbDealModel } = require('./deals.model');
const customerService = require('../../customers/customer.service');

module.exports.createCTrader = (params) => {
  logger.info('adding CTrader deal');
  logger.info(JSON.stringify(params));
   //params?.dealId = params?.dealId.substring(0,10);
  return Model.create({
    ...params,
    platform: 2,
  });
};
module.exports.createMT5 = (params) => {
  logger.info('adding MT5 deal');
  logger.info(JSON.stringify(params));
  //params?.dealId = params?.dealId.substring(0,10);
  return Model.create({
    ...params,
    platform: 0,
  });
};

module.exports.createMT4 = (params) => {
  logger.info('adding MT4 deal');
  return Model.create({
    ...params,
    platform: 1,
  });
};

module.exports.createIbDeal = (params) => {
  logger.info('adding IB deal');
  return IbDealModel.create({
    ...params,
  });
};

module.exports.getProductType = async (symbol) => {
  if(!global.fxProducts){
    const dictService = require('src/modules/services').dictionaryService;
    const data = await dictService.findDictionary();
    global.fxProducts = data[0] && data[0].products;
  }
  if (!symbol || !global.fxProducts) return null;
  const sym = symbol//.split('.')[0];
  const productKeys = Object.keys(global.fxProducts);
  for (let i = 0; i < productKeys.length; i++) {
    const key = productKeys[i];
    if (global.fxProducts[key].indexOf(sym) > -1) {
      return key;
    }
  }
  return null;
};

module.exports.getDealById = async (dealId, raw = false,) => {
  if (!dealId) return null;
  const query = {
    dealId,
  };
  const records = await Model.findOne({
    where: query,
    raw,
  });
  return records || null;
};

module.exports.getDealByClientDealId = async (clientDealId) => {
  if (!clientDealId) return null;
  const query = {
    clientDealId,
  };
  const records = await Model.findOne({
    where: query,
    raw: true,
  });
  return records || null;
};

module.exports.getClosedLotsForLogins = async (logins, dateFrom = new Date('01-01-2021'), dateTo = new Date()) => {
  const query = {
  };
  if (logins && logins.length > 0) {
    query.login = {
      [Op.in]: [...logins.map((l) => parseInt(l, 10))],
    };
  }
  query.action = {
    [Op.in]: [0, 1],
  };
  query.entry = {
    [Op.in]: [1],
  };
  query.createdAt = {
    [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
    [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
  };
  const records = await Model.findAll({
    where: query,
    attributes: [
      [Sequelize.fn('sum', Sequelize.col('volumeClosed')), 'lots'],
    ],
  });
  return records || [];
};

module.exports.getStatement = async (walletId, params, clientAccounts = []) => {
  const query = {
    walletId,
  };
  const { dateFrom = '01-01-2021', dateTo = new Date() } = params;
  query.createdAt = {
    [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
    [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
  };
  if (clientAccounts && clientAccounts.length > 0) {
    query.clientLogin = {
      [Op.in]: [0, ...clientAccounts.map((obj) => obj.login)],
    };
  }
  const limit = parseInt(params.limit, 10) || process.env.PAGINATION_LIMIT || 10;
  const page = parseInt(params.page, 10) || 1;
  const records = await Model.findAndCountAll({
    where: query,
    attributes: [
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN action=10 THEN profit ELSE 0 END')), 'rebate'],
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN action=18 THEN profit ELSE 0 END')), 'commission'],
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN clientEntry=1 THEN clientVolumeClosed ELSE 0 END')), 'lotsClosed'],
      [Sequelize.fn('sum', Sequelize.literal('CASE WHEN clientEntry=0 THEN clientVolume ELSE 0 END')), 'lotsOpened'],
      'clientLogin',
    ],
    limit,
    offset: ((page) - 1) * limit,
    group: 'clientLogin',
  });
  const pagination = createPagination(records.count.length, (page || 1), limit);
  records.rows = await Promise.all(records.rows.map(async (obj) => ({
    ...obj.dataValues,
    ...(clientAccounts.find((item) => item.login === obj.clientLogin) || {}),
    client: {
      firstName: ((await customerService.find({ [`fx.liveAcc`]: { $in: [obj.clientLogin] } })).pop() || {}).firstName,
      lastName: ((await customerService.find({ [`fx.liveAcc`]: { $in: [obj.clientLogin] } })).pop() || {}).lastName,
      refId: ((await customerService.find({ [`fx.liveAcc`]: { $in: [obj.clientLogin] } })).pop() || {})._id,
    }
  })));
  return {
    docs: records.rows,
    ...pagination,
  };
};

module.exports.getStatementDeals = async (walletId, params) => {
  const query = {
    walletId,
    clientLogin: params.clientLogin,
  };
  const { dateFrom = '01-01-2021', dateTo = new Date() } = params;
  query.createdAt = {
    [Op.gte]: moment(new Date(dateFrom)).format('YYYY-MM-DD'),
    [Op.lt]: moment(new Date(dateTo)).add(1, 'days').format('YYYY-MM-DD'),
  };
  const limit = parseInt(params.limit, 10) || process.env.PAGINATION_LIMIT || 10;
  const page = parseInt(params.page, 10) || 1;
  const records = await Model.findAndCountAll({
    include: {
      model: Model,
      as: 'clientDeal',
      attributes: ['entry', 'action', 'dealId', 'positionId', 'volume', 'volumeClosed', 'profit', 'time', 'login', 'symbol'],
      where: {
        entry: params.entry || 0,
      },
    },
    where: query,
    limit,
    offset: ((page) - 1) * limit,
  });
  const pagination = createPagination(records.count, page, limit);

  return {
    docs: records.rows,
    ...pagination,
  };
};

setTimeout(async () => {
  const dictService = require('src/modules/services').dictionaryService;
  const data = await dictService.findDictionary();
  global.fxProducts = data[0] && data[0].products;
}, 0);
