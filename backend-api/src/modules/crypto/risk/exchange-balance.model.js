const {
  model, Schema,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const ExchangeBalanceSchema = new Schema({
  recordId: { type: Number },
  free: { type: Schema.Types.Mixed },
  used: { type: Schema.Types.Mixed },
  total: { type: Schema.Types.Mixed },
  exchange: { type: String },
  info: {
    type: Schema.Types.Mixed,
  },
  timestamp: Number,
},
{
  timestamps: true,
  strict: false,
});

ExchangeBalanceSchema.index({
  title: 1,
  createdAt: 1,
});

ExchangeBalanceSchema.plugin(mongoosePaginate);
ExchangeBalanceSchema.plugin(AutoIncrement, {
  id: 'exchangeBalanceCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('exchange-balance', ExchangeBalanceSchema);
module.exports.Schema = ExchangeBalanceSchema;
