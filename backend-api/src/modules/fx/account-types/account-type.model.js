const { model, Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));
const { CONSTANTS } = require('src/common/data');

const { TRADING_ACCOUNT_TYPES } = CONSTANTS;

const TradingAccountTypeSchema = new Schema(
  {
    recordId: { type: Number },
    title: { type: String, required: true },
    platform: { type: String, required: true },
    groupPath: { type: String, required: false },
    currencies: [
      {
        currency: { type: String, required: true },
        groupPath: { type: String, required: true },
      },
    ],
    minWithdrawal: { type: Number, required: true },
    minDeposit: { type: Number, required: true },
    type: {
      type: String,
      required: true,
      enum: Object.keys(TRADING_ACCOUNT_TYPES),
    },
    forCp: { type: Boolean, default: false },
    forCrm: { type: Boolean, default: false },
    forIbConfig: { type: Boolean, default: true },
    sequence: { type: Number, default: Math.floor(Math.random() * 100000) },
    leverages: { type: Array },
    defaultLeverage: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: false },
  },
  { timestamps: true },
);

TradingAccountTypeSchema.index({
  login: 1,
  platform: 1,
  type: 1,
  createdAt: 1,
});

TradingAccountTypeSchema.plugin(mongoosePaginate);
TradingAccountTypeSchema.plugin(AutoIncrement, {
  id: 'tradingAccountTypeCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('TradingAccountType', TradingAccountTypeSchema);
module.exports.Schema = TradingAccountTypeSchema;
