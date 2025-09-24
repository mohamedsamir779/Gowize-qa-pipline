// trading service for handling trading accounts
const moment = require('moment');
const { CONSTANTS } = require('src/common/data');
const { logger } = require('src/common/lib');
const { getPlatform } = require('src/common/lib/helper');
const { Cruds, SendEvent, dbConnectionUpCb } = require('src/common/handlers');
const mongoose = require('mongoose');
const { mt4Servie, mt5Servie } = require('../_connection');

const TransactionModel = require('./transaction.model');
const {
  accountService,
  systemEmailService,
  customerService,
} = require('../../services');
const { EVENT_TYPES, PUSH_NOTIFICATION_GROUPS } = require('../../../common/data/constants');

const { APPROVED, REJECTED } = CONSTANTS.TRANSACTIONS_STATUS;

const transactionService = new Cruds(
  TransactionModel.Model,
  TransactionModel.Schema,
);

// module.exports = transactionService;
// const getPlatform = (platform = 'MT5') => (platform === 'MT5' ? mt5Servie : mt4Servie);

const populate = [
  {
    path: 'customerId',
    select: 'firstName lastName category',
  },
  {
    path: 'tradingAccountId',
    select: 'login platform currency type',
  },
  {
    path: 'tradingAccountFrom',
    select: 'login platform currency type',
  },
  {
    path: 'tradingAccountTo',
    select: 'login platform currency type',
  },
];

const getAggregation = (type, searchText = '', params = {}, regex) => {
  const { agent, customerId, ...rest } = params;
  let agg = [];
  let match = { ...rest };
  if (customerId) {
    match = { ...match, type, customerId: mongoose.Types.ObjectId(customerId) };
  }
  if (regex) {
    match = {
      ...match,
      $or: [
        {
          $expr: {
            $regexMatch: {
              input: { $toString: '$recordId' },
              regex,
            },
          },
        },
      ],
    };
  }
  switch (type) {
    case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
    case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
    case CONSTANTS.TRANSACTIONS_TYPES.CREDIT:
      agg = [
        {
          $match: {
            ...match,
            type,
          },
        }, {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
            pipeline: [
              {
                $project: {
                  agent: 1,
                  firstName: 1,
                  lastName: 1,
                  category: 1,
                },
              },
            ],
          },
        }, {
          $unwind: {
            path: '$customer',
            includeArrayIndex: 'a',
            preserveNullAndEmptyArrays: false,
          },
        }, {
          $lookup: {
            from: 'tradingaccounts',
            localField: 'tradingAccountId',
            foreignField: '_id',
            as: 'tradingAccountId',
            pipeline: [
              {
                $project: {
                  login: 1,
                  platform: 1,
                  currency: 1,
                  type: 1,
                },
              },
            ],
          },
        }, {
          $addFields: {
            agent: '$customer.agent',
            customerId: '$customer',
            tradingAccountId: {
              $arrayElemAt: [
                '$tradingAccountId', 0,
              ],
            },
          },
        },
      ];
      break;
    case CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER:
      agg = [
        {
          $match: {
            ...match,
            ...rest,
            type,
            // $text: { $search: searchText },
          },
        }, {
          $lookup: {
            from: 'customers',
            localField: 'customerId',
            foreignField: '_id',
            as: 'customer',
            pipeline: [
              {
                $project: {
                  agent: 1,
                  firstName: 1,
                  lastName: 1,
                  category: 1,
                },
              },
            ],
          },
        }, {
          $unwind: {
            path: '$customer',
            includeArrayIndex: 'a',
            preserveNullAndEmptyArrays: false,
          },
        }, {
          $lookup: {
            from: 'tradingaccounts',
            localField: 'tradingAccountFrom',
            foreignField: '_id',
            as: 'tradingAccountFrom',
            pipeline: [
              {
                $project: {
                  login: 1,
                  platform: 1,
                  currency: 1,
                  type: 1,
                },
              },
            ],
          },
        }, {
          $lookup: {
            from: 'tradingaccounts',
            localField: 'tradingAccountTo',
            foreignField: '_id',
            as: 'tradingAccountTo',
            pipeline: [
              {
                $project: {
                  login: 1,
                  platform: 1,
                  currency: 1,
                  type: 1,
                },
              },
            ],
          },
        }, {
          $addFields: {
            agent: '$customer.agent',
            customerId: '$customer',
            tradingAccountFrom: {
              $arrayElemAt: [
                '$tradingAccountFrom', 0,
              ],
            },
            tradingAccountTo: {
              $arrayElemAt: [
                '$tradingAccountTo', 0,
              ],
            },
          },
        },
      ];
      break;
    default:
      agg = [];
  }
  if (agent) {
    agg.push({
      $match: {
        agent,
      },
    });
  }
  agg.push({
    $lookup: {
      from: 'users',
      localField: 'agent',
      foreignField: '_id',
      as: 'agent',
      // pipeline: [
      //   {
      //     $project: {
      //       firstName: 1,
      //       lastName: 1,
      //       email: 1,
      //     },
      //   },
      // ],
    },
  });
  return agg;
};

const deposit = async (
  login,
  amount,
  comment = '',
  platform,
  isDemo = true,
) => {
  logger.info(['-----deposit-------', login, amount, comment, platform, isDemo]);
  return getPlatform(platform).deposit(login, amount, comment, isDemo);
};

const withdraw = async (
  login,
  amount,
  comment = '',
  platform,
  isDemo = true,
) => {
  logger.info(['-----withdraw-------', login, amount, comment, platform, isDemo]);
  const tradingState = await getPlatform(platform).getEquity(login, isDemo);
  if (!tradingState) throw Error('Not able to fetch account details');
  if (
    parseFloat(amount) > parseFloat(tradingState.Balance)
    || parseFloat(amount) > parseFloat(tradingState.FreeMargin)
  ) {
    throw new Error('Not enough Balance');
  }
  return getPlatform(platform).withdraw(login, amount, comment, isDemo);
};

const creditInOut = async (
  login,
  amount,
  type = 'CREDIT_IN',
  platform,
  isDemo = true,
  note,
) => (platform === 'CTRADER'
  ? getPlatform(platform).credit(login, amount, note, type, isDemo)
  : getPlatform(platform).credit(login, amount, type, isDemo));
// login, balance, comment, type, isDemo
module.exports.addApprovedDeposit = async (params, accountObj, content = {}) => {
  const depObj = await deposit(
    accountObj.login,
    params.amount,
    `${CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT}_${params.gateway}`,
    accountObj.platform,
    accountObj.type === 'DEMO',
  );
  if (depObj) {
    const transObj = await transactionService.create({
      ...params,
      isApproving: true,
      type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
      status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
      content,
    });
    await customerService.updateById(mongoose.Types.ObjectId(params.customerId),
      { 'stages.madeDeposit': true });
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: params.amount,
          gateway: params.gateway,
          platform: accountObj.platform,
          login: accountObj.login,
        },
      },
    );
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(params.customerId),
      {},
      { lean: true },
    );
    if (custData.agent) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to: [custData.agent],
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: transObj.recordId,
            type: transObj.status || '',
            currency: transObj.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: accountObj.platform,
            login: accountObj.login,
          },
        },
      );
    }
    if (custData.parent) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.CLIENT.LINKED_DEPOSITS,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'CLIENT'),
          to: [custData.parent],
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: transObj.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            currency: transObj.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: accountObj.platform,
            login: accountObj.login,
          },
        },
      );
    }
    return transObj;
  }
  throw new Error('Error adding Deposit');
};

module.exports.createGatewayDeposit = async (params, content) => {
  const { tradingAccountId } = params;
  const tradingAccount = await accountService.findById(
    mongoose.Types.ObjectId(tradingAccountId),
  );
  params.customerId = tradingAccount.customerId;
  const trans = await transactionService.create({
    ...params,
    tradingAccountId: tradingAccount._id,
    type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
    content,
  });
  const customerDetails = await customerService.findById(params.customerId);
  const to = params.userId
    ? [params.userId.toString(), params.customerId.toString()]
    : [params.customerId.toString()];
  switch (params.status) {
    case 'PENDING':
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__PENDING,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to,
        },
        {
          client: {
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            email: customerDetails.email,
            recordId: customerDetails.recordId,
            _id: customerDetails._id.toString(),
          },
          transaction: {
            recordId: trans.recordId,
            type: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            currency: trans.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      return trans;
    case 'REJECTED':
      await transactionService.updateById(trans._id, {
        status: REJECTED,
        reason: params.reason,
      });
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          content: {
            amount: params.amount,
            gateway: params.gateway,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__REJECTED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to,
        },
        {
          client: {
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            email: customerDetails.email,
            recordId: customerDetails.recordId,
            _id: customerDetails._id.toString(),
          },
          transaction: {
            recordId: trans.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      return trans;
    case 'APPROVED':
      // IT WILL BE HANDLED OUTSIDE OF THIS switch CASE
      break;
    default:
      return trans;
  }
  try {
    const depObj = await deposit(
      tradingAccount.login,
      params.amount,
      `${CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT}_${params.gateway}`,
      tradingAccount.platform,
      tradingAccount.type === 'DEMO',
    );
    if (!depObj) throw new Error('Unable to deposit');
    await transactionService.updateById(trans._id, {
      status: APPROVED,
      paid: params.amount,
    });
    const uTrans = await transactionService.findById(trans._id, {}, true);
    if (uTrans) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          content: {
            amount: params.amount,
            gateway: params.gateway,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      await customerService.updateById(mongoose.Types.ObjectId(params.customerId),
        { 'stages.madeDeposit': true },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to,
        },
        {
          client: {
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            email: customerDetails.email,
            recordId: customerDetails.recordId,
            _id: customerDetails._id.toString(),
          },
          transaction: {
            recordId: trans.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
    }
    return uTrans;
  } catch (err) {
    await transactionService.updateById(trans._id, {
      status: REJECTED,
      reason: err.message,
    });
    const uTrans = await transactionService.findById(trans._id, {}, true);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: params.amount,
          gateway: params.gateway,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          recordId: customerDetails.recordId,
          _id: customerDetails._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    return uTrans;
  }
};

module.exports.updateGatewayDeposit = async (params = {}, content = {}) => {
  const { txId } = params;
  const trans = await transactionService.findOne({ txId });
  if (!trans) throw new Error('Transaction not found');
  const tradingAccount = await accountService.findById(
    mongoose.Types.ObjectId(trans.tradingAccountId),
  );
  params.customerId = tradingAccount.customerId;
  const customerDetails = await customerService.findById(params.customerId);
  const to = params.userId
    ? [params.userId.toString(), params.customerId.toString()]
    : [params.customerId.toString()];
  if (params.status === 'PENDING') {
    return transactionService.updateById(trans._id, {
      paid: params.paid,
      amount: params.amount,
    });
  }
  if (params.status === 'REJECTED') {
    await transactionService.updateById(trans._id, {
      status: REJECTED,
      reason: params.reason,
    });
    const uTrans = await transactionService.findById(trans._id, {}, true);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: params.amount,
          gateway: params.gateway,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          recordId: customerDetails.recordId,
          _id: customerDetails._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    return uTrans;
  }
  try {
    const depObj = await deposit(
      tradingAccount.login,
      params.amount,
      `${CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT}_${params.gateway}`,
      tradingAccount.platform,
      tradingAccount.type === 'DEMO',
    );
    if (!depObj) throw new Error('Unable to deposit');
    await transactionService.updateById(trans._id, {
      status: APPROVED,
      paid: params.amount,
      amount: params.amount,
      fee: params.fee,
    });
    const uTrans = await transactionService.findById(trans._id, {}, true);
    if (uTrans) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          content: {
            amount: params.amount,
            gateway: params.gateway,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      await customerService.updateById(mongoose.Types.ObjectId(params.customerId),
        { 'stages.madeDeposit': true },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to,
        },
        {
          client: {
            firstName: customerDetails.firstName,
            lastName: customerDetails.lastName,
            email: customerDetails.email,
            recordId: customerDetails.recordId,
            _id: customerDetails._id.toString(),
          },
          transaction: {
            recordId: trans.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
    }
    return uTrans;
  } catch (err) {
    await transactionService.updateById(trans._id, {
      status: REJECTED,
      reason: err.message,
    });
    const uTrans = await transactionService.findById(trans._id, {}, true);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_DEPOSIT_AUTO,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: params.amount,
          gateway: params.gateway,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          recordId: customerDetails.recordId,
          _id: customerDetails._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    return uTrans;
  }
}

module.exports.addPendingDeposit = async (params, accountObj, file) => {
  const { amount, gateway, tradingAccountId } = params;
  const tradingAccount = await accountService.findById(
    mongoose.Types.ObjectId(tradingAccountId),
  );
  const content = {};
  if (gateway === 'CRYPTO') {
    content.coin = params['paymentPayload.coin'];
    content.network = params['paymentPayload.network'];
    content.transactionHash = params['paymentPayload.transactionHash'];
    content.walletAddress = params['paymentPayload.walletAddress'];
  }

  const transObj = await transactionService.create({
    ...params,
    content,
    receipt: file?.filename,
    type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
    status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
  });
  SendEvent(
    CONSTANTS.EVENT_TYPES.EVENT_LOG,
    CONSTANTS.LOG_TYPES.FX_DEPOSIT,
    {
      customerId: params.customerId,
      userId: params.userId,
      triggeredBy: params.userId ? 1 : 0,
      userLog: false,
      level: CONSTANTS.LOG_LEVELS.INFO,
      content: {
        amount,
        gateway,
        platform: tradingAccount.platform,
        login: tradingAccount.login,
      },
    },
  );
  const custData = await customerService.findById(
    mongoose.Types.ObjectId(params.customerId),
    {},
    { lean: true },
  );
  if (custData.agent) {
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__PENDING,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to: [custData.agent],
      },
      {
        client: {
          firstName: custData.firstName,
          lastName: custData.lastName,
          email: custData.email,
          recordId: custData.recordId,
          _id: custData._id.toString(),
        },
        transaction: {
          recordId: transObj.recordId,
          type: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          currency: transObj.currency || 'USD',
          amount: params.amount,
          gateway: params.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          platform: accountObj.platform,
          login: accountObj.login,
        },
      },
    );
  }
  return transObj;
};

module.exports.debitForTransfer = async (params = {}, accountObj) => {
  const {
    amount,
  } = params;
  const withdrawObj = await withdraw(
    accountObj.login,
    amount,
    `${CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW}_${params.gateway}`,
    accountObj.platform,
    accountObj.type === 'DEMO',
  );
  if (withdrawObj) return withdrawObj;
  logger.error(['debitForTransfer', params, accountObj]);
  throw new Error('Error adding Withdraw');
};

module.exports.creditForTransfer = async (params = {}, accountObj) => {
  const {
    amount,
  } = params;
  const depositObj = await deposit(
    accountObj.login,
    amount,
    'WALLET_INTERNAL_TRANSFER',
    accountObj.platform,
    accountObj.type === 'DEMO',
  );
  if (depositObj) return depositObj;
  logger.error(['creditForTransfer', params, accountObj]);
  throw new Error('Error adding Deposit');
};

module.exports.addRejectedDeposit = async (params) => {
  const transObj = await transactionService.create({
    ...params,
    isApproving: true,
    type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
    status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
  });
  return transObj;
};

module.exports.addApprovedWithdrawal = async (params, accountObj) => {
  const withObj = await withdraw(
    accountObj.login,
    params.amount,
    `${CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW}_${params.gateway}`,
    accountObj.platform,
    accountObj.type === 'DEMO',
  );
  if (withObj) {
    const transObj = await transactionService.create({
      ...params,
      isApproving: true,
      type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
      status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
    });
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_WITHDRAW_AUTO,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: params.amount,
          gateway: params.gateway,
          platform: accountObj.platform,
          login: accountObj.login,
        },
      },
    );
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(params.customerId),
      {},
      { lean: true },
    );
    if (custData.agent) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to: [custData.agent],
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: transObj.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
            currency: transObj.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: accountObj.platform,
            login: accountObj.login,
          },
        },
      );
    }
    return transObj;
  }
  throw new Error('Error adding Withdrawal');
};

const getContent = (params) => {
  if (params.gateway === 'CRYPTO') {
    const payload = JSON.parse(params.payload);
    return {
      coin: payload.coin,
      address: payload.address,
      network: payload.network?.network,
    };
  }
  if (params.gateway === 'WIRE_TRANSFER') {
    return {
      accountHolderName: params?.payload?.bankAccount?.accountHolderName,
      accountNumber: params?.payload?.bankAccount?.accountNumber,
      address: params?.payload?.bankAccount?.address,
      bankName: params?.payload?.bankAccount?.bankName,
      currency: params?.payload?.bankAccount?.currency,
      iban: params?.payload?.bankAccount?.iban,
      swiftCode: params?.payload?.bankAccount?.swiftCode,
    };
  }
  if (params.gateway === 'حواله بنكيه') {
    return {
      name: params?.name,
      address: params?.address,
      phone: params?.phone,
    };
  }
  return {};
};

module.exports.addPendingWithdrawal = async (params, accountObj) => {
  const { amount, gateway } = params;
  const tradingAccount = await accountService.findById(
    mongoose.Types.ObjectId(params.tradingAccountId),
  );
  const equities = tradingAccount.platform === 'CTRADER'
    ? await getPlatform('CTRADER').getEquity(tradingAccount.login, tradingAccount.type === 'DEMO')
    : await getPlatform('MT5').getEquity(tradingAccount.login, tradingAccount.type === 'DEMO');
  if(!equities)  throw new Error('Failed. Could not fetch account');
  if (parseFloat(params.amount) > parseFloat(equities.Balance)
      || parseFloat(params.amount) > parseFloat(equities?.balance)) { throw new Error('no enough money to withdraw'); }
      
  console.log("addPendingWithdrawal params => ",JSON.stringify(params));
  console.log(">>>>>>>>>");
  const transObj = await transactionService.create({
    ...params,
    type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
    status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
    content: getContent(params),
  });
  SendEvent(
    CONSTANTS.EVENT_TYPES.EVENT_LOG,
    CONSTANTS.LOG_TYPES.FX_WITHDRAW,
    {
      customerId: params.customerId,
      userId: params.userId,
      triggeredBy: params.userId ? 1 : 0,
      userLog: false,
      level: CONSTANTS.LOG_LEVELS.INFO,
      content: {
        amount,
        gateway,
        platform: tradingAccount.platform,
        login: tradingAccount.login,
      },
    },
  );
  const custData = await customerService.findById(
    mongoose.Types.ObjectId(params.customerId),
    {},
    { lean: true },
  );
  if (custData.agent) {
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__PENDING,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to: [custData.agent],
      },
      {
        client: {
          firstName: custData.firstName,
          lastName: custData.lastName,
          email: custData.email,
          recordId: custData.recordId,
          _id: custData._id.toString(),
        },
        transaction: {
          recordId: transObj.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
          currency: transObj.currency || 'USD',
          amount: params.amount,
          gateway: params.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          platform: accountObj.platform,
          login: accountObj.login,
        },
      },
    );
  }
  return transObj;
};

module.exports.addPendingInternalTransfer = async (
  params,
  accountFrom,
  accountTo,
) => {
  logger.info('Creating a pending Internal Transfer Request');
  const tradingAccount = await accountService.findById(
    mongoose.Types.ObjectId(accountFrom),
  );
  const tradingAccountTo = await accountService.findById(
    mongoose.Types.ObjectId(accountTo),
  );
  if (!tradingAccount) throw new Error('No such account exists');
  const equities = tradingAccount.platform === 'MT5'
    ? await getPlatform('MT5').getEquity(tradingAccount.login, tradingAccount.type === 'DEMO')
    : tradingAccount.platform === 'CTRADER'
      ? await getPlatform('CTRADER').getEquity(tradingAccount.login, tradingAccount.type === 'DEMO')
      : await getPlatform('MT4').getEquity(tradingAccount.login, tradingAccount.type === 'DEMO');
  if (parseFloat(params.amount) > parseFloat(equities.Balance)) throw new Error('Not enough money to Transfer');
  const transObj = await transactionService.create({
    ...params,
    accountFrom,
    accountTo,
    type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
    status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
  });
  SendEvent(
    CONSTANTS.EVENT_TYPES.EVENT_LOG,
    CONSTANTS.LOG_TYPES.FX_INTERNAL_TRANSFER,
    {
      customerId: params.customerId,
      userId: params.userId,
      triggeredBy: params.userId ? 1 : 0,
      userLog: false,
      level: CONSTANTS.LOG_LEVELS.INFO,
      content: {
        from: tradingAccount.login,
        to: tradingAccountTo.login,
        amount: params.amount,
      },
    },
  );
  const custData = await customerService.findById(
    mongoose.Types.ObjectId(params.customerId),
    {},
    { lean: true },
  );
  const to = [];
  to.push(custData._id.toString());
  if (custData.agent) {
    to.push(custData.agent);
  }
  SendEvent(
    EVENT_TYPES.PUSH_NOTIFICATION,
    {
      pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__PENDING,
      pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
      to,
    },
    {
      client: {
        firstName: custData.firstName,
        lastName: custData.lastName,
        email: custData.email,
        recordId: custData.recordId,
        _id: custData._id.toString(),
      },
      transaction: {
        recordId: transObj.recordId,
        type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
        currency: transObj.currency || 'USD',
        amount: params.amount,
        gateway: params.gateway,
        status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
        platform: params.platform,
        login: tradingAccount.login,
        loginTo: tradingAccountTo.login,
      },
    },
  );
  return transObj;
};

module.exports.addApprovedInternalTransfer = async (
  params,
  accountFrom,
  accountTo,
) => {
  try {
    const tradingAccountFrom = await accountService.findById(
      mongoose.Types.ObjectId(accountFrom),
    );

    const tradingAccountTo = await accountService.findById(
      mongoose.Types.ObjectId(accountTo),
    );

    if (!tradingAccountFrom || !tradingAccountTo) throw new Error("can't find trading account");
    const equities = tradingAccountFrom.platform === 'MT5'
      ? await getPlatform('MT5').getEquity(tradingAccountFrom.login, tradingAccountFrom.type === 'DEMO')
      : tradingAccountFrom.platform === 'MT4'
        ? await getPlatform('MT4').getEquity(tradingAccountFrom.login, tradingAccountFrom.type === 'DEMO')
        : await getPlatform('CTRADER').getEquity(tradingAccountFrom.login, tradingAccountFrom.type === 'DEMO');
    if (parseFloat(tradingAccountFrom.amount ?? params.amount) > parseFloat(equities.Balance ?? equities?.balance)) throw new Error('Not enough money to Transfer');
    const withObj = await withdraw(
      tradingAccountFrom.login,
      params.amount,
      `transfer_to_${tradingAccountTo.login}`,
      tradingAccountFrom.platform,
      tradingAccountFrom.type === 'DEMO',
    );
    if (!withObj) throw new Error('Unable to withdraw');
    const depObj = await deposit(
      tradingAccountTo.login,
      params.amount,
      `transfer_from_${tradingAccountFrom.login}`,
      tradingAccountFrom.platform,
      tradingAccountFrom.type === 'DEMO',
    );
    if (!depObj) throw new Error('Unable to deposit');
    const transObj = await transactionService.create({
      ...params,
      isApproving: true,
      type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
      status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
    });
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_INTERNAL_TRANSFER_AUTO,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: params.userId ? 1 : 0,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          from: tradingAccountFrom.login,
          to: tradingAccountTo.login,
          amount: params.amount,
        },
      },
    );
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(params.customerId),
      {},
      { lean: true },
    );
    if (custData.agent) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to: [custData.agent],
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: transObj.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
            currency: transObj.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: params.platform,
            login: tradingAccountFrom.login,
            loginTo: tradingAccountTo.login,
          },
        },
      );
    }
    return transObj;
  } catch (error) {
    logger.error('Unable to create internal Transfer');
    throw new Error(error);
  }
};

module.exports.addIbApprovedInternalTransfer = async (
  params,
  accountFrom,
  accountTo,
) => {
  const appFrom = await accountService.findOne({ login: accountFrom });
  const appTo = await accountService.findOne({ login: accountTo });
  if (!appFrom) throw new Error("can't find from account");
  if (!appTo) throw new Error("can't find to account");
  const withObj = await withdraw(
    appFrom.login,
    params.amount,
    `transfer_to_${appTo.login}`,
    appFrom.platform,
    appFrom.type === 'DEMO',
  );
  if (withObj) {
    const depObj = await deposit(
      appTo.login,
      params.amount,
      `transfer_from_${appFrom.login}`,
      appTo.platform,
      appTo.type === 'DEMO',
    );
    if (depObj) {
      const transObj = await transactionService.create({
        customerId: params.customerId,
        tradingAccountFrom: appFrom._id,
        tradingAccountTo: appTo._id,
        amount: params.amount,
        note: params.note,
        isApproving: true,
        type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
        status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
      });
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.FX_INTERNAL_TRANSFER_AUTO,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          content: {
            from: appFrom.login,
            to: appTo.login,
            amount: params.amount,
          },
        },
      );
      return transObj;
    }
  }
  throw new Error('Error in internal transfer');
};

module.exports.addApprovedCreditInOut = async (params, accountObj) => {
  if (accountObj.platform === 'MT4' || accountObj.platform === 'MT5') { params.amount *= params.type === 'CREDIT_IN' ? 1 : -1; }
  const depObj = await creditInOut(
    accountObj.login,
    params.amount,
    params.type,
    accountObj.platform,
    accountObj.type === 'DEMO',
    params.note,
  );
  if (depObj) {
    if (accountObj.platform === 'CTRADER') { params.amount *= params.type === 'CREDIT_IN' ? 1 : -1; }
    const transObj = await transactionService.create({
      ...params,
      isApproving: true,
      type: CONSTANTS.TRANSACTIONS_TYPES.CREDIT,
      status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
    });
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_CREDIT_UPDATE,
      {
        customerId: params.customerId,
        userId: params.userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: params.amount,
          type: params.type,
          login: accountObj.login,
          status: CONSTANTS.REQUESTS_STATUS.APPROVED,
        },
      },
    );
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(params.customerId),
      {},
      { lean: true },
    );
    if (custData.agent) {
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.CREDIT__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to: [custData.agent],
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: transObj.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.CREDIT,
            currency: transObj.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: accountObj.platform,
            login: accountObj.login,
          },
        },
      );
    }
    return transObj;
  }
  throw new Error('Error adding Deposit');
};

module.exports.getTransactions = async (
  data,
  deposits,
  withdraws,
  internalTransfers,
) => {
  const { dateFrom = '01-01-2021', dateTo, ...params } = data;
  params.createdAt = {
    $gt: new Date(dateFrom),
    $lt: dateTo ? new Date(dateTo) : new Date(),
  };
  const type = [];
  if (deposits === true) type.push(CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT);
  if (withdraws === true) type.push(CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW);
  if (internalTransfers === true) { type.push(CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER); }

  let accountsIds;
  let accountsArr;
  // first check for live/demo accs, second for ib dashboard getClientTransactions in ib controller
  if (params.tradingAccountId || params.customerId?.$in) {
    accountsArr = [
      { tradingAccountFrom: params.tradingAccountId },
      { tradingAccountId: params.tradingAccountId },
    ];
  } else { // for reports
    const accounts = await accountService.find({ customerId: params.customerId });
    accountsIds = accounts
      .filter((account) => account.type === params.accountType)
      .map((account) => account._id);
    accountsArr = [
      { tradingAccountFrom: { $in: accountsIds } },
      { tradingAccountId: { $in: accountsIds } },
    ];
  }
  return transactionService.findWithPagination(
    {
      customerId: params.customerId,
      $or: accountsArr,
      type: {
        $in: type,
      },
      status: params.status ?? {
        $in: [
          CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
        ],
      },
      page: params.page,
      limit: params.limit,
    },
    { populate },
  );
};

const depositFilter = async (params) => {
  const { filteredValues = {} } = params;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((ag) => mongoose.Types.ObjectId(ag)) },
            };
            break;
          case 'tradingAccount':
            const ta = await accountService.find({ login: value });
            console.log('ta', JSON.stringify(ta));
            if (ta && ta.length) {
              params = { ...params, tradingAccountId: ta[0]._id };
            } else {
              params = { ...params, _id: { $eq: null } };// return empty
            }
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) },
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          default:
            params = { ...params, [key]: value };
        }
      }
    }
  }
  delete params.filteredValues;
  return params;
};

const withdrawalFilter = async (params) => {
  const { filteredValues = {} } = params;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((ag) => mongoose.Types.ObjectId(ag)) },
            };
            break;
          case 'tradingAccount':
            const ta = await accountService.find({ login: value });
            console.log('ta', JSON.stringify(ta));
            if (ta && ta.length) {
              params = { ...params, tradingAccountId: ta[0]._id };
            } else {
              params = { ...params, _id: { $eq: null } };// return empty
            }
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) },
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          default:
            params = { ...params, [key]: value };
        }
      }
    }
  }
  delete params.filteredValues;
  return params;
};

const internalTransferFilter = async (params) => {
  const { filteredValues = {} } = params;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((ag) => mongoose.Types.ObjectId(ag)) },
            };
            break;
          case 'tradingAccountFrom':
            const taf = await accountService.find({ login: value });
            if (taf && taf.length) {
              params = { ...params, tradingAccountId: taf[0]._id };
            } else {
              params = { ...params, _id: { $eq: null } };// return empty
            }
            break;
          case 'tradingAccountTo':
            const tat = await accountService.find({ login: value });
            if (tat && tat.length) {
              params = { ...params, tradingAccountId: tat[0]._id };
            } else {
              params = { ...params, _id: { $eq: null } };// return empty
            }
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) },
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          default:
            params = { ...params, [key]: value };
        }
      }
    }
  }
  delete params.filteredValues;
  return params;
};

const creditsFilter = async (params) => {
  const { filteredValues = {} } = params;
  if (filteredValues) {
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(filteredValues)) {
      if (value && value !== '') {
        switch (key) {
          case 'creditType':
            let amount = filteredValues.amount || 0;
            if (amount) {
              if (value === 'CreditIn') {
                params = { ...params, amount };
              } else {
                amount *= -1;
                params = { ...params, amount };
              }
            } else if (value === 'CreditIn') {
              params = { ...params, amount: { $gt: 0 } };
            } else {
              params = { ...params, amount: { $lt: 0 } };
            }
            break;
          case 'agent':
            params = {
              ...params,
              agent: { $in: value.split(',').map((ag) => mongoose.Types.ObjectId(ag)) },
            };
            break;
          case 'filterDate':
            if (value.fromDate && value.toDate) {
              params = {
                ...params,
                createdAt: { $gte: new Date(value.fromDate), $lte: new Date(value.toDate) },
              };
            } else {
              if (value.fromDate) {
                params = { ...params, createdAt: { $gte: new Date(value.fromDate) } };
              }
              if (value.toDate) {
                params = { ...params, createdAt: { $lte: new Date(value.toDate) } };
              }
            }
            break;
          default:
            if (key !== 'amount') {
              params = { ...params, [key]: value };
            }
        }
      }
    }
  }
  delete params.filteredValues;
  return params;
};

module.exports.getDeposits = async (params) => {
  params = await depositFilter(params);
  const {
    searchText, page, limit, sort, ...rest
  } = params;
  const aggregation = getAggregation(
    CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
    '',
    rest,
    new RegExp(searchText, 'i'),
  );
  return transactionService.aggregateWithPagination(
    aggregation,
    {
      page,
      limit,
      sort,
    },
  );
};

module.exports.getWithdrawals = async (params) => {
  params = await withdrawalFilter(params);
  const {
    searchText, page, limit, sort, ...rest
  } = params;
  const aggregation = getAggregation(
    CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
    '',
    rest,
    new RegExp(searchText, 'i'),
  );
  return transactionService.aggregateWithPagination(
    aggregation,
    {
      page,
      limit,
      sort,
    },
  );
};

module.exports.getInternalTransfers = async (params) => {
  params = await internalTransferFilter(params);
  const {
    searchText, page, limit, sort, ...rest
  } = params;
  const aggregation = getAggregation(
    CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
    '',
    rest,
    new RegExp(searchText, 'i'),
  );
  return transactionService.aggregateWithPagination(
    aggregation,
    {
      page,
      limit,
      sort,
    },
  );
};

module.exports.getCredits = async (params, accountObj) => {
  params = await creditsFilter(params);
  const {
    searchText, page, limit, sort, ...rest
  } = params;
  const aggregation = getAggregation(
    CONSTANTS.TRANSACTIONS_TYPES.CREDIT,
    '',
    rest,
    new RegExp(searchText, 'i'),
  );
  return transactionService.aggregateWithPagination(
    aggregation,
    {
      page,
      limit,
      sort,
    },
  );
};

module.exports.approveDeposit = async (params) => {
  const { id, customerId, userId } = params;
  try {
    logger.info(`Deposit Transaction ${id}, Approving`);
    const trans = await transactionService.findById(
      mongoose.Types.ObjectId(id),
    );
    if (!trans) throw new Error("can't find transaction");
    if (trans.status === APPROVED) { throw new Error(`This transaction is already APPROVED, ${id}`); }
    if (trans.status === REJECTED) { throw new Error(`This transaction is already REJECTED, ${id}`); }
    const tradingAccount = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountId),
    );
    if (!tradingAccount) throw new Error("can't find trading account");
    const depositCheck = await deposit(
      tradingAccount.login,
      trans.paid,
      `${CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT}_${trans.gateway}`,
      tradingAccount.platform,
      tradingAccount.type === 'DEMO',
    );
    if (depositCheck) {
      await transactionService.updateById(mongoose.Types.ObjectId(id), {
        status: APPROVED,
      });
      await customerService.updateById(mongoose.Types.ObjectId(customerId), { 'stages.madeDeposit': true });
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.FX_DEPOSIT_UPDATE,
        {
          customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          content: {
            amount: trans.amount,
            gateway: trans.gateway,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
            status: CONSTANTS.REQUESTS_STATUS.APPROVED,
          },
        },
      );
      const custData = await customerService.findById(
        mongoose.Types.ObjectId(customerId),
        {},
        { lean: true },
      );
      const to = [customerId];
      if (custData.agent) {
        to.push(custData.agent);
      }
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to,
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: trans.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      if (custData.parent) {
        SendEvent(
          EVENT_TYPES.PUSH_NOTIFICATION,
          {
            pushNotificationType: PUSH_NOTIFICATION_GROUPS.CLIENT.LINKED_DEPOSITS,
            pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'CLIENT'),
            to: [custData.parent],
          },
          {
            client: {
              firstName: custData.firstName,
              lastName: custData.lastName,
              email: custData.email,
              recordId: custData.recordId,
              _id: custData._id.toString(),
            },
            transaction: {
              recordId: trans.recordId,
              type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
              currency: trans.currency || 'USD',
              amount: trans.amount,
              gateway: trans.gateway,
              status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
              platform: tradingAccount.platform,
              login: tradingAccount.login,
            },
          },
        );
      }
      return true;
    }
    throw new Error(`can't deposit due to ${depositCheck}`);
  } catch (error) {
    logger.info(`Deposit Transaction ${id}, Rejected due to ${error.message}`);
    throw new Error(error);
  }
};

module.exports.rejectDeposit = async (params) => {
  const { id, customerId, userId } = params;
  try {
    logger.info(`Withdraw Transaction ${id}, Rejecting`);
    const trans = await transactionService.findById(
      mongoose.Types.ObjectId(id),
    );
    if (!trans) throw new Error("can't find transaction");
    if (trans.status === APPROVED) { throw new Error(`This transaction is already APPROVED, ${id}`); }
    if (trans.status === REJECTED) { throw new Error(`This transaction is already REJECTED, ${id}`); }
    const tradingAccount = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountId),
    );
    if (!tradingAccount) throw new Error("can't find trading account");
    await transactionService.updateById(mongoose.Types.ObjectId(id), {
      status: REJECTED,
    });
    logger.info(`Deposit Transaction ${id}, Rejected`);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_DEPOSIT_UPDATE,
      {
        customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: trans.amount,
          gateway: trans.gateway,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
          status: CONSTANTS.REQUESTS_STATUS.REJECTED,
        },
      },
    );
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(customerId),
      {},
      { lean: true },
    );
    const to = [customerId];
    if (custData.agent) {
      to.push(custData.agent);
    }
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.DEPOSIT__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: custData.firstName,
          lastName: custData.lastName,
          email: custData.email,
          recordId: custData.recordId,
          _id: custData._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
  } catch (error) {
    logger.info(
      `Deposit Transaction ${id}, had an error due to ${error.message}`,
    );
    throw new Error(error);
  }
};

module.exports.approveWithdrawal = async (params) => {
  const { id, customerId, userId } = params;
  try {
    logger.info(`Withdraw Transaction ${id}, Approving`);
    const trans = await transactionService.findById(
      mongoose.Types.ObjectId(id),
    );
    if (!trans) throw new Error("can't find transaction");
    if (trans.status === APPROVED) { throw new Error(`This transaction is already APPROVED, ${id}`); }
    if (trans.status === REJECTED) { throw new Error(`This transaction is already REJECTED, ${id}`); }
    const tradingAccount = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountId),
    );
    if (!tradingAccount) throw new Error("can't find trading account");
    const withdrawCheck = await withdraw(
      tradingAccount.login,
      trans.paid,
      `${CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW}_${trans.gateway}`,
      tradingAccount.platform,
      tradingAccount.type === 'DEMO',
    );
    if (withdrawCheck) {
      await transactionService.updateById(mongoose.Types.ObjectId(id), {
        status: APPROVED,
      });
      logger.info(`Withdraw Transaction ${id}, Approved`);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.FX_WITHDRAW_UPDATE,
        {
          customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          content: {
            amount: trans.amount,
            gateway: trans.gateway,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
            status: CONSTANTS.REQUESTS_STATUS.APPROVED,
          },
        },
      );
      const custData = await customerService.findById(
        mongoose.Types.ObjectId(customerId),
        {},
        { lean: true },
      );
      const to = [customerId];
      if (custData.agent) {
        to.push(custData.agent);
      }
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__APPROVED,
          pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
          to,
        },
        {
          client: {
            firstName: custData.firstName,
            lastName: custData.lastName,
            email: custData.email,
            recordId: custData.recordId,
            _id: custData._id.toString(),
          },
          transaction: {
            recordId: trans.recordId,
            type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            platform: tradingAccount.platform,
            login: tradingAccount.login,
          },
        },
      );
      return true;
    }
    throw new Error(`can't withdraw due to ${withdrawCheck}`);
  } catch (error) {
    logger.info(`Withdraw Transaction ${id}, Rejected due to ${error.message}`);
    throw new Error(error);
  }
};

module.exports.rejectWithdrawal = async (params) => {
  const { id, customerId, userId } = params;
  try {
    logger.info(`Withdraw Transaction ${id}, Rejecting`);
    const trans = await transactionService.findById(
      mongoose.Types.ObjectId(id),
    );
    if (!trans) throw new Error("can't find transaction");
    if (trans.status === APPROVED) { throw new Error(`This transaction is already APPROVED, ${id}`); }
    if (trans.status === REJECTED) { throw new Error(`This transaction is already REJECTED, ${id}`); }
    const tradingAccount = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountId),
    );
    if (!tradingAccount) throw new Error("can't find trading account");

    await transactionService.updateById(mongoose.Types.ObjectId(id), {
      status: REJECTED,
    });
    logger.info(`Withdraw Transaction ${id}, Approved`);
    SendEvent(CONSTANTS.EVENT_TYPES.EVENT_LOG, CONSTANTS.LOG_TYPES.WITHDRAW, {
      customerId,
      userId,
      triggeredBy: 1,
      userLog: false,
      level: CONSTANTS.LOG_LEVELS.INFO,
      details: {},
    });
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(customerId),
      {},
      { lean: true },
    );
    const to = [customerId];
    if (custData.agent) {
      to.push(custData.agent);
    }
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WITHDRAWAL__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: custData.firstName,
          lastName: custData.lastName,
          email: custData.email,
          recordId: custData.recordId,
          _id: custData._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          platform: tradingAccount.platform,
          login: tradingAccount.login,
        },
      },
    );
    return true;
  } catch (error) {
    logger.info(
      `Withdraw Transaction ${id}, Rejected had an error: ${error.message}`,
    );
    throw new Error(error);
  }
};

module.exports.approveInternalTransfer = async (params) => {
  const { id, userId } = params;
  try {
    logger.info(`Internal Transfer ${id}, Approving`);
    const trans = await transactionService.findById(
      mongoose.Types.ObjectId(id),
    );

    if (!trans) throw new Error("Can't find any request");
    if (trans.status === APPROVED) throw new Error(`This transaction is already APPROVED, ${id}`);
    if (trans.status === REJECTED) throw new Error(`This transaction is already REJECTED, ${id}`);

    const tradingAccountFrom = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountFrom),
    );
    const tradingAccountTo = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountTo),
    );

    if (!tradingAccountFrom || !tradingAccountTo) throw new Error("can't find trading account");
    const equities = tradingAccountFrom.platform === 'MT5'
      ? await getPlatform('MT5').getEquity(tradingAccountFrom.login, tradingAccountFrom.type === 'DEMO')
      : tradingAccountFrom.platform === 'CTRADER'
        ? await getPlatform('CTRADER').getEquity(tradingAccountFrom.login, tradingAccountFrom.type === 'DEMO')
        : await getPlatform('MT4').getEquity(tradingAccountFrom.login, tradingAccountFrom.type === 'DEMO');
    if (parseFloat(trans.amount) > parseFloat(equities.Balance)) throw new Error('Not enough money to Transfer');
    const withObj = await withdraw(
      tradingAccountFrom.login,
      trans.amount,
      `transfer_to_${tradingAccountTo.login}`,
      tradingAccountFrom.platform,
      tradingAccountFrom.type === 'DEMO',
    );
    if (!withObj) throw new Error('Unable to withdraw');
    const depObj = await deposit(
      tradingAccountTo.login,
      trans.amount,
      `transfer_from_${tradingAccountFrom.login}`,
      tradingAccountTo.platform,
      tradingAccountTo.type === 'DEMO',
    );
    if (!depObj) throw new Error('Unable to deposit');
    const transObj = await transactionService.updateById(mongoose.Types.ObjectId(id), {
      status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
    });
    logger.info(`Internal Transfer for ${id}, Approved`);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_INTERNAL_TRANSFER_UPDATE,
      {
        customerId: trans.customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: trans.amount,
          from: tradingAccountFrom.login,
          to: tradingAccountTo.login,
          status: CONSTANTS.REQUESTS_STATUS.APPROVED,
        },
      },
    );
    const custData = await customerService.findById(
      mongoose.Types.ObjectId(trans.customerId),
      {},
      { lean: true },
    );
    const to = [trans.customerId];
    if (custData.agent) {
      to.push(custData.agent);
    }
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__APPROVED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: custData.firstName,
          lastName: custData.lastName,
          email: custData.email,
          recordId: custData.recordId,
          _id: custData._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER__APPROVED,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          platform: tradingAccountFrom.platform,
          login: tradingAccountFrom.login,
          loginTo: tradingAccountTo.login,
        },
      },
    );
    return transObj;
  } catch (error) {
    logger.info(`Unable to approve Internal Transfer ${id}`);
    throw new Error(error);
  }
};

module.exports.rejectInternalTransfer = async (params) => {
  const { id, userId } = params;
  try {
    logger.info(`Internal Transfer ${id}, Rejecting`);
    const trans = await transactionService.findById(
      mongoose.Types.ObjectId(id),
    );
    if (!trans) throw new Error("Can't find any request");
    const tradingAccountFrom = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountFrom),
    );
    const tradingAccountTo = await accountService.findById(
      mongoose.Types.ObjectId(trans.tradingAccountTo),
    );
    if (trans.status === APPROVED) throw new Error(`This transaction is already APPROVED, ${id}`);
    if (trans.status === REJECTED) throw new Error(`This transaction is already REJECTED, ${id}`);
    const transObj = await transactionService.updateById(mongoose.Types.ObjectId(id), {
      status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
    });
    logger.info(`Internal Transfer for ${id}, Rejected`);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.FX_INTERNAL_TRANSFER_UPDATE,
      {
        customerId: trans.customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        content: {
          amount: trans.amount,
          from: tradingAccountFrom.login,
          to: tradingAccountTo.login,
          status: CONSTANTS.REQUESTS_STATUS.REJECTED,
        },
      },
    );

    const custData = await customerService.findById(
      mongoose.Types.ObjectId(trans.customerId),
      {},
      { lean: true },
    );
    const to = [trans.customerId];
    if (custData.agent) {
      to.push(custData.agent);
    }
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.INTERNAL_TRANSFER__APPROVED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: custData.firstName,
          lastName: custData.lastName,
          email: custData.email,
          recordId: custData.recordId,
          _id: custData._id.toString(),
        },
        transaction: {
          recordId: trans.recordId,
          type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER__APPROVED,
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          platform: tradingAccountFrom.platform,
          login: tradingAccountFrom.login,
          loginTo: tradingAccountTo.login,
        },
      },
    );
    return transObj;
  } catch (error) {
    logger.info(`Unable to reject Internal Transfer ${id}`);
    throw error;
  }
};

module.exports.getDepositWithdrawSumByTradingAccount = async (accounts) => {
  const agg = [
    {
      $match: {
        tradingAccountId: {
          $in: accounts.map((obj) => obj._id),
        },
        type: {
          $in: [
            CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
          ],
        },
        status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
      },
    },
    {
      $group: {
        _id: 'null',
        deposit: {
          $sum: {
            $cond: [
              {
                $eq: ['$type', CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT],
              },
              '$amount',
              0,
            ],
          },
        },
        withdraw: {
          $sum: {
            $cond: [
              {
                $eq: ['$type', CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW],
              },
              '$amount',
              0,
            ],
          },
        },
      },
    },
  ];
  const res = await transactionService.aggregate(agg);
  return res[0] || { deposit: 0, withdraw: 0 };
};

module.exports.getDepositWithdrawSum = async (customerIds) => {
  const agg = [
    {
      $match: {
        customerId: {
          $in: customerIds.map((obj) => obj._id),
        },
        type: {
          $in: [
            CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
            CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
          ],
        },
        status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
        createdAt: {
          $gte: moment().startOf('month').toDate(),
          $lte: moment().endOf('month').toDate(),
        },
      },
    },
    {
      $group: {
        _id: null,
        deposit: {
          $sum: {
            $cond: [
              {
                $eq: ['$type', CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT],
              },
              '$amount',
              0,
            ],
          },
        },
        withdraw: {
          $sum: {
            $cond: [
              {
                $eq: ['$type', CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW],
              },
              '$amount',
              0,
            ],
          },
        },
      },
    },
  ];
  const res = await transactionService.aggregate(agg);
  return res[0] || { deposit: 0, withdraw: 0 };
};

module.exports.aggregate = async (pipeline = []) => transactionService.aggregate(pipeline);

async function fxtransactionWatcher() {
  const collection = mongoose.connection.db.collection('transactionsfxes');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, documentKey, operationType, updateDescription,
    } = next;
    if (operationType === 'insert') {
      let tradingAccount;
      let tradingAccountTo;
      let action = '';
      const customer = await customerService.findById(fullDocument.customerId);
      tradingAccount = await accountService.findById(
        mongoose.Types.ObjectId(fullDocument.tradingAccountId),
      );
      let emailObject = {
        ...customer,
        ...fullDocument,
      };
      switch (fullDocument.type) {
        case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
          action = fullDocument.isApproving
            ? CONSTANTS.EMAIL_ACTIONS.FX_DEPOSIT_APPROVAL
            : CONSTANTS.EMAIL_ACTIONS.FX_DEPOSIT_REQUEST;
          break;
        case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
          action = fullDocument.isApproving
            ? CONSTANTS.EMAIL_ACTIONS.FX_WITHDRAW_APPROVAL
            : CONSTANTS.EMAIL_ACTIONS.FX_WITHDRAW_REQUEST;
          break;
        case CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER:
          tradingAccount = await accountService.findById(
            mongoose.Types.ObjectId(fullDocument.tradingAccountFrom),
          );
          tradingAccountTo = await accountService.findById(
            mongoose.Types.ObjectId(fullDocument.tradingAccountTo),
          );
          emailObject = { ...emailObject, loginTo: tradingAccountTo.login };
          action = fullDocument.isApproving
            ? CONSTANTS.EMAIL_ACTIONS.FX_INTERNAL_TRANSFER_APPROVAL
            : CONSTANTS.EMAIL_ACTIONS.FX_INTERNAL_TRANSFER_REQUEST;
          break;
        case CONSTANTS.TRANSACTIONS_TYPES.CREDIT:
          if (fullDocument.amount > 0) {
            action = CONSTANTS.EMAIL_ACTIONS.FX_CREDIT_IN_APPROVAL;
          } else {
            action = CONSTANTS.EMAIL_ACTIONS.FX_CREDIT_OUT_APPROVAL;
            emailObject.amount = Math.abs(emailObject.amount);
          }
          break;
        default:
          break;
      }
      systemEmailService.sendSystemEmail(
        action,
        {
          to: customer.email,
          lang: customer?.language,
        },
        {
          ...emailObject,
          ...tradingAccount,
        },
      );
    } else if (operationType === 'update') {
      let tradingAccount;
      let tradingAccountTo;
      let action = '';
      const customer = await customerService.findById(fullDocument.customerId);
      tradingAccount = await accountService.findById(
        mongoose.Types.ObjectId(fullDocument.tradingAccountId),
      );
      if (updateDescription.updatedFields.status !== null) {
        let emailObject = {
          ...customer,
          ...fullDocument,
        };
        const isApproved = updateDescription.updatedFields.status === 'APPROVED';
        switch (fullDocument.type) {
          case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.FX_DEPOSIT_APPROVAL
              : CONSTANTS.EMAIL_ACTIONS.FX_DEPOSIT_REJECTION;
            break;
          case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.FX_WITHDRAW_APPROVAL
              : CONSTANTS.EMAIL_ACTIONS.FX_WITHDRAW_REJECTION;
            break;
          case CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER:
            tradingAccount = await accountService.findById(
              mongoose.Types.ObjectId(fullDocument.tradingAccountFrom),
            );
            tradingAccountTo = await accountService.findById(
              mongoose.Types.ObjectId(fullDocument.tradingAccountTo),
            );
            emailObject = { ...emailObject, loginTo: tradingAccountTo.login };
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.FX_INTERNAL_TRANSFER_APPROVAL
              : CONSTANTS.EMAIL_ACTIONS.FX_INTERNAL_TRANSFER_REJECTION;
            break;
          default:
            break;
        }
        systemEmailService.sendSystemEmail(
          action,
          {
            to: customer.email,
            lang: customer?.language,
          },
          {
            ...emailObject,
            ...tradingAccount,
          },
        );
      }
    }
  });
}
// eslint-disable-next-line arrow-body-style
module.exports.findWithAggregation = async (pipeline = [], options = {}) => {
  return transactionService.aggregateWithPagination(pipeline, options);
};

// eslint-disable-next-line arrow-body-style
module.exports.findOne = async (query, options = {}) => {
  return transactionService.findOne(query, options);
};

dbConnectionUpCb(fxtransactionWatcher);

module.exports.getDepositGateways = () => CONSTANTS.TRANSACTIONS_GATEWAYS;
module.exports.getWithdrawalGateways = () => CONSTANTS.TRANSACTIONS_GATEWAYS;
