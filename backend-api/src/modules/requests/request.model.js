const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const { keys, CONSTANTS } = require('src/common/data');
const { TRADING_ACCOUNT_TYPES } = require('src/common/data/constants');

const { model, Schema } = mongoose;

const RequestSchema = new Schema(
  {

    recordId: { type: Number },
    type: {
      type: String,
      enum: Object.keys(CONSTANTS.REQUESTS_TYPES),
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
    status: {
      type: String,
      enum: Object.keys(CONSTANTS.REQUESTS_STATUS),
      default: CONSTANTS.REQUESTS_STATUS.PENDING,
    },
    customerId: { type: Schema.Types.ObjectId, ref: 'customers' },
    processedBy: { type: Schema.Types.ObjectId, ref: 'users' },
    content: {
      login: { type: Number },
      from: { type: Number, default: 100 },
      to: { type: Number },
      platform: { type: String },
      accountTypeId: { type: Schema.Types.ObjectId, ref: 'TradingAccountType' },
      currency: { type: String },
      type: { type: String, enum: Object.keys(TRADING_ACCOUNT_TYPES) },
      reason: { type: String },
    },
  },
  { timestamps: true },
);

RequestSchema.index({
  type: 1,
  status: 1,
  customerId: 1,
  createdAt: 1,
});

RequestSchema.plugin(mongoosePaginate);
RequestSchema.plugin(aggregatePaginate);
RequestSchema.plugin(AutoIncrement, {
  id: 'requestCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('request', RequestSchema);
module.exports.Schema = RequestSchema;
