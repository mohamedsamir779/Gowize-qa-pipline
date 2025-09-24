const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { CONSTANTS } = require('src/common/data');

const ProductTransferSchema = new Schema(
  {
    recordId: { type: Number },
    status: {
      type: String,
      enum: Object.keys(CONSTANTS.TRANSACTIONS_STATUS),
      default: CONSTANTS.TRANSACTIONS_STATUS.PENDING,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'customers' },
    processedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    reason: { type: String },
    amount: { type: Number, default: 0 }, // for source -> To be deducted
    targetAmount: { type: Number, default: 0 }, // for destination -> To be added
    fee: { type: Number, default: 0 },
    baseCurrency: { type: String, default: 'USD' },
    targetCurrency: { type: String, default: 'USD' },
    source: { type: String },
    destination: { type: String },
    note: { type: String },
    fromId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'fromSourceModel',
    },
    toId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'toSourceModel',
    },
    fromSourceModel: {
      type: String,
      required: true,
      enum: ['TradingAccount', 'wallet'],
    },
    toSourceModel: {
      type: String,
      required: true,
      enum: ['TradingAccount', 'wallet'],
    },
    conversionRate: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductTransferSchema.index({
  status: 1,
  customerId: 1,
  createdAt: 1,
});

ProductTransferSchema.plugin(mongoosePaginate);
ProductTransferSchema.plugin(aggregatePaginate);
ProductTransferSchema.plugin(AutoIncrement, {
  id: 'walletTransferCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('wallet-transfers', ProductTransferSchema);
module.exports.Schema = ProductTransferSchema;
