const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const TradeSchema = new Schema(
  {

    recordId: { type: Number },
    symbol: { type: String },
    amount: { type: String },
    price: { type: String },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'orders',
      required: true,
    },
    quoteAmount: { type: String },
    time: { type: Number },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      required: true,
    },
    commission: { type: String },
    commissionAsset: { type: String },
    mCommission: { type: String },
    mCommissionAsset: { type: String },
    partial: {
      type: Boolean,
      default: false,
    },
    hide: {
      type: Boolean,
      default: false,
    },
    excess: {
      type: Boolean,
      default: false,
    },
    excessAmount: {
      type: Number,
    },
  },
  { timestamps: true },
);

TradeSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

TradeSchema.plugin(mongoosePaginate);
TradeSchema.plugin(AutoIncrement, {
  id: 'tradeCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('trade', TradeSchema);
module.exports.DemoModel = model('demo-trade', TradeSchema);
module.exports.Schema = TradeSchema;
