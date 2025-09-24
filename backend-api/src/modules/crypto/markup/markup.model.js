const {
  model, Schema, Decimal128,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const MarkupSchema = new Schema({
  recordId: { type: Number },
  title: { type: String },
  isPercentage: { type: Schema.Types.Boolean, default: true },
  isDefault: { type: Schema.Types.Boolean, default: false },
  value: { type: Decimal128 },
  isActive: { type: Schema.Types.Boolean, default: true },
  /**
     * Example of how markup.markets will be
     * symbols: {
     *  'BTC/USDT': {
     *    value: 0.5,
     *    isPercentage: false,
     *  }
     * }
     */
  markets: {
    type: Schema.Types.Mixed,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
},
{ timestamps: true });

MarkupSchema.index({
  title: 1,
  createdAt: 1,
});

MarkupSchema.plugin(mongoosePaginate);
MarkupSchema.plugin(AutoIncrement, {
  id: 'markupCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('markup', MarkupSchema);
module.exports.Schema = MarkupSchema;
