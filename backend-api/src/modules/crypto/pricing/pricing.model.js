const {
  model, Schema, Decimal128,
} = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const PricingSchema = new Schema(
  {
    recordId: { type: Number },
    pairName: { type: String },
    marketId: {
      type: Schema.Types.ObjectId,
      ref: 'markets',
      required: true,
    },
    marketPrice: { type: Decimal128 },
    buyPrice: { type: Decimal128 },
    sellPrice: { type: Decimal128 },
    exchange: { type: String },
    open: { type: Decimal128 },
    close: { type: Decimal128 },
    percentage: { type: Decimal128 },
    volume: { type: Decimal128 },
  },
  { timestamps: true },
);

PricingSchema.index({
  title: 1,
  key: 1,
  createdAt: 1,
});

PricingSchema.plugin(mongoosePaginate);
PricingSchema.plugin(AutoIncrement, {
  id: 'pricingCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('pricing', PricingSchema);
module.exports.Schema = PricingSchema;
