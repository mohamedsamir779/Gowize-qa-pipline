// trading service for handling trading accounts
const mongoose = require('mongoose');
const moment = require('moment');

const { logger } = require('src/common/lib');
const { getPlatform } = require('src/common/lib/helper');
const { CONSTANTS, keys } = require('src/common/data');

const {
  Cruds, createPagination, generatePassword, SendEvent,
} = require('src/common/handlers');

const { mt4Servie, mt5Servie } = require('../_connection');

const TradingAccount = require('./account.model');
const accTypeService = require('../../services').accountTypeService;

const calculationService = require('./calculation.service');
const { systemEmailService } = require('../../services');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../../common/data/constants');

// TODO take it out into a common folder
// const getPlatform = (platform = 'MT5') => {
//   switch (platform) {
//     case 'MT5':
//       return mt5Servie;
//     case 'MT4':
//       return mt4Servie;
//     case 'CTADER':
//       return ctraderSerivce;
//     default:
//       return null;
//   }
// }
const CENT = 100;
const accountService = new Cruds(TradingAccount.Model, TradingAccount.Schema);

module.exports = accountService;

let dealsService;
let customerService;
let walletService;

const isLoginAvailable = async (login, platform, isDemo) => {
  try {
    const acc = await getPlatform(platform).getAccount(login, isDemo, { noReject: true });
    return !(acc);
  } catch (error) {
    return false;
  }
};

const getSequencedLogin = async (accountTypeId, platform, isDemo) => {
  const sequence = await accTypeService.getNextSequence(accountTypeId);
  if (sequence === undefined) return undefined;
  const isValid = await isLoginAvailable(sequence, platform, isDemo);
  if (isValid) {
    return sequence;
  }
  return undefined;
};

module.exports.createAccount = async ({
  accountTypeId,
  customer,
  leverage = 400,
  password = generatePassword(),
  investorPassword = generatePassword(),
  currency = '',
  userId = null,
}, platform, isDemo = true, isRequested = false, isByAdmin = false) => {
  logger.info('-----call createAccount-------', customer, accountTypeId, platform, isDemo);
  if (!accountTypeId || !customer) throw new Error('Missing Params');
  const accType = await accTypeService.findOne({
    _id: accountTypeId,
    'currencies.currency': currency,
  }, 'currencies platform type title sequence');
  if (!accType) throw new Error('Invalid Account Type');
  const currencyObj = accType.currencies.find((obj) => obj.currency === currency) || {};
  const sequence = await getSequencedLogin(accountTypeId, platform, isDemo);
  const data = {
    ...customer,
    ...currencyObj,
    leverage,
    password,
    investorPassword,
  };
  if (sequence) {
    data.login = sequence;
  }
  let res = await getPlatform(platform).createAccount(data, isDemo);
  if (res && (res?.Login || res?.login)) {
    const acc = await accountService.create({
      accountTypeId,
      login: (res?.Login
        ? res?.Login
        : res?.login
      ),
      customerId: customer._id,
      type: accType.type,
      platform: accType.platform,
      currency: currencyObj.currency,
    });
    acc._doc.accountTypeId = accType;
    await customerService.addAccount(customer._id, res.login || res.Login, isDemo ? 'demo' : 'live');
    await customerService.updateById(customer._id, { 'stages.openAccount': true });
    if (accType.type === 'LIVE') {
      await customerService.makeFxLive(customer._id);
    }
    const content = {
      login: acc._doc.login,
      platform,
    };
    if (isRequested && !isByAdmin) {
      content.status = CONSTANTS.REQUESTS_STATUS.APPROVED;
    }
    if (isDemo) {
      await getPlatform(platform).deposit(res?.login || res.Login, CONSTANTS.DEMO_ACCOUNT_STARTING_BALANCE, 'DEMO Deposit', isDemo);
      res = await getPlatform(platform).getAccount(res?.login || res.Login, isDemo);
    }
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      isRequested && !isByAdmin ? LOG_TYPES.UPDATE_ACCOUNT_REQUEST : LOG_TYPES.ACCOUNT_CREATED,
      {
        customerId: customer._id,
        userId: userId ?? null,
        triggeredBy: userId ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content,
      },
    );
    systemEmailService.sendSystemEmail(
      // eslint-disable-next-line no-nested-ternary
      isRequested && !isByAdmin
        ? isDemo
          ? CONSTANTS.EMAIL_ACTIONS.DEMO_ACCOUNT_APPROVAL
          : CONSTANTS.EMAIL_ACTIONS.LIVE_ACCOUNT_APPROVAL
        : isDemo
          ? CONSTANTS.EMAIL_ACTIONS.DEMO_ACCOUNT_CREATION
          : CONSTANTS.EMAIL_ACTIONS.LIVE_ACCOUNT_CREATION,
      {
        to: customer.email,
        lang: customer?.language,
      }, {
        ...customer,
        ...acc._doc,
        password,
        investorPassword,
        platformLink: keys.platformLink,
        demoServer: keys.demoServer,
        liveServer: keys.liveServer,
      },
    );
    const MarginFree = isDemo ? CONSTANTS.DEMO_ACCOUNT_STARTING_BALANCE : 0;
    if (res && res.leverageInCents) {
      res.leverageInCents = res.leverageInCents > 0
        ? res.leverageInCents / CENT
        : 0;
    }
    return res ? {
      ...acc._doc,
      ...res,
      Equity: res.Balance || 0,
      MarginLeverage: res.Leverage || 0,
      MarginFree,
      MarginLevel: 0,
      Margin: 0,
    } : {
      ...acc._doc,
      Equity: res.Balance || 0,
      MarginLeverage: res.Leverage || 0,
      MarginFree,
      MarginLevel: 0,
      Margin: 0,
    };
  }
  throw new Error('Error creating Account');
};

module.exports.createIbAccount = async ({
  customer,
  leverage = 100,
  password = generatePassword(),
  investorPassword = generatePassword(),
  generateWallet = true,
}) => {
  if (!customer) throw new Error('Missing Params');
  logger.info(['-----call createIbAccount-------', customer.email]);
  if (!generateWallet) {
    const accTypes = await accTypeService.find({ type: 'IB' });
    const promiseAcc = accTypes.map((obj) => getPlatform(obj.platform).createAccount({
      ...customer,
      ...obj,
      password,
      investorPassword,
      leverage,
    }, false));
    const accounts = await Promise.all(promiseAcc);

    if (accounts && accounts.length === accTypes.length) {
      const accDb = accounts.map((obj, index) => {
        const login = (obj.Login) ? (obj.Login) : (obj.login);
        customerService.addAccount(customer._id, login, `ib${accTypes[index].platform}`);

        systemEmailService.sendSystemEmail(
          CONSTANTS.EMAIL_ACTIONS.IB_ACCOUNT_CREATION, {
            to: customer.email,
            lang: customer?.language,
          }, {
            ...customer,
            login,
            platform: accTypes[index].platform,
            password,
            investorPassword,
          },
        );

        return accountService.create({
          accountTypeId: accTypes[index]._id,
          login,
          customerId: customer._id,
          type: accTypes[index].type,
          platform: accTypes[index].platform,
          currency: accTypes[index].currency,
        });
      });
      const accDbCreated = await Promise.all(accDb);
      await customerService.updateById(customer._id, {
        'fx.isIb': true,
        'stages.ib.partnershipAgreement': true,
      });
      return accDbCreated;
    }
    throw new Error('Error creating IB Account');
  } else {
    const wallet = await walletService.createIbWallet({
      customerId: customer._id,
      currency: customer.currency,
    });
    if (wallet) {
      await customerService.updateById(customer._id, {
        'fx.isIb': true,
        'stages.ib.partnershipAgreement': true,
      });
      return wallet;
    }
    throw new Error('Error creating IB Wallet');
  }
};

module.exports.getCustomerAccsWithState = async (params) => {
  const rec = await accountService.findWithPagination(params, {
    populate: [{
      path: 'createdBy',
      select: 'firstName lastName',
    }, {
      path: 'accountTypeId',
      select: 'title platform type minDeposit minWithdrawal',
    }, {
      path: 'customerId',
      select: 'firstName lastName email',
    }],
  });
  const mt5Accs = rec.docs.filter((obj) => obj.platform === 'MT5').map((obj) => ({
    login: obj.login,
    isDemo: obj.type === 'DEMO',
  }));
  const mt4Accs = rec.docs.filter((obj) => obj.platform === 'MT4').map((obj) => ({
    login: obj.login,
    isDemo: obj.type === 'DEMO',
  }));
  const ctAccs = rec.docs.filter((obj) => obj.platform === 'CTRADER').map((obj) => ({
    login: obj.login,
    isDemo: obj.type === 'DEMO',
  }));
  const mt5Equities = await Promise.all(mt5Accs.map((obj) => getPlatform('MT5').getEquity(obj.login, obj.isDemo)));
  const mt4Equities = await Promise.all(mt4Accs.map((obj) => getPlatform('MT4').getEquity(obj.login, obj.isDemo)));
  const ct4Equities = await Promise.all(ctAccs.map((obj) => getPlatform('CTRADER').getEquity(obj.login, obj.isDemo)));
  
  rec.docs.forEach((obj, index) => {
    const accState = obj.platform === 'MT5'
      ? mt5Equities.find((acc) => acc.Login === obj.login.toString())
      : obj.platform === 'MT4' ? mt4Equities.find((acc) => acc.Login.toString() === obj.login.toString())
        : ct4Equities.find((acc) => acc?.login?.toString() === obj?.login?.toString());
    console.log(`Got ${obj.login} =>`, accState, ct4Equities);

    if (accState) {
      if (obj.platform === 'CTRADER') {
        accState.balance = accState?.balance > 0
          ? accState?.balance / 100
          : 0.00;
        accState.equity = accState?.equity > 0
          ? accState?.equity / 100
          : 0.0;
        accState.cashEquity = accState?.cashEquity > 0
          ? accState?.cashEquity / 100
          : 0.0;
        accState.bonus = accState?.bonus > 0
          ? accState?.bonus / 100
          : 0.0;
        accState.leverageInCents = accState?.leverageInCents > 0
          ? accState?.leverageInCents / CENT
          : 0;
        accState.usedMargin = accState?.usedMargin > 0
          ? accState?.usedMargin / 100
          : 0;
        accState.freeMargin = accState?.freeMargin > 0
          ? accState?.freeMargin / 100
          : 0;
      }
    }
    rec.docs[index] = {
      ...obj,
      ...accState,
    };
  });
  return rec;
};

module.exports.linkAccount = async ({
  customerId,
  accountTypeId,
  login,
  currency,
}, isDemo) => {
  logger.info('-----call linkAccount-------', customerId, login, isDemo);
  const isAlreadythere = await accountService.findOne({ login });
  if (isAlreadythere) throw new Error('Account already exists');
  const accType = await accTypeService.findOne({
    _id: accountTypeId,
    'currencies.currency': currency,
  }, 'title currencies platform type');
  if (!accType) throw new Error('Invalid account type');
  await customerService.addAccount(customerId, login, isDemo ? 'demo' : 'live');
  const account = await accountService.create({
    customerId,
    accountTypeId,
    login,
    platform: accType.platform,
    type: accType.type,
    currency,
  });
  const equity = await getPlatform(accType.platform).getEquity(login, isDemo);
  return { ...account, ...equity, title: accType.title };
};

module.exports.getAccount = async (login, platform, isDemo = true) => (
  getPlatform(platform).getAccount(login, isDemo)
);

module.exports.getEquity = async (login, platform, isDemo = true) => {
  logger.info('-----call getEquity-------', login, platform, isDemo);
  return getPlatform(platform).getEquity(login, isDemo);
};

module.exports.getEquityIbSummary = async (loginArr, platform) => {
  logger.info('-----getEquityIbSummary-------');
  const equityArr = await getPlatform(platform).getEquity(loginArr, false);
  const equityArray = Object.values(equityArr);
  return equityArray.reduce((n, { Equity }) => n + parseFloat(Equity), 0);
};

module.exports.getBalance = async (login, platform, isDemo = true) => {
  logger.info('-----call getBalance-------', login, platform, isDemo);
  return getPlatform(platform).getBalance(login, isDemo);
};

module.exports.updateAccount = async (login, params, platform, isDemo = true) => {
  logger.info('-----updateAccount-------', login, params, platform, isDemo);
  return getPlatform(platform).updateAccount(login, params, isDemo);
};

module.exports.changePassword = async (login, type, password, platform, isDemo = true) => {
  logger.info('-----changePassword-------', login, type, password, isDemo);
  return getPlatform(platform).changePassword(login, type, password, isDemo);
};

module.exports.changeLeverage = async (login, leverage, platform, isDemo = true) => {
  logger.info('-----changeLeverage-------', 'Hello', login, leverage, platform, isDemo);
  const acc = await getPlatform(platform).getAccount(login, isDemo);
  if (!acc) throw new Error('Account not found');
  if (platform === 'CTRADER') {
    if (acc.leverageInCents === leverage * CENT) throw new Error('Cannot change leverage to the same value');
    return getPlatform(platform).updateAccount(login, { leverageInCents: leverage * CENT, maxLeverage: leverage * CENT }, isDemo);
  }
  if (acc.Leverage.toString() === leverage) throw new Error('Cannot change leverage to the same value');
  return getPlatform(platform).updateAccount(login, { leverage }, isDemo);
};

module.exports.changeGroup = async ({
  accountTypeId,
  login,
}, platform) => {
  logger.info('-----call changeGroup-------', login);
  const account = await accountService.findOne({ login }, 'currency accountTypeId');
  if (accountTypeId === account.accountTypeId.toString()) throw new Error('Cannot change type to the same value');
  const accType = await accTypeService.findOne({
    _id: accountTypeId,
  }, 'currencies platform type');
  if (!accType) throw new Error('Invalid account type');
  const group = accType.currencies.find((obj) => obj.currency === account.currency)?.groupPath;
  if (!group) throw new Error('New account type doesn\'t have the same currency');
  accountService.updateById(account._id, { accountTypeId });
  const groupName = platform === 'CTRADER'
    ? { groupName: group }
    : { group };
  return getPlatform(platform).updateAccount(login, groupName, accType.type === 'DEMO');
};

module.exports.changeAccess = async (login, activate, platform) => {
  logger.info('-----changeAccess-------', login, activate, platform);
  const account = await accountService.findOne({ login }, 'isActive');
  if (account.isActive === activate) throw new Error(`Account already ${activate ? 'activated' : 'deactived'}`);
  accountService.updateById(account._id, { isActive: activate });
  const userRights = await getPlatform(platform).getUserRights(login, account.type === 'DEMO');
  const rights = activate
    ? { ...userRights, USER_RIGHT_TRADE_DISABLED: false }
    : { ...userRights, USER_RIGHT_TRADE_DISABLED: true };
  return getPlatform(platform).setUserRights(login, rights, account.type === 'DEMO');
};

// extra functions

module.exports.deductCommission = async (params, platform, isDemo = true) => {
  logger.info('-----call-------', params, platform, isDemo);
  return {
    login: 1001,
    Equity: 100,
  };
};

module.exports.addCommission = async (params, platform, isDemo = true) => {
  logger.info('-----call-------', params, platform, isDemo);
  return {
    login: 1001,
    Equity: 100,
  };
};

module.exports.addRebate = async (params, platform, isDemo = true) => {
  logger.info('-----call-------', params, platform, isDemo);
  return {
    login: 1001,
    Equity: 100,
  };
};

module.exports.getOpenPositions = async (login, page = 1, limit = 15, platform, isDemo = true) => {
  logger.info('-----getOpenPositions-------', login, platform, isDemo);
  page = parseInt(page);
  limit = parseInt(limit);

  const positions = platform === 'MT4'
    ? await getPlatform(platform).getOpenPositions(login, isDemo)
    : await getPlatform(platform).getOpenPositions({
      login, total: limit, offset: (page - 1) * limit,
    }, isDemo);
  if (platform != 'CTRADER') {
    const totals = platform === 'MT4' ? positions?.length || 0 : await getPlatform(platform).getTotalOpenPositions(login, isDemo);
    const pagination = createPagination(totals.total, page, limit);
    return {
      docs: positions,
      ...pagination,
    };
  }
  const totals = positions.length ?? 0;
  const pagination = createPagination(totals.total, page, limit);
  return {
    docs: positions,
    ...pagination,
  };
};

module.exports.getAccWithParents = async (tradingAccountId) => {
  const agg = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(tradingAccountId),
      },
    }, {
      $graphLookup: {
        from: 'customers',
        startWith: '$customerId',
        connectFromField: 'parentId',
        connectToField: '_id',
        as: 'parents',
        maxDepth: keys.ibLevelDefault,
        depthField: 'level',
      },
    }, {
      $addFields: {
        parents: {
          $map:
          {
            input: '$parents',
            as: 'item',
            in: {
              firstName: '$$item.firstName',
              lastName: '$$item.lastName',
              email: '$$item.email',
              level: '$$item.level',
              fx: '$$item.fx',
              parentId: '$$item.parentId',
              _id: '$$item._id',
            },
          },
        },
      },
    },
  ];
  const account = await accountService.aggregate(agg);
  return account[0] || {};
};

module.exports.getClosedPositions = async (login, page, limit, platform, isDemo = true) => {
  logger.info('-----getClosedPositions-------', login, platform, isDemo);
  page = parseInt(page || 1, 10);
  limit = parseInt(limit || 10, 10);
  const fromDate = '01/01/2000 00:00:00';
  const toDate = moment().hour(23).minute(59).second(59)
    .format('MM/DD/YYYY HH:mm:ss');
  const deals = await getPlatform(platform).getAllPositions({
    login, total: Infinity, offset: Infinity, fromDate, toDate,
  }, isDemo);
  const positions = (platform === 'MT4' || platform === 'CTRADER')
    ? deals
    : (deals.filter((deal) => (deal.Entry === '1' || (deal.Entry === '3' && deal.Profit !== '0'))));
  // Create pagination for above positions sort by Time
  const docs = positions.sort((a, b) => (a.Time > b.Time ? -1 : 1));
  const paginatedDocs = docs.slice((page - 1) * limit, page * limit);
  const pagination = createPagination(docs.length, page, limit);
  return {
    docs: paginatedDocs,
    ...pagination,
  };
};

module.exports.processCommission = async (deal) => {
  try {
    const account = await accountService.findOne({
      login: deal.login,
      type: CONSTANTS.TRADING_ACCOUNT_TYPES.LIVE,
    }, 'login accountTypeId platform', {
      populate: [{
        path: 'customerId',
        select: 'fx _id parentId',
        model: 'customers',
        populate: {
          path: 'fx.agrementId',
          // select: 'f',
          model: 'IbAgrement',
        },
      }],
    });
    if (
      !account
      || !account.customerId
      || !account.customerId.fx
      || !account.customerId.fx.agrementId
    ) return true;
    const agrement = account.customerId.fx.agrementId;
    await calculationService.runCommission(agrement, account, deal);
    return true;
  } catch (err) {
    logger.error(err || err.message);
    return false;
  }
};

module.exports.processRebate = async (deal) => {
  try {
    const account = await accountService.findOne({
      login: deal.login,
      type: CONSTANTS.TRADING_ACCOUNT_TYPES.LIVE,
    }, 'login accountTypeId platform', {
      populate: [{
        path: 'customerId',
        select: 'fx _id parentId',
        model: 'customers',
        populate: {
          path: 'fx.agrementId',
          // select: 'f',
          model: 'IbAgrement',
        },
      }],
    });
    if (
      !account
      || !account.customerId
      || !account.customerId.fx
      || !account.customerId.fx.agrementId
    ) return true;
    const agrement = account.customerId.fx.agrementId;
    await calculationService.runRebate(agrement, account, deal);
    return true;
  } catch (err) {
    logger.error(err);
    return false;
  }
};

module.exports.getCustomersByLogins = async (logins) => {
  const customers = await accountService.aggregate([
    {
      $match: {
        login: { $in: logins },
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: 'customerId',
        foreignField: '_id',
        as: 'customer',
      },
    },
    {
      $unwind: '$customer',
    },
    {
      $project: {
        customerId: '$customer._id',
        firstName: '$customer.firstName',
        lastName: '$customer.lastName',
        email: '$customer.email',
        login: '$login',
        accountTypeId: '$accountTypeId',
      },
    },
  ]);
  return customers;
};

module.exports.getUnfundedAccounts = async (params = {}) => {
  const aggregation = [];
  const match = {
    $match: {
      type: 'LIVE',
    },
  };
  if (params.createdAt) {
    match.$match.createdAt = params.createdAt;
  }
  aggregation.push(match);
  const lookup = {
    $lookup: {
      from: 'customers',
      localField: 'customerId',
      foreignField: '_id',
      as: 'customer',
      pipeline: [
        {
          $project: {
            firstName: 1,
            lastName: 1,
            email: 1,
            agent: 1,
          },
        },
      ],
    },
  };
  aggregation.push(lookup);
  aggregation.push(
    {
      $unwind: '$customer',
    },
  );
  aggregation.push(
    {
      $addFields: {
        agent: '$customer.agent',
      },
    },
  );
  aggregation.push(
    {
      $lookup: {
        from: 'users',
        localField: 'agent',
        foreignField: '_id',
        as: 'agent',
        pipeline: [
          {
            $project: {
              firstName: 1,
              lastName: 1,
              email: 1,
            },
          },
        ],
      },
    },
  );
  aggregation.push(
    {
      $lookup: {
        from: 'transactionsfxes',
        let: {
          tradingAccountId: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$tradingAccountId', '$$tradingAccountId',
                    ],
                  },
                  {
                    $eq: [
                      '$status', 'APPROVED',
                    ],
                  },
                  {
                    $eq: [
                      '$type', 'DEPOSIT',
                    ],
                  },
                ],
              },
            },
          },
        ],
        as: 'transactions',
      },
    },
  );
  aggregation.push(
    {
      $addFields: {
        size: {
          $size: '$transactions',
        },
      },
    },
  );
  aggregation.push(
    {
      $match: {
        size: 0,
      },
    },
  );
  if (params.agent) {
    aggregation.push(
      {
        $match: {
          'customer.agent': mongoose.Types.ObjectId(params.agent),
        },
      },
    );
  }
  const accounts = await accountService.aggregateWithPagination(aggregation, {
    page: params.page || 1,
    limit: params.limit || 10,
  });
  return accounts;
};

const mapDeal = (rows) => rows.map((obj) => ({
  dealId: obj.Deal,
  positionId: obj.PositionID,
  login: parseInt(obj.Login, 10),
  mt5Account: parseInt(obj.Login, 10),
  action: parseInt(obj.Action, 10),
  entry: parseInt(obj.Entry, 10),
  contractSize: parseInt(obj.ContractSize, 10),
  time: parseFloat(obj.Time, 10),
  timeMsc: parseInt(obj.TimeMsc, 10),
  symbol: obj.Symbol,
  convertedSymbol: obj.Symbol.split('.')[0],
  price: obj.Price,
  volume: parseInt(obj.Volume, 10),
  volumeExt: parseInt(obj.VolumeExt, 10),
  profit: parseFloat(obj.Profit),
  commission: obj.Commission,
  fee: obj.Fee,
  rateProfit: parseFloat(obj.RateProfit),
  rateMargin: parseFloat(obj.RateMargin),
  volumeClosed: parseInt(obj.VolumeClosed, 10),
  lots: parseInt(obj.VolumeClosed, 10) / 10000,
  volumeClosedExt: parseInt(obj.VolumeClosedExt, 10),
  priceGateway: obj.PriceGateway,
  comment: obj.Comment,
  swap: obj.Storage || 0.00,
  ticket: obj.Deal,
  type: obj.Type,
  priceSl: obj.PriceSL,
  priceTp: obj.PriceTP,
  pricePosition: obj.PricePosition,
  priceOpen: obj.PriceOpen,
  priceCurrent: obj.PriceCurrent,
}));

module.exports.getAllDealsForLogin = async (login, from, to, platform, isDemo = false) => {
  logger.info(`-------fetching all deals for login ${login} from ${new Date(from)} to ${new Date(to)}---------`);
  const total = await getPlatform(platform).getTotalAllPositions(login, from, to, isDemo);
  let records = [];
  const limit = 100;
  const pages = Math.ceil(parseInt(total.total, 10) / limit);
  for (let index = 0; index < pages; index++) {
    const deals = await getPlatform(platform).getAllPositions({
      login,
      from,
      to,
      limit,
      total: parseInt(total.total, 10),
      offset: (index) * limit,
    }, isDemo);
    records = records.concat(mapDeal(deals));
  }
  return records;
};

setTimeout(() => {
  // eslint-disable-next-line global-require
  customerService = require('src/modules/services').customerService;
  dealsService = require('src/modules/services').dealsService;
  walletService = require('src/modules/services').walletService;
}, 0);
