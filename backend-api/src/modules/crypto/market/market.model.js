const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;
const MarketSchema = new Schema(
  {
    recordId: { type: Number },
    baseAsset: { type: String, required: true },
    quoteAsset: { type: String, required: true },
    baseAssetId: { type: mongoose.Types.ObjectId, required: true, ref: 'asset' },
    quoteAssetId: { type: mongoose.Types.ObjectId, required: true, ref: 'asset' },
    name: { type: String },
    pairName: { type: String, unique: true },
    fee: { type: mongoose.Decimal128, default: 0.01 },
    minAmount: { type: mongoose.Decimal128, default: 0.001 },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: { type: mongoose.Types.ObjectId },
    updatedBy: { type: mongoose.Types.ObjectId },
  },
  { timestamps: true },
);

MarketSchema.plugin(mongoosePaginate);
MarketSchema.plugin(AutoIncrement, {
  id: 'marketsCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('markets', MarketSchema);
module.exports.Schema = MarketSchema;
