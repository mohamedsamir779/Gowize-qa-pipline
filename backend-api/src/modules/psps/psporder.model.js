/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const { CONSTANTS } = require('../../common/data');

const { Schema } = mongoose;
const OrderSchema = new Schema({
  customerId: { type: Schema.ObjectId },
  paymentGateway: { type: String, required: true },
  checkoutId: { type: String },
  checkoutId2: { type: String },
  amount: { type: String, required: true },
  currency: { type: String, required: true },
  dataPrimary: { type: Object },
  language: { type: String, required: false, default: 'en-gb' },
  paymentFor: { type: Schema.Types.ObjectId, refPath: 'paymentForModel' },
  paymentForModel: {
    type: String,
    default: CONSTANTS.PAYMENT_FOR_MODELS.WALLET,
    enum: [...Object.values(CONSTANTS.PAYMENT_FOR_MODELS)],
  },
  transactionId: { type: Schema.Types.ObjectId, refPath: 'transactionForModel' },
  transactionIdModel: {
    type: String,
    default: CONSTANTS.TRANSACTIONS_MODEL_TYPES.WALLET,
    enum: [...Object.values(CONSTANTS.TRANSACTIONS_MODEL_TYPES)],
  },
  status: {
    type: String,
    required: true,
    enum: ['UNPAID', 'FAILED', 'CANCELED', 'PAID', 'EXPIRED'],
    default: 'UNPAID',
  },
  orderType: {
    type: String,
    enum: ['DEPOSIT', 'WITHDRAWAL'],
    default: 'DEPOSIT',
  },
  transactionCreated: {
    type: Boolean,
    default: false,
  },
  rate: {
    type: Number,
    default: 1,
  },
  convertedAmount: {
    type: Number,
    default: 0,
  },
  fees: {
    type: Number,
    default: 0,
  },
});

module.exports.Model = mongoose.model('psp-orders', OrderSchema);
module.exports.Schema = OrderSchema;
