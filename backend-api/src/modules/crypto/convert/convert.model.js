const {
  model, Schema, Decimal128, Types,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const ConvertSchema = new Schema({
  recordId: { type: Number },
  timestamp: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['initialized', 'open', 'closed', 'canceled', 'expired', 'rejected'],
    default: 'initialized',
  },
  commonAsset: { type: String, required: true },
  fromAsset: { type: String, required: true },
  toAsset: { type: String, required: true },
  fromAssetId: { type: Types.ObjectId, required: true, ref: 'asset' },
  toAssetId: { type: Types.ObjectId, required: true, ref: 'asset' },
  fromAssetPrice: { type: Decimal128 },
  toAssetPrice: { type: Decimal128 },
  amount: { type: Decimal128 },
  toAmount: { type: Decimal128 },
  mFeeGroup: {
    value: { type: Decimal128 },
    minValue: { type: Decimal128 },
    maxValue: { type: Decimal128 },
    isPercentage: { type: Boolean },
  },
  mFee: {
    currency: { type: String },
    cost: { type: Decimal128 },
  },
  paramsData: {
    type: Schema.Types.Mixed,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'customers',
  },
},
{ timestamps: true });

ConvertSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

ConvertSchema.plugin(mongoosePaginate);
ConvertSchema.plugin(AutoIncrement, {
  id: 'convertCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('convert', ConvertSchema);
module.exports.DemoModel = model('demo-convert', ConvertSchema);
module.exports.Schema = ConvertSchema;
