const {
  model, Schema, Decimal128,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const OrderSchema = new Schema({
  recordId: { type: Number },
  timestamp: { type: Date, default: Date.now },
  lastTradeTimestamp: { type: Date },
  status: {
    type: String,
    enum: ['initialized', 'open', 'closed', 'canceled', 'expired', 'rejected'],
    default: 'initialized',
  },
  symbol: { type: String },
  type: { type: String },
  timeInForce: { type: String },
  side: { type: String },
  price: { type: Decimal128 },
  mPrice: { type: Decimal128 },
  frozenAmount: { type: Decimal128 },
  markup: {
    value: { type: Decimal128 },
    isPercentage: { type: Boolean },
  },
  mFeeGroup: {
    value: { type: Decimal128 },
    minValue: { type: Decimal128 },
    maxValue: { type: Decimal128 },
    isPercentage: { type: Boolean },
  },
  avg: { type: Decimal128, default: 0 },
  amount: { type: Decimal128 },
  filled: { type: Decimal128, default: 0 },
  remaining: { type: Decimal128 },
  cost: { type: Decimal128 },
  fee: {
    currency: { type: String },
    cost: { type: Decimal128 },
  },
  mFee: {
    currency: { type: String },
    cost: { type: Decimal128 },
  },
  paramsData: {
    type: Schema.Types.Mixed,
  },
  exchange: {
    type: String,
  },
  exchangeId: {
    type: String,
  },
  exchangeData: {
    type: Schema.Types.Mixed,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
  },
  tp: {
    type: String,
  },
  ttp: {
    type: String,
  },
  tsl: {
    type: String,
  },
  sl: {
    type: String,
  },
  excess: {
    type: Boolean,
    default: false,
  },
  excessAmount: {
    type: Decimal128,
    default: 0,
  },
  actFilled: {
    type: Decimal128,
    default: 0,
  },
  testnet: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true });

OrderSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

OrderSchema.plugin(mongoosePaginate);
OrderSchema.plugin(AutoIncrement, {
  id: 'orderCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('order', OrderSchema);
module.exports.DemoModel = model('demo-order', OrderSchema);
module.exports.Schema = OrderSchema;
