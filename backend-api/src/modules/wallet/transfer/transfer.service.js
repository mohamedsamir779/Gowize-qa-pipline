const { Cruds, SendEvent } = require('src/common/handlers');
const { CONSTANTS } = require('src/common/data');
const mongoose = require('mongoose');
const { Model, Schema } = require('./transfer.model');
const { EVENT_TYPES, PUSH_NOTIFICATION_GROUPS } = require('../../../common/data/constants');
const { logger } = require('../../../common/lib');

// const {
//   EVENT_TYPES,
//   LOG_TYPES,
//   LOG_LEVELS,
// } = CONSTANTS;

let walletService;
let fxTransactionService;
let accountService;
let conversionRateService;
let customerService;
let systemEmailService;

class Service extends Cruds {
  _constructor() {
    this.defaultPopulate = [
      {
        path: 'fromId',
        select: '',
      },
      {
        path: 'toId',
        select: '',
      },
      {
        path: 'customerId',
        select: 'firstName lastName category agent',
      },
    ];
  }

  getPaginate(filter, options = {}) {
    return this.findWithPagination(filter, {
      ...options,
      populate: this.defaultPopulate,
    });
  }

  async sendSystemEmailToCustomer(customer, action, from, to) {
    systemEmailService.sendSystemEmail(
      action,
      {
        to: customer.email,
        lang: customer?.language,
      },
      {
        from,
        to,
        firstName: customer?.firstName,
        lastName: customer?.lastName,
        email: customer?.email,
      },
    );
  }

  async addPendingTransaction(transferObj) {
    const {
      source,
      destination,
      customerId,
      amount: amt,
      userId,
      fromId, toId, note, baseCurrency, targetCurrency,
    } = transferObj;
    let convertedAmount = parseFloat(amt);
    let conversionRate = 1;
    if (baseCurrency !== targetCurrency) {
      conversionRate = await conversionRateService.getConversionRate({
        baseCurrency,
        targetCurrency,
      });
      convertedAmount = parseFloat(amt) * parseFloat(conversionRate);
    }
    if (source === destination && source === 'FX') {
      return fxTransactionService.addPendingInternalTransfer(
        {
          amount: amt,
          customerId,
          note,
          tradingAccountFrom: fromId,
          tradingAccountTo: toId,
        },
        fromId,
        toId,
      );
    }
    let transObj;
    const customerDetails = await customerService.findById(customerId);
    const to = userId
      ? [userId.toString(), customerDetails._id.toString()]
      : [customerDetails._id.toString()];
    if (source === 'FX' && destination === 'WALLET') {
      const tradingAccountFrom = await accountService.findById(
        mongoose.Types.ObjectId(fromId),
      );
      const walletTo = await walletService.findById(
        mongoose.Types.ObjectId(toId),
      );
      const equities = accountService.getEquity(tradingAccountFrom.login, tradingAccountFrom.platform, tradingAccountFrom.type === 'DEMO');
      if (parseFloat(amt) > parseFloat(equities.Balance)) { throw new Error('Not enough money to transfer'); }
      transObj = await this.create({
        status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
        customerId,
        fromId: tradingAccountFrom._id,
        toId: walletTo._id,
        amount: amt,
        targetAmount: convertedAmount?.toFixed(2),
        baseCurrency,
        targetCurrency,
        note,
        source,
        destination,
        conversionRate,
        fromSourceModel: 'TradingAccount',
        toSourceModel: 'wallet',
      });
      this.sendSystemEmailToCustomer(
        customerDetails,
        CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_REQUEST,
        `${tradingAccountFrom.login} (${tradingAccountFrom.platform}) ${amt} ${baseCurrency} `,
        ` Wallet ${walletTo.asset} - ${convertedAmount?.toFixed(2)} ${targetCurrency} `,
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__PENDING,
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
            recordId: transObj.recordId,
            type: 'PENDING',
            to: targetCurrency,
            from: tradingAccountFrom.login,
            amount: transObj.amount,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          },
        },
      );
    } else if (source === 'WALLET' && destination === 'FX') {
      const walletFrom = await walletService.findById(
        mongoose.Types.ObjectId(fromId),
      );
      const tradingAccountTo = await accountService.findById(
        mongoose.Types.ObjectId(toId),
      );
      if (parseFloat(amt) > parseFloat(walletFrom.amount)) { throw new Error('Not enough money to transfer'); }
      transObj = await this.create({
        status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
        customerId,
        fromId: walletFrom._id,
        toId: tradingAccountTo._id,
        amount: amt,
        targetAmount: convertedAmount?.toFixed(2),
        baseCurrency,
        targetCurrency,
        note,
        source,
        destination,
        conversionRate,
        fromSourceModel: 'wallet',
        toSourceModel: 'TradingAccount',
      });
      this.sendSystemEmailToCustomer(
        customerDetails,
        CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_REQUEST,
        ` Wallet ${walletFrom.asset} - ${amt} ${baseCurrency} `,
        `${tradingAccountTo.login} (${tradingAccountTo.platform}) ${convertedAmount?.toFixed(2)} ${targetCurrency} `,
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__PENDING,
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
            recordId: transObj.recordId,
            type: 'PENDING',
            from: baseCurrency,
            to: tradingAccountTo.login,
            amount: transObj.amount,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          },
        },
      );
    } else {
      const walletFrom = await walletService.findById(
        mongoose.Types.ObjectId(fromId),
      );
      const walletTo = await walletService.findById(
        mongoose.Types.ObjectId(toId),
      );
      if (parseFloat(amt) > parseFloat(walletFrom.amount)) { throw new Error('Not enough money to transfer'); }
      transObj = await this.create({
        status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
        customerId,
        fromId: walletFrom._id,
        toId: walletTo._id,
        amount: amt,
        targetAmount: convertedAmount?.toFixed(2),
        baseCurrency,
        targetCurrency,
        note,
        source,
        destination,
        conversionRate,
        fromSourceModel: 'wallet',
        toSourceModel: 'wallet',
      });
      this.sendSystemEmailToCustomer(
        customerDetails,
        CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_REQUEST,
        ` Wallet ${walletFrom.asset} - ${amt} ${baseCurrency} `,
        ` Wallet ${walletTo.asset} - ${convertedAmount?.toFixed(2)} ${targetCurrency} `,
      );
      SendEvent(
        EVENT_TYPES.PUSH_NOTIFICATION,
        {
          pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__PENDING,
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
            recordId: transObj.recordId,
            type: 'PENDING',
            from: baseCurrency,
            to: targetCurrency,
            amount: transObj.amount,
            status: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
          },
        },
      );
    }
    logger.info(['internalTransfer', 'success', 'transaction', transObj]);
    return transObj;
  }

  async getAggregate(pipeLine) {
    return this.aggregate(pipeLine)[0];
  }

  async fxToWallet(transaction, userId) {
    const tradingAccountFrom = await accountService.findById(
      mongoose.Types.ObjectId(transaction.fromId),
    );
    const walletTo = await walletService.findById(
      mongoose.Types.ObjectId(transaction.toId),
    );
    const equities = await accountService.getEquity(tradingAccountFrom.login, tradingAccountFrom.platform, tradingAccountFrom.type === 'DEMO');
    if (parseFloat(transaction.amount) > parseFloat(equities.Balance)) { throw new Error('Not enough money to transfer'); }

    const withdrawObj = await fxTransactionService.debitForTransfer({
      amount: transaction.amount,
      customerId: walletTo.belongsTo,
      note: transaction.note,
      userId,
    }, tradingAccountFrom);
    if (!withdrawObj) { throw new Error('Transfer failed'); }
    const depositObj = await walletService.creditBalanceForDeposit({
      walletId: walletTo._id,
      amount: transaction.targetAmount,
      customerId: walletTo.belongsTo,
    });
    if (!depositObj) { throw new Error('Transfer failed'); }
    const customer = await customerService.findById(walletTo.belongsTo);
    this.sendSystemEmailToCustomer(
      customer,
      CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_APPROVAL,
      `${tradingAccountFrom.login} (${tradingAccountFrom.platform}) ${transaction.amount} ${transaction.baseCurrency} `,
      ` Wallet ${walletTo.asset} - ${transaction.targetAmount} ${transaction.targetCurrency} `,
    );
  }

  async walletToFx(transaction, userId) {
    const walletFrom = await walletService.findById(
      mongoose.Types.ObjectId(transaction.fromId),
    );
    const tradingAccountTo = await accountService.findById(
      mongoose.Types.ObjectId(transaction.toId),
    );
    if (parseFloat(transaction.amount) > parseFloat(walletFrom.amount)) { throw new Error('Not enough money to transfer'); }
    await walletService.debitBalanceForInternalTransfer({
      walletId: walletFrom._id,
      amount: transaction.amount,
      customerId: walletFrom.belongsTo,
    });
    await fxTransactionService.creditForTransfer({
      amount: transaction.targetAmount,
      customerId: walletFrom.belongsTo,
      note: transaction.note,
      userId,
      gateway: 'INTERNAL_TRANSFER',
    }, tradingAccountTo);
    const customer = await customerService.findById(walletFrom.belongsTo);
    this.sendSystemEmailToCustomer(
      customer,
      CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_APPROVAL,
      ` Wallet ${walletFrom.asset} - ${transaction.amount} ${transaction.baseCurrency} `,
      `${tradingAccountTo.login} (${tradingAccountTo.platform}) ${transaction.targetAmount} ${transaction.targetCurrency} `,
    );
  }

  async walletToWallet(transaction) {
    const walletFrom = await walletService.findById(
      mongoose.Types.ObjectId(transaction.fromId),
    );
    const walletTo = await walletService.findById(
      mongoose.Types.ObjectId(transaction.toId),
    );
    if (parseFloat(transaction.amount) > parseFloat(walletFrom.amount)) { throw new Error('Not enough money to transfer'); }
    await walletService.debitBalanceForInternalTransfer({
      walletId: walletFrom._id,
      amount: transaction.amount,
      customerId: walletFrom.belongsTo,
    });
    await walletService.creditBalanceForDeposit({
      walletId: walletTo._id,
      amount: transaction.targetAmount,
      customerId: walletTo.belongsTo,
    });
    const customer = await customerService.findById(walletTo.belongsTo);
    this.sendSystemEmailToCustomer(
      customer,
      CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_APPROVAL,
      ` Wallet ${walletFrom.asset} - ${transaction.amount} ${transaction.baseCurrency} `,
      ` Wallet ${walletTo.asset} - ${transaction.targetAmount} ${transaction.targetCurrency} `,
    );
  }

  async approveTransaction(transactionId, userId) {
    const transaction = await this.findById(transactionId);
    if (!transaction) { throw new Error('Transaction not found'); }
    if (transaction.status !== CONSTANTS.TRANSACTIONS_STATUS.PENDING) { throw new Error('Transaction is not pending'); }
    if (transaction.source === 'FX' && transaction.destination === 'WALLET') {
      await this.fxToWallet(transaction, userId);
    } else if (transaction.source === 'WALLET' && transaction.destination === 'FX') {
      await this.walletToFx(transaction, userId);
    } else {
      await this.walletToWallet(transaction);
    }
    const to = [userId, transaction.customerId];
    const customerDetails = await customerService.findById(transaction.customerId);
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__APPROVED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          recordId: customerDetails.recordId,
          _id: customerDetails._id,
        },
        transaction: {
          recordId: transaction.recordId,
          type: 'APPROVED',
          from: transaction.source === 'FX' ? 'FX Account' : transaction.baseCurrency,
          to: transaction.destination === 'FX' ? 'FX Account' : transaction.destination,
          amount: transaction.amount,
          status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
        },
      },
    );
    return this.updateById(transactionId, {
      status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
      processedBy: userId,
    });
  }

  async rejectTransaction(transactionId, userId) {
    const transaction = await this.findById(transactionId);
    if (!transaction) { throw new Error('Transaction not found'); }
    if (transaction.status !== CONSTANTS.TRANSACTIONS_STATUS.PENDING) { throw new Error('Transaction is not pending'); }
    const to = [userId, transaction.customerId];
    const customerDetails = await customerService.findById(transaction.customerId);
    const fromDetails = {};
    const toDetails = {};
    if (transaction.source === 'FX') {
      const tradingAccountFrom = await accountService.findById(transaction.fromId);
      fromDetails.login = tradingAccountFrom.login;
      fromDetails.platform = tradingAccountFrom.platform;
    } else {
      fromDetails.asset = transaction.baseCurrency;
    }
    if (transaction.destination === 'FX') {
      const tradingAccountTo = await accountService.findById(transaction.toId);
      toDetails.login = tradingAccountTo.login;
      toDetails.platform = tradingAccountTo.platform;
    } else {
      toDetails.asset = transaction.targetCurrency;
    }
    this.sendSystemEmailToCustomer(
      customerDetails,
      CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_REJECTION,
      transaction.source === 'FX' ? ` ${fromDetails.login} (${fromDetails.platform})` : ` Wallet ${fromDetails.asset} - ${transaction.amount} ${transaction.baseCurrency} `,
      transaction.destination === 'FX' ? ` ${toDetails.login} (${toDetails.platform})` : ` Wallet ${toDetails.asset} - ${transaction.targetAmount} ${transaction.targetCurrency} `,
    );
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType: PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__REJECTED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to,
      },
      {
        client: {
          firstName: customerDetails.firstName,
          lastName: customerDetails.lastName,
          email: customerDetails.email,
          recordId: customerDetails.recordId,
          _id: customerDetails._id,
        },
        transaction: {
          recordId: transaction.recordId,
          type: 'REJECTED',
          from: transaction.source === 'FX' ? 'FX Account' : transaction.baseCurrency,
          to: transaction.destination === 'FX' ? 'FX Account' : transaction.destination,
          amount: transaction.amount,
          status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
        },
      },
    );
    return this.updateById(transactionId, {
      status: CONSTANTS.TRANSACTIONS_STATUS.REJECTED,
      processedBy: userId,
    });
  }

  async getAllTransactions(filter, options = {}) {
    const pagination = {
      page: parseInt(filter.page, 10) || 1,
      limit: parseInt(filter.limit, 10) || 10,
    };
    const query = {};
    const {
      filteredValues,
    } = filter;
    if (filter.searchText) {
      const regex = new RegExp(filter.searchText, 'i');
      query.$expr = {
        $regexMatch: {
          input: { $toString: '$recordId' },
          regex,
        },
      };
    }
    if (filteredValues) {
      Object.keys(filteredValues).forEach((key) => {
        if (!filteredValues[key]) return;
        switch (key) {
          case 'customerId':
            query.customerId = mongoose.Types.ObjectId(filteredValues[key]);
            break;
          case 'filterDate':
            if (filteredValues[key].fromDate) {
              query.createdAt = {
                $gte: new Date(filteredValues[key].fromDate),
              };
            }
            if (filteredValues[key].toDate) {
              query.createdAt = {
                ...query.createdAt,
                $lte: new Date(filteredValues[key].toDate),
              };
            }
            break;
          case 'status':
            query.status = filteredValues[key].toUpperCase();
            break;
          case 'amount':
            query.amount = filteredValues[key];
            break;
          case 'currency':
            query.$or = [
              { baseCurrency: filteredValues[key] },
              { destination: filteredValues[key] },
            ];
            break;
          case 'fees':
            query.fees = filteredValues[key];
            break;
          case 'agent':
            query.agent = {
              $in: filteredValues[key].split(',').map((id) => mongoose.Types.ObjectId(id)).push(null),
            };
            break;
          default:
            break;
        }
      });
    }
    if (filter.agent) {
      query.agent = {
        ...filter.agent,
      };
    }
    const resp = await this.aggregateWithPagination([
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
        $match: query,
      },
    ], {
      ...options,
      ...pagination,
    });
    resp.docs = await Promise.all(resp.docs.map(async (doc) => {
      if (doc.fromSourceModel === 'wallet') {
        const fromDetails = await walletService.findById(doc.fromId);
        doc.fromId = fromDetails;
      } else {
        const fromDetails = await accountService.findById(doc.fromId);
        doc.fromId = fromDetails;
      }
      if (doc.toSourceModel === 'wallet') {
        const toDetails = await walletService.findById(doc.toId);
        doc.toId = toDetails;
      } else {
        const toDetails = await accountService.findById(doc.toId);
        doc.toId = toDetails;
      }
      return doc;
    }));
    return resp;
  }

  async addApprovedTransaction(transaction) {
    const {
      source,
      destination,
      fromId, toId, userId,
    } = transaction;
    const amount = parseFloat(transaction.amount, 10);
    const fromData = source === 'FX' ? await accountService.findById(fromId) : await walletService.findById(fromId);
    const toData = destination === 'FX' ? await accountService.findById(toId) : await walletService.findById(toId);
    if (!fromData || !toData) throw new Error('Check account Details');
    if (source === destination && source === 'FX') {
      return fxTransactionService.addApprovedInternalTransfer(
        {
          amount,
          userId,
          customerId: fromData.customerId,
          gateway: 'INTERNAL_TRANSFER',
          tradingAccountFrom: fromId,
          tradingAccountTo: toId,
          processedBy: userId,
        },
        fromId,
        toId,
      );
    }
    const customerId = source === 'FX' ? fromData.customerId : fromData.belongsTo;
    const sourceCustomerId = customerId;
    const destinationCustomerId = destination === 'FX' ? toData.customerId : toData.belongsTo;
    const customer = await customerService.findById(customerId);
    const conversionRate = await conversionRateService.getConversionRate({
      // eslint-disable-next-line no-nested-ternary
      baseCurrency: source === 'FX' ? fromData.currency : fromData?.isIb ? 'USD' : fromData.asset,
      // eslint-disable-next-line no-nested-ternary
      targetCurrency: destination === 'FX' ? toData.currency : toData?.isIb ? 'USD' : toData.asset,
    });
    const convertedAmount = amount * conversionRate;
    let fromContent = '';
    let toContent = '';
    if (!convertedAmount || !conversionRate) throw new Error('Conversion rate not found');
    if (source === 'FX' && destination === 'WALLET') {
      fromContent = `FX Account ${fromData.currency} - ${amount} ${fromData.currency}`;
      toContent = `Wallet ${toData?.isIb ? 'USD' : toData.asset} - ${convertedAmount} ${toData?.isIb ? 'USD' : toData.asset}`;
      const withdrawObj = await fxTransactionService.debitForTransfer({
        amount,
        customerId: sourceCustomerId,
        note: 'TRANSFER_TO_WALLET',
        userId,
      }, fromData);
      if (!withdrawObj) throw new Error('Unable to debit from FX Account');
      const depositObj = await walletService.creditBalanceForDeposit({
        walletId: toData._id,
        amount: convertedAmount,
        customerId: destinationCustomerId,
      }, toData);
      if (!depositObj) throw new Error('Unable to credit to Wallet');
    } else if (source === 'WALLET' && destination === 'FX') {
      fromContent = `Wallet ${fromData?.isIb ? 'USD' : fromData.asset} - ${amount} ${fromData?.isIb ? 'USD' : fromData.asset}`;
      toContent = `FX Account ${toData.currency} - ${convertedAmount} ${toData.currency}`;
      const withdrawObj = await await walletService.debitBalanceForInternalTransfer({
        walletId: fromData._id,
        amount,
        customerId: sourceCustomerId,
      });
      if (!withdrawObj) throw new Error('Unable to debit from Wallet');
      const depositObj = await fxTransactionService.creditForTransfer({
        amount: convertedAmount,
        customerId: destinationCustomerId,
        note: 'TRANSFER_FROM_WALLET',
        userId,
      }, toData);
      if (!depositObj) throw new Error('Unable to credit to FX Account');
    } else if (source === destination && source === 'WALLET') {
      fromContent = `Wallet ${fromData?.isIb ? 'USD' : fromData.asset} - ${amount} ${fromData?.isIb ? 'USD' : fromData.asset}`;
      toContent = `Wallet ${toData?.isIb ? 'USD' : toData.asset} - ${convertedAmount} ${toData?.isIb ? 'USD' : toData.asset}`;
      const withdrawObj = await walletService.debitBalanceForInternalTransfer({
        walletId: fromData._id,
        amount,
        customerId: sourceCustomerId,
      });
      if (!withdrawObj) throw new Error('Unable to debit from Wallet');
      const depositObj = await walletService.creditBalanceForDeposit({
        walletId: toData._id,
        amount: convertedAmount,
        customerId: destinationCustomerId,
      }, toData);
      if (!depositObj) throw new Error('Unable to credit to Wallet');
    } else {
      throw new Error('Invalid transaction');
    }
    const rec = this.create({
      processedBy: userId,
      status: 'APPROVED',
      amount,
      customerId,
      targetAmount: convertedAmount,
      // eslint-disable-next-line no-nested-ternary
      baseCurrency: source === 'FX' ? fromData.currency : fromData?.isIb ? 'USD' : fromData.asset,
      // eslint-disable-next-line no-nested-ternary
      targetCurrency: destination === 'FX' ? toData.currency : toData?.isIb ? 'USD' : toData.asset,
      source,
      destination,
      fromId,
      toId,
      fromSourceModel: source === 'FX' ? 'TradingAccount' : 'wallet',
      toSourceModel: destination === 'FX' ? 'TradingAccount' : 'wallet',
      conversionRate,
    });
    this.sendSystemEmailToCustomer(
      customer,
      CONSTANTS.EMAIL_ACTIONS.WALLET_TRANSFER_APPROVAL,
      fromContent,
      toContent,
    );
    SendEvent(
      EVENT_TYPES.PUSH_NOTIFICATION,
      {
        pushNotificationType:
          PUSH_NOTIFICATION_GROUPS.TRANSACTION.WALLET_INTERNAL_TRANSFER__APPROVED,
        pushNotificationGroup: Object.keys(PUSH_NOTIFICATION_GROUPS).find((key) => key === 'TRANSACTION'),
        to: [customer._id.toString()],
      },
      {
        client: {
          firstName: customer?.firstName,
          lastName: customer?.lastName,
          email: customer?.email,
          recordId: customer?.recordId,
          _id: customer?._id.toString(),
        },
        transaction: {
          recordId: rec.recordId,
          type: 'APPROVED',
          // eslint-disable-next-line no-nested-ternary
          to: source === 'FX' ? fromData.login : fromData?.isIb ? 'USD' : fromData.asset,
          // eslint-disable-next-line no-nested-ternary
          from: source === 'FX' ? toData.login : toData?.isIb ? 'USD' : toData.asset,
          amount: rec.amount,
          status: CONSTANTS.TRANSACTIONS_STATUS.APPROVED,
        },
      },
    );
    return rec;
  }

  async approvedIbTransfer(params) {
    const {
      amount, fromId, toId, customerId,
    } = params;
    const ibWallet = await walletService.findById(fromId);
    const account = await accountService.findById(toId);
    if (!ibWallet || !account) throw new Error('Check account Details');
    return this.addApprovedTransaction({
      source: 'WALLET',
      destination: 'FX',
      customerId,
      fromId,
      toId,
      userId: null,
      amount,
    });
  }
}

module.exports = new Service(Model, Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  walletService = services.walletService;
  fxTransactionService = services.fxTransactionService;
  accountService = services.accountService;
  conversionRateService = services.conversionRateService;
  customerService = services.customerService;
  systemEmailService = services.systemEmailService;
}, 0);
