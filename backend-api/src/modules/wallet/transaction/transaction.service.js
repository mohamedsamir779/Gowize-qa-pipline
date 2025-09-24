//
const mongoose = require('mongoose');
const { default: BigNumber } = require('bignumber.js');
const {
  Cruds,
  SendEvent,
  dbConnectionUpCb,
} = require('src/common/handlers');
const { EVENT_TYPES, PUSH_NOTIFICATION_GROUPS } = require('src/common/data/constants');
const { CONSTANTS } = require('src/common/data');
const { logger } = require('src/common/lib');
const { getExchange } = require('src/modules/crypto/exchange/api');
const TransactionModel = require('./transaction.model');
const keys = require('src/common/data/keys');

let customerService;
let systemEmailService;
let walletService;
let feeGroupService;
let settingsService;
let cryptoAPIService;
const {
  APPROVED,
  REJECTED,
  PENDING,
  IN_PROGRESS,
} = CONSTANTS.TRANSACTIONS_STATUS;
const {
  DEPOSIT,
  WITHDRAW,
} = CONSTANTS.TRANSACTIONS_TYPES;
const {
  BLOCKCHAIN,
} = CONSTANTS.TRANSACTIONS_GATEWAYS;

class Service extends Cruds {
  _constructor() {
    this.defaultPopulate = [{
      path: 'walletId',
      select: 'asset amount assetId status freezeAmount',
      populate: [{
        path: 'assetId',
        select: 'image symbol',
      }],
    }, {
      path: 'customerId',
      select: 'firstName lastName category',
    }];
  }

  getPaginate(filter, options = {}) {
    return this.findWithPagination(filter, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  getContent(params) {
    if (params.content) return params.content;
    if (params.gateway === 'CRYPTO') {
      params.payload = JSON.parse(params.payload);
      return {
        coin: params?.payload?.coin,
        address: params?.payload?.address,
        network: params?.payload?.network?.network,
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
    return {};
  }

  async createPendingTransaction(type, params = {}) {
    if (!type) {
      throw new Error('Type of transaction is required');
    }
    if (!params.customerId) {
      throw new Error('No customer Id Provided');
    }
    const feeGroup = await feeGroupService.getTransactionFeeGroupForCustomer(params.customerId);
    const mFeeGroup = feeGroupService.getTransactionFeeForAssetFromData(feeGroup, params.currency);
    const mFee = {
      cost: feeGroupService.calculateTransactionFeeAmount(mFeeGroup, params.amount).toString(),
      currency: params.currency,
    };
    return this.create({
      ...params,
      type,
      status: PENDING,
      mFeeGroup,
      mFee,
      isApproving: params.isAutoApprove || false,
      content: this.getContent(params),
    });
  }

  async basicDeposit(params = {}, file) {
    const wallet = await walletService.findById(params.walletId);
    const content = {};
    if (params.gateway === 'CRYPTO') {
      content.coin = params['paymentPayload.coin'];
      content.network = params['paymentPayload.network'];
      content.transactionHash = params['paymentPayload.transactionHash'];
      content.walletAddress = params['paymentPayload.walletAddress'];
    }
    const trans = await this.createPendingTransaction(
      DEPOSIT,
      {
        ...params,
        content,
        currency: wallet.asset,
        receipt: file?.filename,
      },
    );
    if (!trans.isApproving) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: trans,
        },
      );
    }
    if (!params.isAutoApprove) {
      const customerDetails = await customerService.findById(params.customerId);
      const to = params.userId
        ? [params.userId.toString(), params.customerId.toString()]
        : [params.customerId.toString()];
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__PENDING,
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
            type: trans.status || '',
            currency: trans.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          },
        },
      );
      return trans;
    }
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        params.walletId,
        params.customerId,
        DEPOSIT,
        params.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      return uTrans;
    }
  }

  async createGatewayDeposit(params = {}, content = {}) {
    const wallet = await walletService.findById(params.walletId);
    params.customerId = wallet.belongsTo;
    const trans = await this.createPendingTransaction(
      DEPOSIT,
      {
        ...params,
        type: 'DEPOSIT',
        content,
        currency: wallet.asset,
      },
    );
    const customerDetails = await customerService.findById(params.customerId);
    const to = params.userId
      ? [params.userId.toString(), params.customerId.toString()]
      : [params.customerId.toString()];
    switch (params.status) {
      case 'PENDING':
        SendEvent(
          EVENT_TYPES.PUSH_NOTIFICATION,
          {
            pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__PENDING,
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
              type: trans.status || '',
              currency: trans.currency || 'USD',
              amount: params.amount,
              gateway: params.gateway,
              status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
            },
          },
        );
        return trans;
      case 'REJECTED':
        await this.updateById(trans._id, {
          status: REJECTED,
          reason: params.reason ?? 'Rejected',
        });
        SendEvent(
          CONSTANTS.EVENT_TYPES.EVENT_LOG,
          CONSTANTS.LOG_TYPES.DEPOSIT,
          {
            customerId: trans.customerId,
            userId: null,
            triggeredBy: 1,
            userLog: false,
            level: CONSTANTS.LOG_LEVELS.INFO,
            details: {},
            content: trans,
          },
        );
        SendEvent(
          EVENT_TYPES.PUSH_NOTIFICATION,
          {
            pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED,
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
              type: 'REJECTED',
              currency: trans.currency || 'USD',
              amount: trans.amount,
              gateway: trans.gateway,
              status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
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
      const paid = await walletService.changeBalanceViaWalletId(
        params.walletId,
        params.customerId,
        DEPOSIT,
        params.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      if (uTrans) {
        SendEvent(
          EVENT_TYPES.PUSH_NOTIFICATION,
          {
            pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__APPROVED,
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
              type: 'APPROVED',
              currency: trans.currency || 'USD',
              amount: trans.amount,
              gateway: trans.gateway,
              status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
            },
          },
        );
      }
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED,
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
            type: 'REJECTED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          },
        },
      );
      return uTrans;
    }
  }

  async updateGatewayDeposit(params = {}, content = {}) {
    const trans = await this.findOne({ txId: params.txId });
    if (!trans || trans.status === 'REJECTED') throw new Error('Transaction not found');
    const wallet = await walletService.findById(trans.walletId);
    params.customerId = wallet.belongsTo;
    const customerDetails = await customerService.findById(params.customerId);
    const to = params.userId
      ? [params.userId.toString(), params.customerId.toString()]
      : [params.customerId.toString()];
    if (params.status === 'PENDING') {
      return this.updateById(trans._id, {
        paid: params.paid,
        amount: params.amount,
      });
    }
    if (params.status === 'REJECTED') {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: params.reason ?? 'Rejected',
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: trans.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED,
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
            type: 'REJECTED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          },
        },
      );
      return uTrans;
    }
    try {
      await walletService.changeBalanceViaWalletId(
        trans.walletId,
        trans.customerId,
        DEPOSIT,
        params.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: params.amount,
        amount: params.amount,
        fees: params.fees,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__APPROVED,
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
            type: 'APPROVED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          },
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED,
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
            type: 'REJECTED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          },
        },
      );
      return uTrans;
    }
  }

  async updatePaymentStatus(transId, params, status) {
    const trans = await this.checkTransaction(transId, DEPOSIT, status);
    logger.info(`Deposit Transaction ${transId}, Approving`);
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        trans.walletId._id,
        trans.customerId,
        DEPOSIT,
        trans.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        content: params?.content,
        paid: paid.toString(),
      });
      await customerService.updateById(mongoose.Types.ObjectId(trans.customerId),
        { 'stages.madeDeposit': true },
      );
      logger.info(`Deposit Transaction ${transId}, Approved`);
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      const customerDetails = await customerService.findById(trans.customerId);
      const to = [
        customerDetails._id.toString(),
      ];
      if (customerDetails.agent) {
        to.push(customerDetails.agent.toString());
      }
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: trans.customerId,
          userId: null,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__APPROVED,
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
            type: 'APPROVED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          },
        },
      );
    } catch (err) {
      console.log(err);
    }
  }

  async basicWithdraw(params = {}) {
    // const wallet = await walletService.freezeBalanceForWithdrawal(params);
    // let content;
    // if (params.gateway === 'WIRE_TRANSFER') {
    //   content = {
    //     ...JSON.parse(params.payload).bankAccount,
    //   };
    // }
    // const trans = await this.createPendingTransaction(
    //   WITHDRAW,
    //   {
    //     ...params,
    //     content,
    //     currency: wallet.asset,
    //     frozenAmount: params.amount,
    //   },
    // );
    // if (!trans.isApproving) {
    //   SendEvent(
    //     CONSTANTS.EVENT_TYPES.EVENT_LOG,
    //     CONSTANTS.LOG_TYPES.WITHDRAW,
    //     {
    //       customerId: params.customerId,
    //       userId: params.userId,
    //       triggeredBy: params.userId ? 1 : 0,
    //       userLog: false,
    //       level: CONSTANTS.LOG_LEVELS.INFO,
    //       details: {},
    //       content: trans,
    //     },
    //   );
    // }
    // if (!params.isAutoApprove) {
    //   const customerDetails = await customerService.findById(params.customerId);
    //   const to = params.userId
    //     ? [params.userId.toString(), params.customerId.toString()]
    //     : [params.customerId.toString()];
    //   SendEvent(
    //     EVENT_TYPES.PUSH_NOTIFICATION,
    //     {
    //       pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__PENDING,
    //       pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
    //       to,
    //     },
    //     {
    //       client: {
    //         firstName: customerDetails.firstName,
    //         lastName: customerDetails.lastName,
    //         email: customerDetails.email,
    //         recordId: customerDetails.recordId,
    //         _id: customerDetails._id.toString(),
    //       },
    //       transaction: {
    //         recordId: trans.recordId,
    //         type: trans.status || '',
    //         currency: trans.currency || 'USD',
    //         amount: params.amount,
    //         gateway: params.gateway,
    //         status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
    //       },
    //     },
    //   );
    //   return trans;
    // }
    // try {
    //   const paid = await walletService.changeBalanceViaWalletId(
    //     params.walletId,
    //     params.customerId,
    //     WITHDRAW,
    //     trans.frozenAmount,
    //     trans.mFee,
    //   );
    //   await this.updateById(trans._id, {
    //     status: APPROVED,
    //     paid: paid.toString(),
    //   });
    //   const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
    //   SendEvent(
    //     CONSTANTS.EVENT_TYPES.EVENT_LOG,
    //     CONSTANTS.LOG_TYPES.WITHDRAW,
    //     {
    //       customerId: params.customerId,
    //       userId: params.userId,
    //       triggeredBy: params.userId ? 1 : 0,
    //       userLog: false,
    //       level: CONSTANTS.LOG_LEVELS.INFO,
    //       details: {},
    //       content: uTrans,
    //     },
    //   );
    //   return uTrans;
    // } catch (err) {
    //   await this.updateById(trans._id, {
    //     status: REJECTED,
    //     reason: err.message,
    //   });
    //   const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
    //   SendEvent(
    //     CONSTANTS.EVENT_TYPES.EVENT_LOG,
    //     CONSTANTS.LOG_TYPES.WITHDRAW,
    //     {
    //       customerId: params.customerId,
    //       userId: params.userId,
    //       triggeredBy: params.userId ? 1 : 0,
    //       userLog: false,
    //       level: CONSTANTS.LOG_LEVELS.ERROR,
    //       details: {
    //         error: err.message,
    //       },
    //       content: uTrans,
    //     },
    //   );
    //   return uTrans;
    // }
    const wallet = await walletService.freezeBalanceForWithdrawal(params);
    const trans = await this.createPendingTransaction(
      WITHDRAW,
      {
        ...params,
        currency: wallet.asset,
        frozenAmount: params.amount,
      },
    );
    if (!trans.isApproving) {
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: trans,
        },
      );
    }
    if (!params.isAutoApprove) {
      const customerDetails = await customerService.findById(params.customerId);
      const to = params.userId
        ? [params.userId.toString(), params.customerId.toString()]
        : [params.customerId.toString()];
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__PENDING,
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
            type: trans.status || '',
            currency: trans.currency || 'USD',
            amount: params.amount,
            gateway: params.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          },
        },
      );
      return trans;
    }
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        params.walletId,
        params.customerId,
        WITHDRAW,
        trans.frozenAmount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: params.customerId,
          userId: params.userId,
          triggeredBy: params.userId ? 1 : 0,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      return uTrans;
    }
  }

  async getDeposits(filter = {}, options = {}) {
    const query = {};
    const {
      page = 1, limit = 10,
    } = filter;
    if (filter.agent) {
      query.agent = filter.agent;
    }
    if (filter.customerId) {
      query['customerId._id'] = mongoose.Types.ObjectId(filter.customerId);
    }
    if (filter.searchText) {
      const regex = new RegExp(filter.searchText, 'i');
      query.$expr = {
        $regexMatch: {
          input: { $toString: '$recordId' },
          regex,
        },
      };
    }
    delete filter.searchText;
    const resp = await this.aggregateWithPagination([
      {
        $match: {
          type: CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT,
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerId',
          pipeline: [
            {
              $project: {
                _id: 1,
                agent: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$customerId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          agent: '$customerId.agent',
        },
      },
      {
        $lookup: {
          from: 'wallets',
          localField: 'walletId',
          foreignField: '_id',
          as: 'wallet',
        },
      },
      {
        $unwind: {
          path: '$wallet',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assets',
          localField: 'wallet.assetId',
          foreignField: '_id',
          as: 'asset',
        },
      },
      {
        $unwind: {
          path: '$asset',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: query,
      },
    ], {
      page,
      limit,
      ...options,
    });
    return resp;
  }

  async getWithdraws(filter = {}, options = {}) {
    const query = {};
    const {
      page = 1, limit = 10,
    } = filter;
    if (filter.agent) {
      query.agent = filter.agent;
    }
    if (filter.customerId) {
      query['customerId._id'] = mongoose.Types.ObjectId(filter.customerId);
    }
    if (filter.searchText) {
      const regex = new RegExp(filter.searchText, 'i');
      query.$expr = {
        $regexMatch: {
          input: { $toString: '$recordId' },
          regex,
        },
      };
    }
    delete filter.searchText;
    const resp = await this.aggregateWithPagination([
      {
        $match: {
          type: CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW,
        },
      },
      {
        $lookup: {
          from: 'customers',
          localField: 'customerId',
          foreignField: '_id',
          as: 'customerId',
          pipeline: [
            {
              $project: {
                _id: 1,
                agent: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$customerId',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          agent: '$customerId.agent',
        },
      },
      {
        $lookup: {
          from: 'wallets',
          localField: 'walletId',
          foreignField: '_id',
          as: 'wallet',
        },
      },
      {
        $unwind: {
          path: '$wallet',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'assets',
          localField: 'wallet.assetId',
          foreignField: '_id',
          as: 'asset',
        },
      },
      {
        $unwind: {
          path: '$asset',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: query,
      },
    ], {
      page,
      limit,
      ...options,
    });
    return resp;
  }

  getInternalTransfer(filter = {}, options = {}) {
    return this.findWithPagination({
      ...filter,
      type: CONSTANTS.TRANSACTIONS_TYPES.INTERNAL_TRANSFER,
    }, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  async checkTransaction(id, type) {
    if (!id) {
      throw new Error('Please provide an id to approve');
    }
    if (!type) {
      throw new Error('Please provide a transaction type');
    }
    const trans = await this.findOne({
      _id: id,
      type,
    }, {

    }, {
      populate: [{
        path: 'assetId',
        select: 'symbol token networks',
      }, {
        path: 'walletId',
        select: 'networks',
      }, {
        path: 'chainId',
        select: 'hasTokens name symbol cryptoapiName'
      }],
    });
    if (!trans) {
      throw new Error(`No such ${type} transaction found`);
    }
    if (trans && !(trans.status === PENDING || trans.status === IN_PROGRESS)) {
      throw new Error(`This transaction is already ${trans.status}, ${id}`);
    }
    return trans;
  }

  async approveDeposit({ id, userId }) {
    const trans = await this.checkTransaction(id, DEPOSIT, APPROVED);
    logger.info(`Deposit Transaction ${id}, Approving`);
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        trans.walletId._id,
        trans.customerId,
        DEPOSIT,
        trans.amount,
        trans.mFee,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      logger.info(`Deposit Transaction ${id}, Approved`);
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      const customerDetails = await customerService.findById(trans.customerId);
      const to = userId
        ? [userId.toString(), customerDetails._id.toString()]
        : [customerDetails._id.toString()];
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__APPROVED,
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
            type: 'APPROVED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          },
        },
      );
      return uTrans;
    } catch (err) {
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.DEPOSIT,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      const customerDetails = await customerService.findById(trans.customerId);
      const to = userId
        ? [userId.toString(), customerDetails._id.toString()]
        : [customerDetails._id.toString()];
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED,
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
            type: trans.type,
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          },
        },
      );
      logger.info(`Deposit Transaction ${id}, Rejected due to ${err.message}`);
      return uTrans;
    }
  }

  async rejectDeposit({ id, reason = null, userId }) {
    const trans = await this.checkTransaction(id, DEPOSIT, REJECTED);
    logger.info(`Deposit Transaction ${id}, Rejected`);
    await this.updateById(trans._id, {
      status: REJECTED,
      reason,
    });
    const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.DEPOSIT,
      {
        customerId: trans.customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: uTrans,
      },
    );
    const customerDetails = await customerService.findById(trans.customerId);
    const to = userId
      ? [userId.toString(), customerDetails._id.toString()]
      : [customerDetails._id.toString()];
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_DEPOSIT__REJECTED,
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
          type: 'REJECTED',
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
        },
      },
    );
    return uTrans;
  }

  async approveWithdraw({ id, userId }) {
    const trans = await this.checkTransaction(id, WITHDRAW, APPROVED);
    logger.info(`Withdraw Transaction ${id}, Approving`);
    try {
      const paid = await walletService.changeBalanceViaWalletId(
        trans.walletId._id,
        trans.customerId,
        WITHDRAW,
        trans.amount,
        trans.mFee,
        !trans.crypto,
      );
      await this.updateById(trans._id, {
        status: APPROVED,
        paid: paid.toString(),
      });
      logger.info(`Withdraw Transaction ${id}, Approved`);
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      let response;
      const callbackURL = `${keys.cryptoAPI.callbackBaseUrl}/withdraw-callback/${trans.cryptoapiName}/mainnet/${trans.from}/${trans._id.toString()}`;
      if (trans.crypto) {
        if (trans.assetId.token) {
          const chainIdIndex = trans.assetId.networks.findIndex(
            (x) => x.chainId.toString() === trans.chainId._id.toString(),
          );
          const { tokenAddress } = trans.assetId.networks[chainIdIndex];
          response = await cryptoAPIService.makeTokenWithdrawal(
            uTrans.cryptoapiName,
            'mainnet',
            tokenAddress,
            undefined,
            uTrans.from,
            uTrans.to,
            uTrans.paid.toString() || uTrans.amount.toString(),
            undefined,
            callbackURL,
            uTrans.note,
          );
        } else {
          response = await cryptoAPIService.makeCoinWithdrawal(
            trans.cryptoapiName,
            'goerli',
            undefined,
            uTrans.from,
            uTrans.to,
            uTrans.paid.toString() || uTrans.amount.toString(),
            undefined,
            callbackURL,
            uTrans.note,
          );
        }

        if (response.error) {
          await this.updateById(trans._id, {
            status: REJECTED,
            reason: response?.error?.body?.error?.message || 'Error approving withdrawal',
          });
          const walletResp = await walletService.revertFrozenAmountForWithdrawal(uTrans);
          return {
            ...uTrans,
            status: REJECTED,
            reason: response?.error?.body?.error?.message || 'Error approving withdrawal',
          };
        }
      }
      console.log('Withdrawal Approval Response', JSON.stringify(response));
      this.updateById(trans._id, {
        callbackURL,
        transactionRequestId: response
          && response.data
          && response.data.data
          && response.data.data.item.transactionRequestId,
        withdrawalApprovalRequestId: response && response.data.requestId,
      });
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.INFO,
          details: {},
          content: uTrans,
        },
      );
      const customerDetails = await customerService.findById(trans.customerId);
      const to = userId
        ? [userId.toString(), customerDetails._id.toString()]
        : [customerDetails._id.toString()];
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_WITHDRAWAL__APPROVED,
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
            type: 'APPROVED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
          },
        },
      );
      return uTrans;
    } catch (err) {
      console.log(err);
      await this.updateById(trans._id, {
        status: REJECTED,
        reason: err.message,
      });
      const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
      SendEvent(
        CONSTANTS.EVENT_TYPES.EVENT_LOG,
        CONSTANTS.LOG_TYPES.WITHDRAW,
        {
          customerId: trans.customerId,
          userId,
          triggeredBy: 1,
          userLog: false,
          level: CONSTANTS.LOG_LEVELS.ERROR,
          details: {
            error: err.message,
          },
          content: uTrans,
        },
      );
      const customerDetails = await customerService.findById(trans.customerId);
      const to = userId
        ? [userId.toString(), customerDetails._id.toString()]
        : [customerDetails._id.toString()];
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_WITHDRAWAL__REJECTED,
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
            type: 'REJECTED',
            currency: trans.currency || 'USD',
            amount: trans.amount,
            gateway: trans.gateway,
            status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
          },
        },
      );
      logger.info(`Withdraw Transaction ${id}, Rejected due to ${err.message}`);
      return uTrans;
    }
  }

  async rejectWithdraw({ id, reason = null, userId }) {
    const trans = await this.checkTransaction(id, WITHDRAW, REJECTED);
    logger.info(`Withdraw Transaction ${id}, Rejected`);
    await this.updateById(trans._id, {
      status: REJECTED,
      reason,
    });
    await walletService.refundBalance(
      trans.walletId,
      trans.customerId,
      trans.amount,
    );
    const uTrans = await this.findById(trans._id, {}, true, this.defaultPopulate);
    SendEvent(
      CONSTANTS.EVENT_TYPES.EVENT_LOG,
      CONSTANTS.LOG_TYPES.WITHDRAW,
      {
        customerId: trans.customerId,
        userId,
        triggeredBy: 1,
        userLog: false,
        level: CONSTANTS.LOG_LEVELS.INFO,
        details: {},
        content: uTrans,
      },
    );
    const customerDetails = await customerService.findById(trans.customerId);
    const to = userId
      ? [userId.toString(), customerDetails._id.toString()]
      : [customerDetails._id.toString()];
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_WITHDRAWAL__REJECTED,
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
          type: 'REJECTED',
          currency: trans.currency || 'USD',
          amount: trans.amount,
          gateway: trans.gateway,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
        },
      },
    );
    return uTrans;
  }

  async getDepositGateways() {
    return CONSTANTS.TRANSACTIONS_GATEWAYS;
  }

  async getWithdrawalGateways() {
    return CONSTANTS.TRANSACTIONS_GATEWAYS;
  }

  async getTransactionsBelongingToClient(clientId) {
    const transactionRecords = await this.find({ customerId: clientId });

    return transactionRecords;
  }

  async addPendingBlockchainDeposit(data) {
    // const {
    //   rawData,
    // } = data;
    const {
      amount,
      currency,
      txId,
    } = data;
    return this.createPendingTransaction(DEPOSIT, {
      ...data,
      amount,
      currency,
      txId,
      gateway: BLOCKCHAIN,
    });
  }

  async addPendingBlockchainDepositOld(data) {
    const {
      rawData,
    } = data;
    const {
      amount,
      currency,
      txId,
    } = rawData;
    return this.createPendingTransaction(DEPOSIT, {
      ...data,
      amount,
      currency,
      txId,
      gateway: BLOCKCHAIN,
    });
  }

  async addUpdateBlockchainDeposit(data) {
    const {
      rawData,
    } = data;
    const {
      amount,
      currency,
      txId,
    } = rawData;
    // TODO: need to deposit this received amount to the main binance wallet.
    let findTransaction = await this.findOne({ txId }, { txId: 1 });
    if (!findTransaction) {
      findTransaction = await this.addPendingBlockchainDeposit({
        ...data,
        amount,
        currency,
        txId,
      });
    }
    return this.approveDeposit(findTransaction._id);
  }

  async addUpdateBlockchainDepositNew(data) {
    let tx = await this.findOne({ txId: data.txId });
    if (!tx) {
      tx = await this.addPendingBlockchainDeposit(data);
    } else {
      await this.updateById(tx._id, {
        rawData: data.rawData,
        confirmations: data.currentConfirmations,
        blockChainReferenceId: data.referenceId,
      });
    }
    const confirmed = data.currentConfirmations >= data.targetConfirmations;
    if (confirmed) {
      if (tx.status === PENDING) {
        await this.approveDeposit({ id: tx._id });
      } else {
        logger.info(`Deposit Transaction ${tx._id} already confirmed`);
      }
    }
  }

  async addUpdateBlockchainWithdrawNew(data) {
    console.log('Withdraw Blockchain Callback Data', data);
    console.log('Withdraw Blockchain referenceId', data.referenceId);
    const tx = await this.findOne({ txId: data.txId });
    await this.updateById(tx._id, {
      rawData: data.rawData,
      confirmations: data.currentConfirmations,
      blockChainReferenceId: data.referenceId,
    });
    const confirmed = data.currentConfirmations >= data.targetConfirmations;
    if (confirmed) {
      if (tx.status === APPROVED) {
        const wallet = await walletService.updateWalletFrozenAmount({
          walletId: tx.walletId,
          amount: tx.frozenAmount,
          customerId: tx.customerId,
          txId: tx._id,
        });
      } else {
        logger.info(`Withdraw Transaction ${tx._id} already confirmed`);
      }
    }
  }

  async addPendingBlockchainWithdraw(params = {}) {
    const wallet = await walletService.freezeBalanceForWithdrawal(params);
    const trans = await this.createPendingTransaction(
      WITHDRAW,
      {
        ...params,
        currency: wallet.asset,
        gateway: BLOCKCHAIN,
        frozenAmount: params.amount,
        crypto: true,
      },
    );
    // this.makeExchangeWithdrawal({ ...trans._doc, ...params });
    if (params.isAutoApprove) {
      this.approveWithdraw({ _id: trans._id });
    }
    return trans;
  }

  async makeExchangeWithdrawal(params = {}) {
    const {
      currency,
      amount,
      to,
      tag,
      _id,
      mFee,
    } = params;
    // TODO: decide which exchange to do the withdrawal on
    const exchangeData = await settingsService.getDefaultExchange();
    if (!exchangeData || !exchangeData.name) {
      return this.rejectWithdraw(_id);
    }
    const apiExchange = await getExchange(
      exchangeData.name,
      {
        apiKey: exchangeData.apiKey,
        secret: exchangeData.secret,
        ...exchangeData.extraParams,
      },
    );
    try {
      const res = await apiExchange.withdraw(
        currency,
        new BigNumber(amount).minus(new BigNumber(mFee.cost)),
        to,
        tag,
        {},
      );
      await this.updateById(_id, { rawData: res });
    } catch (err) {
      logger.error(JSON.stringify(err));
      return this.rejectWithdraw(_id, err.message);
    }
    // return res;
  }
}

async function transactionWatcher() {
  const collection = mongoose.connection.db.collection('transactions');
  const changeStream = collection.watch({ fullDocument: 'updateLookup' });
  changeStream.on('change', async (next) => {
    const {
      fullDocument, documentKey, operationType, updateDescription,
    } = next;
    if (operationType === 'insert') {
      if (!fullDocument.isApproving) {
        const customer = await customerService.findById(fullDocument.customerId);
        let action = '';
        switch (fullDocument.type) {
          case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
            action = CONSTANTS.EMAIL_ACTIONS.TRANSACTION_DEPOSIT_PENDING;
            break;
          case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
            action = CONSTANTS.EMAIL_ACTIONS.TRANSACTION_WITHDRAWAL_PENDING;
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
            ...customer,
            ...fullDocument,
          },
        );
      }
    } else if (operationType === 'update') {
      const customer = await customerService.findById(fullDocument.customerId);
      let action = '';
      if (updateDescription.updatedFields.status !== null) {
        const isApproved = updateDescription.updatedFields.status === 'APPROVED';
        switch (fullDocument.type) {
          case CONSTANTS.TRANSACTIONS_TYPES.DEPOSIT:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.TRANSACTION_DEPOSIT_APPROVED
              : CONSTANTS.EMAIL_ACTIONS.TRANSACTION_DEPOSIT_REJECTED;
            break;
          case CONSTANTS.TRANSACTIONS_TYPES.WITHDRAW:
            action = isApproved
              ? CONSTANTS.EMAIL_ACTIONS.TRANSACTION_WITHDRAWAL_APPROVED
              : CONSTANTS.EMAIL_ACTIONS.TRANSACTION_WITHDRAWAL_REJECTED;
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
            ...customer,
            ...fullDocument,
          },
        );
      }
    }
  });
}
dbConnectionUpCb(transactionWatcher);

module.exports = new Service(TransactionModel.Model, TransactionModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  customerService = services.customerService;
  systemEmailService = services.systemEmailService;
  walletService = services.walletService;
  feeGroupService = services.transactionFeeGroupService;
  settingsService = services.settingService;
  cryptoAPIService = services.cryptoAPIService;
}, 0);
