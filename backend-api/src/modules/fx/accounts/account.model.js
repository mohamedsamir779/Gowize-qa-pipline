const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const { CONSTANTS } = require('src/common/data');

const { TRADING_ACCOUNT_TYPES } = CONSTANTS;

const TradingAccountSchema = new Schema(
  {

    recordId: { type: Number },
    accountTypeId: { type: Schema.Types.ObjectId, required: true, ref: 'TradingAccountType' },
    login: { type: Number, required: true },
    platform: { type: String, required: true },
    currency: { type: String, required: true, default: 'USD' },
    type: { type: String, required: true, enum: Object.keys(TRADING_ACCOUNT_TYPES) },
    isActive: { type: Boolean, default: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'customers', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: false },
  },
  { timestamps: true },
);

TradingAccountSchema.index({
  login: 1,
  platform: 1,
  type: 1,
  createdAt: 1,
  customerId: 1,
});

TradingAccountSchema.plugin(mongoosePaginate);
TradingAccountSchema.plugin(aggregatePaginate);
TradingAccountSchema.plugin(AutoIncrement, {
  id: 'tradingAccountCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('TradingAccount', TradingAccountSchema);
module.exports.Schema = TradingAccountSchema;
