const { model, Schema, Decimal128 } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { CONSTANTS } = require('src/common/data');

const TransactionSchema = new Schema(
  {

    recordId: { type: Number },
    type: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_TYPES),
    },
    gateway: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_GATEWAYS),
    },
    status: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_STATUS),
      default: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'customers' },
    tradingAccountId: { type: Schema.Types.ObjectId, ref: 'TradingAccount' },
    tradingAccountFrom: { type: Schema.Types.ObjectId, ref: 'TradingAccount' },
    tradingAccountTo: { type: Schema.Types.ObjectId, ref: 'TradingAccount' },

    processedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    reason: { type: String },
    amount: { type: Number, default: 0 },
    paid: {
      type: Number,
      default() {
        return this.amount;
      },
    },
    fee: { type: Number, default: 0 },

    currency: { type: String, default: 'USD' },
    from: { type: String },
    to: { type: String },

    note: { type: String },
    rawData: {
      type: Schema.Types.Mixed,
    },
    receipt: {
      type: String,
      default: '',
    },
    isApproving: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Schema.Types.Mixed,
    },
    txId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

TransactionSchema.index({
  type: 1,
  amount: 1,
  status: 1,
  customerId: 1,
  createdAt: 1,
});

TransactionSchema.plugin(mongoosePaginate);
TransactionSchema.plugin(aggregatePaginate);
TransactionSchema.plugin(AutoIncrement, {
  id: 'transactionFxCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('transactionsfx', TransactionSchema);
module.exports.Schema = TransactionSchema;
