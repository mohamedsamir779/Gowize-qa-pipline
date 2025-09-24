const {
  model, Schema, Decimal128,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const FeeGroupSchema = new Schema({
  recordId: { type: Number },
  title: { type: String },
  isPercentage: { type: Schema.Types.Boolean, default: true },
  isDefault: { type: Schema.Types.Boolean, default: false },
  value: { type: Decimal128 },
  minValue: { type: Decimal128 },
  maxValue: { type: Decimal128 },
  markets: {
    type: Schema.Types.Mixed,
  },
  isActive: { type: Schema.Types.Boolean, default: true },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
},
{ timestamps: true });

FeeGroupSchema.index({
  title: 1,
  createdAt: 1,
});

FeeGroupSchema.plugin(mongoosePaginate);
FeeGroupSchema.plugin(AutoIncrement, {
  id: 'feeGroupCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('fee-group', FeeGroupSchema);
module.exports.Schema = FeeGroupSchema;
