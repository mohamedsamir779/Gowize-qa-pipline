const {
  model, Schema, Decimal128,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const TransactionFeeGroupSchema = new Schema({
  recordId: { type: Number },
  title: { type: String },
  isPercentage: { type: Schema.Types.Boolean, default: true },
  isDefault: { type: Schema.Types.Boolean, default: false },
  value: { type: Decimal128 },
  minValue: { type: Decimal128 },
  maxValue: { type: Decimal128 },
  assets: {
    type: Schema.Types.Mixed,
  },
  isActive: { type: Schema.Types.Boolean, default: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
},
{ timestamps: true });

TransactionFeeGroupSchema.index({
  title: 1,
  createdAt: 1,
});

TransactionFeeGroupSchema.plugin(mongoosePaginate);
TransactionFeeGroupSchema.plugin(AutoIncrement, {
  id: 'transactionFeeGroupCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('transaction-fee-group', TransactionFeeGroupSchema);
module.exports.Schema = TransactionFeeGroupSchema;
