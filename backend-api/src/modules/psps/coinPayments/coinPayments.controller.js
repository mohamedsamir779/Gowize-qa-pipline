/* eslint-disable class-methods-use-this */
const { ResponseMessages } = require('src/common/data');
const { ApiResponse } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const { coinPayments, frontendRedirectUrl } = require('src/common/data').keys;
const crypto = require('crypto');
const {
  pspOrdersService,
  transactionService,
  walletService,
} = require('src/modules/services');

const coinPaymentsService = require('./coinPayments.service');
const {
  VIEW_CONTENT_COIN_PAYMENTS_SUCCESS,
  VIEW_CONTENT_COIN_PAYMENTS_CANCELED

}  = require('./constants')

const translateLanguage = require('src/common/handlers/translator');
const {
  CustomError
} = require('src/common/handlers');


const signHmacSha512 = (key, str)  => {
  let hmac = crypto.createHmac("sha512", key);
  let signed = hmac.update(Buffer.from(str, 'utf-8')).digest("hex");
  return signed;
};

class CoinPaymentsController {
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
    try {
      const order = await pspOrdersService.create({
        customerId: _id,
        amount,
        language: req.headers['accept-language'] || 'en-gb',
        paymentGateway: 'COINPAYMENT',
        currency,
      });
 
      const output = await coinPaymentsService.createPaymentHandle(order,
        {email, amount, user: req.user}
      );
  
      const customerWallet = await walletService.findOne({ belongsTo: req.user, asset: 'USD' });
      const resTransRes = await transactionService.createPendingTransaction('DEPOSIT', {
        customerId: req.user,
        walletId: customerWallet._id,
        currency: customerWallet.asset,
        gateway: 'COINPAYMENT',
        amount,
      });
      await pspOrdersService.updateById(order._id, {
        dataPrimary: {
          amount,
          result:output,
        },
      });
      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, {
          ...output
        },
      );
    } catch (error) {
      logger.error(error.stack);
      return next(new Error('ERROR CREATING CHECKOUT ORDER'));
    }
  }

  static async ipnCallback(req, res, next) {
    try {
      const body = req.body
      const hmac = req.headers['hmac']
      const res = signHmacSha512(coinPayments.ipnSecret.trim(), new URLSearchParams(body).toString());
      if (res !== hmac) {
        console.log('signature is not matching');
        throw new Error('signature mismatch');
      }
      let data = JSON.parse(JSON.stringify(body));
      let {  ipn_type,
        txn_id,
        item_name,
        item_number,
        amount1,
        amount2,
        currency1,
        currency2,
        status,
        status_text,
        invoice,
        merchant } = data
      const orderId = invoice.split('__')[0]
      const order = await pspOrdersService.findById(orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      if (order.status === 'PAID') {
        throw new Error('Order is already paid');
      }
      if (currency1 !== order.currency) {
        throw new Error('Original currency mismatch!');
      }
      if (parseFloat(amount1) < parseFloat(order.amount)) {
        throw new Error('Amount is less than order total!');
      }
      const dataPrimary = {
        ...order._doc.dataPrimary,
        ...body,
      };

      if (parseInt(status, 10) >= 100 || parseInt(status, 10) === 2) {
        // payment is complete or queued for nightly payout, success
        await pspOrdersService.updateById(order._id, {
          gatewayStatus: status_text,
          dataPrimary,
        });
        await pspOrdersService.markPaid(order._id);
      } else if (parseInt(status, 10) < 0) {
        // payment error, this is usually final but payments will sometimes be reopened if there was no exchange rate conversion or with seller consent
        await orderService.updateById(order._id, {
          gatewayStatus: status_text,
          dataPrimary,
        });
        await pspOrdersService.markFailed(order._id, status_text, status_text);
      } 
      // payment is pending, you can optionally add a note to the order page
      await orderService.updateById(order._id, {
        gatewayStatus: status_text,
        dataPrimary,
      });

      return ApiResponse(
        res, true, ResponseMessages.RECORD_CREATE_SUCCESS, null,
      );
    } catch (error) {
      console.log('skrill------- ERROR VERIFING', error)
    }
  }

  static async success(req, res, next) {
    try {
      const { orderId, customerId } = req.query;
      return res.render('coin-payments-success', {
        redirectUrl: frontendRedirectUrl,
        language: 'en-US,en;q=0.9',
        ...VIEW_CONTENT.VIEW_CONTENT_COIN_PAYMENTS_SUCCESS,
        translateLanguage,
        checkoutId: orderId,
      });
    } catch (error) {
      console.log('skrill------- ERROR VERIFING', error)
    }
  }
  static async canceled(req, res, next) {
    try {
      const { orderId, customerId } = req.query;
      const order = await pspOrdersService.findById(orderId);
      if (order.gatewayStatus === 'initialized') {
        order.gatewayStatus = 'canceled';
        await pspOrdersService.markCancelled(order._id)
        order.dataPrimary = {
          ...order.dataPrimary,
        };
        await order.save();
      }

      return res.render('coin-payments-cancelled', {
        redirectUrl: frontendRedirectUrl,
        language: order.language || 'en-US,en;q=0.9',
        ...VIEW_CONTENT_COIN_PAYMENTS_CANCELED,
        translateLanguage,
      });
    } catch (error) {
      console.log('skrill------- ERROR VERIFING', error)
    }
  }
  
}

module.exports = CoinPaymentsController;
