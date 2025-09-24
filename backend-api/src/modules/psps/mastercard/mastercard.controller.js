/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { mastercard } = require('src/common/data').keys;

const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');
const mastercardService = require('./mastercard.service');

class MasterCardController {
  static async pay(req, res, next) {
    const {
      amount, currency,
    } = req.body;
    const {
      _id, email, firstName, lastName,
    } = req.user;
    let { ip } = req;
    try {
      const tmp = ip.split(':');
      ip = tmp[0];
    } catch (error) {
      logger.warn('invalid ip ', ip);
    } 
    // ip = '5.32.117.250';`
    try {
      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'MASTERCARD',
        currency,
      });
      const { checkoutId, result } = await mastercardService.createCheckoutItem(
        order, {
          'customer.givenName': `${firstName} ${lastName}`, 'customer.email': email, 'customer.ip': ip,
        },
      );
      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'MASTERCARD',
        amount,
      });
      await pspOrdersService.updateById(order._id, {
        checkoutId,
        dataPrimary: {
          amount,
          result,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          checkoutId, orderId: order._id,
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async verifyPayment(req, res, next) {
    try {
      const { order, result } = req.body;
      console.log('--------------masterCard--verifyPayment', req.body);
      if (req.headers['x-notification-secret'] === mastercard.notificationSecret) {
        const { id } = await mastercardService.verifyPayment(order.id);
        if (id) {
          const orderFind = await pspOrdersService.findById(order.id);
          if (orderFind) {
            if (orderFind.status !== 'PAID') {
              if (result === 'SUCCESS' && order.status === 'CAPTURED') {
                console.log('true', order);
                await pspOrdersService.markPaid(orderFind.id);
              } else if (result === 'PENDING') {
                console.log('pending', order);
                await pspOrdersService.markPending(orderFind.id);
              } else {
                console.log('failed', order);
                await pspOrdersService.markFailed(orderFind.id);
              }
            } else console.log('Already Paid => ', orderFind._id);
          } else {
            console.error('Mastercard Order Not found => ', req.body.order);
          }
        }
      }

      return ApiResponse(
        res, true, ResponseMessages.RECORD_UPDATE_SUCCESS, true,
      );
    } catch (e) {
      logger.error(e.stack);
      return next(e);
    }
  }
}

module.exports = MasterCardController;
