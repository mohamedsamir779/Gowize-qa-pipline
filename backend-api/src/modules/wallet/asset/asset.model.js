const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(require('mongoose'));

const { model, Schema } = mongoose;
const AssetSchema = new Schema(
  {

    recordId: { type: Number },
    name: { type: String },
    isCrypto: { type: Boolean, default: true },
    description: { type: String },
    symbol: { type: String, unique: true },
    links: [{ type: String }],
    markup: { type: String },
    fee: {
      deposit: { type: String },
      withdrawal: { type: String },
    },
    externalId: { type: String },
    explorerLink: { type: String },
    minAmount: {
      deposit: { type: String },
      withdrawal: { type: String },
    },
    disabled: {
      deposit: { type: Boolean, default: false },
      withdrawal: { type: Boolean, default: false },
    },
    active: {
      type: Boolean,
      default: true,
    },
    createdBy: { type: Schema.Types.ObjectId },
    image: { type: String },
    networks: [{
      name: { type: String },
      chainId: { type: mongoose.Types.ObjectId },
    }],
    token: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

AssetSchema.plugin(mongoosePaginate);
AssetSchema.plugin(AutoIncrement, {
  id: 'assetCounter',
  inc_field: 'recordId',
  start_seq: 10000,
});

module.exports.Model = model('asset', AssetSchema);
module.exports.Schema = AssetSchema;
