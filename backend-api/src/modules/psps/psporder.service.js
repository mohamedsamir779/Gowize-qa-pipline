/* eslint-disable class-methods-use-this */
/* eslint-disable linebreak-style */
// transaction service

// const caller = require('exiniti-saturn/caller');
const axios = require('axios');
const { Cruds } = require('src/common/handlers');

const OrderModel = require('./psporder.model');

class Order extends Cruds {
  async markPaid(id) {
    return this.updateById(id, { status: 'PAID' });
  }

  async markFailed(id, reason = 'Payment failed') {
    return this.updateById(id, { status: 'FAILED', reason });
  }

  async markPending(id) {
    return this.updateById(id, { status: 'PENDING' });
  }

  async markPartialPaid(id) {
    return this.updateById(id, { status: 'PARTIALPAID' });
  }

  async makeGatePaid(id, checkoutId, cardNumber) {
    return this.updateById(id, { status: 'PAID', 'dataPrimary.transactionId': checkoutId, cardNumber });
  }

  async makeGatePaidIssue(id, issue) {
    return this.updateById(id, { status: 'PAID', 'dataPrimary.issue': issue });
  }

  async makeGateFailed(id, checkoutId) {
    return this.updateById(id, { status: 'FAILED', checkoutId });
  }

  async makeGateCancelled(id, checkoutId) {
    return this.updateById(id, { status: 'CANCELLED', checkoutId });
  }

  async markCancelled(id) {
    return this.updateById(id, { status: 'CANCELLED' });
  }

  async addDeposittoCrm(params = {}) {
    const {
      clientId,
      amount,
      currency = 'USD',
      note,
      gateway,
      applicationId = '',
      account,
      transactionId,
      cardNumber,
      cardExpiry,
      isAutoApprove = false,
      data = {},
    } = params;

    const transaction = {
      type: 'DEPOSIT',
      customerId: clientId,
      amount,
      note,
      currency,
      transactionParties: {
        gateway,
        applicationId,
        account,
        transactionId,
        cardNumber,
        cardExpiry,
        ...data,
      },
      isAutoApprove,
    };
    try {

      const reqObj = await restApiCaller({
        service: patterns.crmService.createTransactionV2,
        data: transaction,
      });
      if (reqObj) {
        const res = await axios(reqObj);
        if (res.error) console.log('Error coming from try createTransactionV2', error);
        console.log('-------------------------');
        return res;
      }
      return false;

    } catch (error) {
      console.log('adding deposit error catch', error);
      return false;
    }
  }

  async addFailedTrasaction(params = {}) {
    const {
      clientId,
      amount,
      currency = 'USD',
      note,
      gateway,
      applicationId = '',
      account,
      transactionId,
      cardNumber,
      cardExpiry,
      data = {},
      isAutoRejected = true,
    } = params;

    const transaction = {
      type: 'DEPOSIT',
      customerId: clientId,
      amount,
      note,
      currency,
      status: 'REJECTED',
      transactionParties: {
        gateway,
        applicationId,
        account,
        transactionId,
        cardNumber,
        cardExpiry,
        ...data,
      },
      isAutoRejected,
    };
    try {
      const reqObj = await restApiCaller({
        service: patterns.crmService.createTransactionV2,
        data: transaction,
      });
      if (reqObj) {
        const res = await axios(reqObj);
        if (res.error) console.log('Error coming from try addFailedTrasaction', res.error);
        if (res.error) return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async getTransactionFromCRM(transactionId) {
    try {
      const reqObj = await restApiCaller({
        service: patterns.crmService.getTransaction,
        data: { transactionId },
      });
      const res = await axios(reqObj);
      if (res.error) console.log('Error coming from try getTransactionFromCRM', res.error);
      if (res.error) return false;
      return res.data;
    } catch (error) {
      return false;
    }
  }

  async addWithdrawalToCRM(params = {}) {
    const {
      clientId,
      amount,
      currency = 'USD',
      note = '',
      gateway,
      applicationId = '',
      account,
      tid,
    } = params;

    const transaction = {
      type: 'WITHDRAWAL',
      customerId: clientId,
      amount,
      note,
      transactionParties: {
        gateway,
        applicationId,
        account,
      },
    };
    if (gateway === 'PRAXIS') transaction.transactionParties.tid = tid; // transaction id of praxis
    try {
      const reqObj = await restApiCaller({
        service: patterns.crmService.createTransactionV2,
        data: transaction,
      });
      const res = await axios(reqObj);
      if (res.error) console.log('Error coming from try getTransactionFromCRM', res.error);
      if (res.error) return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async updateTransactionInCRM(params = {}) {
    const {
      note,
      gateway,
      applicationId = '',
      account,
      transactionId,
      cardNumber,
      status,
      salesRep,
      fee,
      cardExpiry,
    } = params;

    let content;
    if (status === 'APPROVED') {
      if (gateway === 'GATETOPAY') {
        content = {
          status,
          transactionParties: {
            gateway,
            applicationId,
            account,
            transactionId,
            cardNumber,
            cardExpiry,
          },
          salesRep,
          fee,
          note,
        };
      } else {
        content = {
          status,
          transactionParties: {
            gateway,
            applicationId,
            account,
            transactionId,
          },
          salesRep,
          fee,
          note,
        };
      }
    } else {
      content = {
        status,
        salesRep,
        note,
      };
    }
    try {
      const reqObj = restApiCaller({
        service: patterns.crmService.updateTransaction,
        data: { transactionId, content },
      });
      const res = await axios(reqObj);
      if (res.error) console.log('Error coming from try getTransactionFromCRM', res.error);
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateOrder(id, params) {
    console.log("----------updateOrder---:", params)
    return this.updateById(id, params);
  }
}

module.exports = new Order(OrderModel.Model, OrderModel.Schema);
